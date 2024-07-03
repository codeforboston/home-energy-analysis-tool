const BASE_URL =  "https://geocoding.geo.census.gov";
const ADDRESS_ENDPOINT = "/geocoder/geographies/onelineaddress";

interface CensusGeocoderResponse {
    result: {
      input: {
        address: {
          address: string;
        };
        vintage: {
          isDefault: boolean;
          id: string;
          vintageName: string;
          vintageDescription: string;
        };
        benchmark: {
          isDefault: boolean;
          benchmarkDescription: string;
          id: string;
          benchmarkName: string;
        };
      };
      addressMatches: AddressMatch[];
    };
  }
  
  interface AddressMatch {
    tigerLine: {
      side: string;
      tigerLineId: string;
    };
    geographies: {
      'State Legislative Districts - Upper': Geography[];
      'States': Geography[];
      'Combined Statistical Areas': Geography[];
      '2020 Urban Areas - Corrected': Geography[];
      'County Subdivisions': Geography[];
      'State Legislative Districts - Lower': Geography[];
      'Incorporated Places': Geography[];
      'Counties': Geography[];
      '116th Congressional Districts': Geography[];
      'Census Tracts': Geography[];
      'Census Blocks': Geography[];
    };
    coordinates: {
      x: number;
      y: number;
    };
    addressComponents: {
      zip: string;
      streetName: string;
      preType: string;
      city: string;
      preDirection: string;
      suffixDirection: string;
      fromAddress: string;
      state: string;
      suffixType: string;
      toAddress: string;
      suffixQualifier: string;
      preQualifier: string;
    };
    matchedAddress: string;
  }
  
  interface Geography {
    GEOID: string;
    CENTLAT: string;
    AREAWATER: number;
    STATE: string;
    BASENAME: string;
    OID: string;
    LSADC: string;
    [key: string]: string | number; /* a bit dubious catchall by the
                                     LLM for all the semi-optional keys */
  }

class GeocodeUtil {

    /**
     * 
     * @param {*} address
     * @returns x,y {x,y} lon/lat. If the given address was valid. I've implemented 0 handling here. 
     *  This is the happiest of paths, with hardcoded values also...
     */
    async getLL(address: string) {
        const params = new URLSearchParams();

        params.append("address",address);
        params.append("format","json");
        params.append("benchmark", "2020");
        params.append("vintage","Census2020_Census2020")

        let url = new URL(BASE_URL+ADDRESS_ENDPOINT+"?"+params.toString());
        let rezzy = await fetch(url);
        let jrez = await rezzy.json() as CensusGeocoderResponse;
        // TODO: Return all addresses and let the user choose the right one
        let coordz = jrez.result.addressMatches[0].coordinates;
        // console.log(JSON.stringify(jrez, null, 2));
        return coordz;
    }
}

export default GeocodeUtil;