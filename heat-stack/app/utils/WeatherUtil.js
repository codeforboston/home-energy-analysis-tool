import { time } from "console";

const BASE_URL = "https://archive-api.open-meteo.com";
const WHATEVER_PATH = "/v1/archive";
const params = new URLSearchParams();

class WeatherUtil {

    async getThatWeathaData(longitude,latitude,startDate, endDate) {
        params.append("latitude",latitude);
        params.append("longitude",longitude);
        params.append("daily","temperature_2m_max");
        params.append("timezone","America/New_York");
        params.append("start_date",startDate);
        params.append("end_date",endDate);
        params.append("temperature_unit","fahrenheit");

        let url = new URL(BASE_URL+WHATEVER_PATH+"?"+params.toString());
        let rezzy = await fetch(url);
        let jrez = await rezzy.json();
        let dates = [];
        jrez.daily.time.forEach(timeStr => {
            dates.push(new Date(timeStr));
        });
        let temperatures = jrez.daily.temperature_2m_max
        // console.log({dates,temperatures});
        return {dates,temperatures};
    }
}

export default WeatherUtil;