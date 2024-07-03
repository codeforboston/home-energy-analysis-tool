const BASE_URL = "https://archive-api.open-meteo.com";
const WHATEVER_PATH = "/v1/archive";

interface ArchiveApiResponse {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    daily_units: {
        time: string;
        temperature_2m_max: string;
    };
    daily: {
        time: string[];
        temperature_2m_max: (number | null)[];
    };
}

class WeatherUtil {

    /**
     * @param {*} longitude 
     * @param {*} latitude 
     * @param {*} startDate 
     * @param {*} endDate 
     * @returns { object } 
     * example for 2 years before 4th of June 2024: {
     *   dates: [ 2022-06-04T00:00:00.000Z, 2022-06-05T00:00:00.000Z, ... ],
     *   temperatures: [ 71.6, 76.3, ... ]
     * }
     */
    async getThatWeathaData(longitude: number, latitude: number, startDate: string, endDate: string) {
        const params = new URLSearchParams();
        
        params.append("latitude",`${ latitude }`);
        params.append("longitude",`${ longitude }`);
        params.append("daily","temperature_2m_max");
        params.append("timezone","America/New_York");
        params.append("start_date",startDate);
        params.append("end_date",endDate);
        params.append("temperature_unit","fahrenheit");

        let url = new URL(BASE_URL+WHATEVER_PATH+"?"+params.toString());
        let rezzy = await fetch(url);
        let jrez = await rezzy.json() as ArchiveApiResponse;
        let dates: Date[] = [];
        jrez.daily.time.forEach((timeStr: string) => {
            dates.push(new Date(timeStr));
        });
        let temperatures: (number | null)[] = jrez.daily.temperature_2m_max
        // console.log({dates,temperatures});
        return {dates,temperatures};
    }
}

export default WeatherUtil;