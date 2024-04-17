const BASE_URL =  "https://geocoding.geo.census.gov";
const ADDRESS_ENDPOINT = "/geocoder/locations/address";
const params = new URLSearchParams();

class GeocodeUtil {

    /**
     * 
     * @param {*} street 
     * @param {*} city 
     * @param {*} state 
     * @returns x,y {x,y} lon/lat. If the given address was valid. I've implemented 0 handling here. 
     *  This is the happiest of paths, with hardcoded values also...
     */
    async getLL(address) {
        params.append("onelineaddress",address);
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