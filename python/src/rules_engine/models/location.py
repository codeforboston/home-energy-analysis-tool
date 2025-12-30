from dataclasses import dataclass
from typing import Dict, Optional


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
