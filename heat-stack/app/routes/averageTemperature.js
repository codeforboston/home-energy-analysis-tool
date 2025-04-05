export let loader = async () => {
    return await getAverageTemperatureOfAddress();
}

/**
 * @returns The average temperature of an address based on its county_id
 */
export async function getAverageTemperatureOfAddress() {
    return 4;
}