import test from "@playwright/test";
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

export async function loader() {
 const href = 'https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&daily=temperature_2m_max&timezone=America%2FNew_York&start_date=2022-01-01&end_date=2023-08-30&temperature_unit=fahrenheit';
  const res = await fetch(href);
  return json(await res.json());
}

export function WeatherExample() {

  const gists = useLoaderData<typeof loader>();
  return (
    <ul>
      {'5'}
    </ul>
  );
}

// import { useFetcher } from "@remix-run/react";
// import { useEffect } from "react";

// export function WeatherExample() {

//     // 2 separate routes - including one that doesn't load
//     // the python to avoid the long restart times.

//     /* 
//         Historical archival records API: https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&daily=temperature_2m_max&timezone=America%2FNew_York&start_date=2022-01-01&end_date=2023-08-30&temperature_unit=fahrenheit
//         Current week forecast API: https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&daily=temperature_2m_max&timezone=America%2FNew_York&past_days=5&forecast_days=1&temperature_unit=fahrenheit
//     */
//     const fetcher = useFetcher();
//     const href = 'https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&daily=temperature_2m_max&timezone=America%2FNew_York&start_date=2022-01-01&end_date=2023-08-30&temperature_unit=fahrenheit';

//     // trigger the fetch with these
//     //   <fetcher.Form method="GET" action="https://archive-api.open-meteo.com/v1/archive?latitude=52.52&longitude=13.41&daily=temperature_2m_max&timezone=America%2FNew_York&start_date=2022-01-01&end_date=2023-08-30&temperature_unit=fahrenheit" />;

//     // fetcher.load(href)

//     useEffect(() => {
//     // fetcher.submit(data, options);
//     fetcher.load(href);
//     }, []);

//     // // build UI with these
//     // fetcher.state;
//     // fetcher.formMethod;
//     // fetcher.formAction;
//     // fetcher.formData;
//     // fetcher.formEncType;
//     // fetcher.data;
//     return (
//         <div>{ fetcher.data }</div>
//     )
// }
