const BASE_URL =  "https://geocoding.geo.census.gov";
const ADDRESS_ENDPOINT = "/geocoder/locations/onelineaddress";

class GeocodeUtil {

    /**
     * 
     * @param {*} address
     * @returns x,y {x,y} lon/lat. If the given address was valid. I've implemented 0 handling here. 
     *  This is the happiest of paths, with hardcoded values also...
     */
    async getLL(address) {
        const params = new URLSearchParams();

        params.append("address",address);
        params.append("format","json");
        params.append("benchmark",2020);

        let url = new URL(BASE_URL+ADDRESS_ENDPOINT+"?"+params.toString());
        let rezzy = await fetch(url);
        let jrez = await rezzy.json();
        let coordz = jrez.result.addressMatches[0].coordinates;
        console.log(coordz);
        return coordz;
    }
}

export default GeocodeUtil;