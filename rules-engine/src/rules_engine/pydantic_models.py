"""
Data models for input and output data in the rules engine.
"""

from dataclasses import dataclass
from datetime import date
from enum import Enum
from typing import Annotated, Any, List, Optional

from pydantic import BaseModel, BeforeValidator, Field


class AnalysisType(Enum):
    """Enum for analysis type. 
    'Inclusion' in calculations is now determined by 
    the default_inclusion_by_calculation and inclusion_override variables
    Use HDDs to determine if shoulder months
    are heating or non-heating or not allowed,
    or included or excluded
    """

    ALLOWED_HEATING_USAGE = 1 # winter months - allowed in heating usage calculations
    ALLOWED_NON_HEATING_USAGE = -1 # summer months - allowed in non-heating usage calculations
    NOT_ALLOWED_IN_CALCULATIONS = 0 # shoulder months that fall outside reasonable bounds 



class FuelType(Enum):
    """Enum for fuel types. Values are BTU per usage"""

    GAS = 100000  # BTU / therm
    OIL = 139600  # BTU / gal
    PROPANE = 91333  # BTU / gal


def validate_fuel_type(value: Any) -> FuelType:
    if isinstance(value, FuelType):
        return value

    try:
        return FuelType[value]
    except KeyError as e:
        raise ValueError(
            f"Error validating fuel type {e}. Valid choices are: {[x.name for x in FuelType]}"
        )


class SummaryInput(BaseModel):
    """From Summary Tab"""

    # design_temperature_override: float
    living_area: float = Field(description="Summary!B10")
    fuel_type: Annotated[FuelType, BeforeValidator(validate_fuel_type)] = Field(
        description="Summary!B11"
    )
    heating_system_efficiency: float = Field(description="Summary!B12")
    thermostat_set_point: float = Field(description="Summary!B17")
    setback_temperature: Optional[float] = Field(description="Summary!B18")
    setback_hours_per_day: Optional[float] = Field(description="Summary!B19")
    design_temperature: float = Field(description="TDesign")


class DhwInput(BaseModel):
    """From DHW (Domestic Hot Water) Tab"""

    number_of_occupants: int = Field(description="DHW!B4")
    estimated_water_heating_efficiency: Optional[float] = Field(description="DHW!B5")
    stand_by_losses: Optional[float] = Field(description="DHW!B6")


class OilPropaneBillingRecordInput(BaseModel):
    """From Oil-Propane tab"""

    period_end_date: date = Field(description="Oil-Propane!B")
    gallons: float = Field(description="Oil-Propane!C")
    inclusion_override: Optional[bool] = Field(description="Oil-Propane!F")


class OilPropaneBillingInput(BaseModel):
    """From Oil-Propane tab. Container for holding all rows of the billing input table."""

    records: List[OilPropaneBillingRecordInput]
    preceding_delivery_date: date = Field(description="Oil-Propane!B6")


class NaturalGasBillingRecordInput(BaseModel):
    """From Natural Gas tab. A single row of the Billing input table."""

    period_start_date: date = Field(description="Natural Gas!A")
    period_end_date: date = Field(description="Natural Gas!B")
    usage_therms: float = Field(description="Natural Gas!D")
    inclusion_override: Optional[AnalysisType] = Field(description="Natural Gas!E")


class NaturalGasBillingInput(BaseModel):
    """From Natural Gas tab. Container for holding all rows of the billing input table."""

    records: List[NaturalGasBillingRecordInput]


class NormalizedBillingPeriodRecordInput(BaseModel):
    period_start_date: date
    period_end_date: date
    usage: float
    analysis_type_override: Optional[AnalysisType] # for testing only


class NormalizedBillingPeriodRecord:
    input: NormalizedBillingPeriodRecordInput
    analysis_type: AnalysisType
    default_inclusion_by_calculation: bool
    inclusion_override: bool
    eliminated_as_outlier: bool


class TemperatureInput(BaseModel):
    dates: List[date]
    temperatures: List[float]


class SummaryOutput(BaseModel):
    """From Summary tab"""

    estimated_balance_point: float = Field(
        description="Summary!B20"
    )  # This is hand-calculated in the spreadsheet
    other_fuel_usage: float = Field(description="Summary!B15")
    average_indoor_temperature: float = Field(description="Summary!B24")
    difference_between_ti_and_tbp: float = Field(description="Summary!B25")
    design_temperature: float = Field(description="Summary!B26")
    whole_home_heat_loss_rate: float = Field(
        description="Summary!B27"
    )  # Whole Home UA. UA = heat loss rate
    standard_deviation_of_heat_loss_rate: float = Field(
        description="Summary!B28"
    )  # Standard deviation of UA
    average_heat_load: float = Field(description="Summary!B29")
    maximum_heat_load: float = Field(description="Summary!B30")


class BalancePointGraphRow(BaseModel):
    """From Summary page"""

    balance_point: float = Field(description="Summary!G33:35")  # degree F
    heat_loss_rate: float = Field(
        description="Summary!H33:35"
    )  # BTU / (hr-deg. F) (UA)
    change_in_heat_loss_rate: float = Field(
        description="Summary!I33:35"
    )  # BTU / (hr-deg. F) (change in UA)
    percent_change_in_heat_loss_rate: float = Field(description="Summary!J33:35")
    standard_deviation: float = Field(description="Summary!K33:35")


class BalancePointGraph(BaseModel):
    """From Summary page"""

    records: List[BalancePointGraphRow]


class RulesEngineResult:
    summary_output: SummaryOutput
    balance_point_graph: BalancePointGraph
    billing_records: List[NormalizedBillingPeriodRecord]


@dataclass
class Constants:
    BALANCE_POINT_SENSITIVITY: float = 0.5
    DESIGN_SET_POINT: float = 70  # deg. F
    DAILY_DHW_CONSUMPTION_PER_OCCUPANT: float = 15.78  # Gal/day/person
    WATER_WEIGHT: float = 8.33  # lbs/gal
    ENTERING_WATER_TEMPERATURE: float = 55  # deg. F
    LEAVING_WATER_TEMPERATURE: float = 125  # deg. F
    SPECIFIC_HEAT_OF_WATER: float = 1.00  # BTU/lbs-deg. F
    DEFAULT_STAND_BY_LOSSES: float = 0.05  #
    FUEL_OIL_BTU_PER_GAL: float = 139000
