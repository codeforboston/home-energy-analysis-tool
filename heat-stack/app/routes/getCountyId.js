import { json } from "@remix-run/node";
import { getCountyId } from "../utils/date-temp-util";


/**
 * Action function to handle POST requests
 * @param {Request} request
 * @returns {Promise<Response>}
 */
export async function action({ request }) {
    const formData = await request.formData();
    const address = formData.get("address");

    if (!address) {
        return json({ error: "Address is required" }, { status: 400 });
    }

    try {
        const countyId = await getCountyId(address);
        return json({ countyId });
    } catch (error) {
        return json({ error: error }, { status: 500 });
    }
}