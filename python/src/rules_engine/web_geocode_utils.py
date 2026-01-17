import json
from dataclasses import dataclass
from typing import Any, Dict, Optional
from urllib import parse as urlparse
from urllib import request as urlrequest

BASE_URL = "https://geocoding.geo.census.gov"
ADDRESS_ENDPOINT = "/geocoder/geographies/onelineaddress"


@dataclass
class AddressComponent:
    street: str
    city: Optional[str]
    state: Optional[str]
    zip: Optional[str]
    formattedAddress: Optional[str]


@dataclass
class Location:
    coordinates: Dict[str, float]
    state: Optional[str]
    county_id: Optional[str]
    addressComponents: AddressComponent


class WebGeocodeUtil:
    @staticmethod
    def parse_geo_result(data: Dict[str, Any], address: str) -> Optional[Location]:
        address_matches = data.get("result", {}).get("addressMatches", [])
        if not address_matches:
            return None

        address_match = address_matches[0]
        coordinates: Dict[str, float] = address_match.get("coordinates", {})
        geographies: Dict[str, Any] = address_match.get("geographies", {})
        counties: Any = geographies.get("Counties", [{}])
        address_components: Dict[str, Any] = address_match.get("addressComponents", {})

        # Combine parts to form a street
        street = " ".join(
            filter(
                None,
                [
                    address_components.get("preDirection"),
                    address_components.get("streetName"),
                    address_components.get("suffixType"),
                ],
            )
        )

        return Location(
            coordinates=coordinates,
            state=counties[0].get("STATE"),
            county_id=counties[0].get("COUNTY"),
            addressComponents=AddressComponent(
                street=street,
                city=address_components.get("city"),
                state=address_components.get("state"),
                zip=address_components.get("zip"),
                formattedAddress=address_match.get("matchedAddress", address),
            ),
        )

    @staticmethod
    def get_ll(address: str) -> Optional["Location"]:
        """
        Returns latitude/longitude and related geocoding information from the U.S. Census Geocoder.
        """
        params: Dict[str, str] = {
            "address": address,
            "format": "json",
            "benchmark": "2020",
            "vintage": "Census2020_Census2020",
        }

        query_string = urlparse.urlencode(params)
        url = f"{BASE_URL}{ADDRESS_ENDPOINT}?{query_string}"

        try:
            with urlrequest.urlopen(url) as response:
                if response.status != 200:
                    return None
                data = json.loads(response.read().decode())
        except Exception:
            return None

        return WebGeocodeUtil.parse_geo_result(data, address)


# Example usage
if __name__ == "__main__":
    util = WebGeocodeUtil()
    result = util.get_ll("1 Broadway, Cambridge, MA 02142")
    # print removed
