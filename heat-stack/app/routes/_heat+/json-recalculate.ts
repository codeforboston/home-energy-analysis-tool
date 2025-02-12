// app/routes/json-recalculate.ts
/* Alternative to locally running executeRoundtripAnalyticsFromFormJs() when pyodide may not be available 

run it in this JSON API and return the result */

import { json } from "@remix-run/node";
import { 
  ActionFunctionArgs,
  LoaderFunctionArgs
} from "@remix-run/node";

// Type definitions for our data structures
interface FormFieldData {
  // Add your form field types here
  [key: string]: any;
}

interface WeatherDateData {
  // Add your weather date types here
  [key: string]: any;
}

interface GasBillData {
  // Add your gas bill types here
  [key: string]: any;
}

interface RequestData {
  submittedFormFieldData: FormFieldData;
  convertedDatesFromWeatherData: WeatherDateData;
  gasBillDataWithUserAdjustments: string; // JSON string
  state_id: string;
  county_id: string;
}

// Loader function for GET requests
export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  
  // Extract query parameters
  const state_id = url.searchParams.get("state_id");
  const county_id = url.searchParams.get("county_id");
  const submittedFormFieldData = url.searchParams.get("submittedFormFieldData");
  const convertedDatesFromWeatherData = url.searchParams.get("convertedDatesFromWeatherData");
  const gasBillDataWithUserAdjustments = url.searchParams.get("gasBillDataWithUserAdjustments");

  // Validate required parameters
  if (!state_id || !county_id || !submittedFormFieldData || 
      !convertedDatesFromWeatherData || !gasBillDataWithUserAdjustments) {
    return json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  }

  try {
    // Parse JSON strings
    const parsedFormData = JSON.parse(submittedFormFieldData);
    const parsedWeatherData = JSON.parse(convertedDatesFromWeatherData);
    
    // Create response object
    const responseData: RequestData = {
      submittedFormFieldData: parsedFormData,
      convertedDatesFromWeatherData: parsedWeatherData,
      gasBillDataWithUserAdjustments,
      state_id,
      county_id,
    };

    return json(responseData);
  } catch (error) {
    return json(
      { error: "Invalid JSON data provided" },
      { status: 400 }
    );
  }
}

// Action function for POST requests
export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json(
      { error: "Method not allowed?" },
      { status: 405 }
    );
  }

  try {
    const body = await request.json();
    
    // Validate required fields
    const {
      submittedFormFieldData,
      convertedDatesFromWeatherData,
      gasBillDataWithUserAdjustments,
      state_id,
      county_id,
    } = body;

    if (!submittedFormFieldData || !convertedDatesFromWeatherData || 
        !gasBillDataWithUserAdjustments || !state_id || !county_id) {
      return json(
        { error: "Missing required fields in request body" },
        { status: 400 }
      );
    }

    // Validate that gasBillDataWithUserAdjustments is a JSON string
    if (typeof gasBillDataWithUserAdjustments !== "string") {
      return json(
        { error: "gasBillDataWithUserAdjustments must be a JSON string" },
        { status: 400 }
      );
    }

    // Create response object
    const responseData: RequestData = {
      submittedFormFieldData,
      convertedDatesFromWeatherData,
      gasBillDataWithUserAdjustments,
      state_id,
      county_id,
    };

    // Process the data and return response
    return json(responseData);
  } catch (error) {
    return json(
      { error: "Invalid request data" },
      { status: 400 }
    );
  }
}

// Example usage on the client side:
/*
// GET request
fetch('/api/data-processing?state_id=CA&county_id=123&submittedFormFieldData={"field":"value"}&convertedDatesFromWeatherData={"date":"2024-02-11"}&gasBillDataWithUserAdjustments={"bill":100}')

// POST request
fetch('/api/data-processing', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    state_id: 'CA',
    county_id: '123',
    submittedFormFieldData: { field: 'value' },
    convertedDatesFromWeatherData: { date: '2024-02-11' },
    gasBillDataWithUserAdjustments: JSON.stringify({ bill: 100 })
  })
})
*/