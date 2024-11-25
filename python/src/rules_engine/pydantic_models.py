"""
Data models for input and output data in the rules engine.
"""

from dataclasses import dataclass
from datetime import date, datetime
from enum import Enum
from functools import cached_property
from typing import Annotated, Any, Literal, Optional, Sequence

from pydantic import BaseModel, BeforeValidator, ConfigDict, Field, computed_field


class AnalysisType(Enum):
    """
    Enum for analysis type.

    'Inclusion' in calculations is now determined by
    the date_to_analysis_type calculation and the inclusion_override variable

    TODO: determine if the following logic has actually been implemented...
    Use HDDs to determine if shoulder months
    are heating or non-heating or not allowed,
    or included or excluded
    """

    # winter months - allowed in heating usage calculations
    ALLOWED_HEATING_USAGE = 1
    # summer months - allowed in non-heating usage calculations
    ALLOWED_NON_HEATING_USAGE = -1
    # shoulder months - these fall outside reasonable bounds
    NOT_ALLOWED_IN_CALCULATIONS = 0


class FuelType(Enum):
    """
    Enum for fuel types.

    Values are BTU per usage
    """

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


class HeatLoadInput(BaseModel):
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

    period_end_date: datetime = Field(description="Oil-Propane!B")
    gallons: float = Field(description="Oil-Propane!C")
    inclusion_override: Optional[bool] = Field(description="Oil-Propane!F")


class OilPropaneBillingInput(BaseModel):
    """From Oil-Propane tab. Container for holding all rows of the billing input table."""

    records: Sequence[OilPropaneBillingRecordInput]
    preceding_delivery_date: datetime = Field(description="Oil-Propane!B6")


class NaturalGasBillingRecordInput(BaseModel):
    """From Natural Gas tab. A single row of the Billing input table."""

    period_start_date: datetime = Field(description="Natural Gas!A")
    period_end_date: datetime = Field(description="Natural Gas!B")
    usage_therms: float = Field(description="Natural Gas!D")
    inclusion_override: Optional[bool] = Field(description="Natural Gas!E")


class NaturalGasBillingInput(BaseModel):
    """From Natural Gas tab. Container for holding all rows of the billing input table."""

    records: Sequence[NaturalGasBillingRecordInput]

    # Suppress mypy error when computed_field is used with cached_property; see https://github.com/python/mypy/issues/1362
    @computed_field  # type: ignore[misc]
    @cached_property
    def overall_start_date(self) -> datetime:
        if len(self.records) == 0:
            raise ValueError(
                "Natural gas billing records cannot be empty."
                + "Could not calculate overall start date from empty natural gas billing records."
                + "Try again with non-empty natural gas billing records."
            )

        min_date = datetime.max
        for record in self.records:
            min_date = min(min_date, record.period_start_date)
        return min_date

    # Suppress mypy error when computed_field is used with cached_property; see https://github.com/python/mypy/issues/1362
    @computed_field  # type: ignore[misc]
    @cached_property
    def overall_end_date(self) -> datetime:
        if len(self.records) == 0:
            raise ValueError(
                "Natural gas billing records cannot be empty."
                + "Could not calculate overall start date from empty natural gas billing records."
                + "Try again with non-empty natural gas billing records."
            )

        max_date = datetime.min
        for record in self.records:
            max_date = max(max_date, record.period_end_date)
        return max_date


class NormalizedBillingPeriodRecordBase(BaseModel):
    """
    Base class for a normalized billing period record.

    Holds data inputs provided by the UI as fields.
    """

    model_config = ConfigDict(validate_assignment=True)

    period_start_date: datetime = Field(frozen=True)
    period_end_date: datetime = Field(frozen=True)
    usage: float = Field(frozen=True)
    inclusion_override: bool = Field(frozen=True)


class NormalizedBillingPeriodRecord(NormalizedBillingPeriodRecordBase):
    """
    Derived class for holding a normalized billing period record.

    Holds generated data that is calculated by the rules engine.
    """

    model_config = ConfigDict(validate_assignment=True)

    analysis_type: AnalysisType = Field(frozen=True)
    default_inclusion: bool = Field(frozen=True)
    eliminated_as_outlier: bool = Field(frozen=True)
    whole_home_heat_loss_rate: Optional[float] = Field(frozen=True)


def _date_string_parser(rate: str) -> datetime:
    return datetime.strptime(rate, "%Y-%m-%d")


class TemperatureInput(BaseModel):
    dates: list[Annotated[datetime, BeforeValidator(_date_string_parser)]]
    temperatures: list[float]


class HeatLoadOutput(BaseModel):
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

    records: list[BalancePointGraphRow]


class RulesEngineResult(BaseModel):
    heat_load_output: HeatLoadOutput
    balance_point_graph: BalancePointGraph
    billing_records: list[NormalizedBillingPeriodRecord]


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
