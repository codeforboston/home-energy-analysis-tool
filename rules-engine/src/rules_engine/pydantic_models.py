"""
Data models for input and output data in the rules engine.
"""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import date


class FuelType(Enum):
    """Enum for fuel types. Values are BTU per usage"""
    GAS = 100000
    OIL = 139600
    PROPANE = 91333


class SummaryInput(BaseModel):
    """From Summary Tab"""
    design_temperature: float
    living_area: float = Field(description="Summary!B10")
    fuel_type: FuelType = Field(description="Summary!B11")
    heating_system_efficiency: float = Field(description="Summary!B12")
    thermostat_set_point: float = Field(description="Summary!B17")
    setback_temperature: float = Field(description="Summary!B18")
    setback_hours_per_day: float = Field(description="Summary!B19")


class DhwInput(BaseModel):
    """From DHW (Domestic Hot Water) Tab """
    number_of_occupants: int = Field(description="DHW!B4")
    estimated_water_heating_efficiency: float = Field(description="DHW!B5")
    stand_by_losses: float = Field(description="DHW!B6")

class OilPropaneBillingInput(BaseModel):
    """From Oil-Propane tab"""
    period_end_date: date = Field(description="Oil-Propane!B")
    gallons: float = Field(description="Oil-Propane!C")
    exclude: bool


class NaturalGasBillingRecordInput(BaseModel):
    """From Natural Gas tab. A single row of the Billing input table."""
    period_end_date: date = Field(description="Natural Gas!B")
    usage_therms: float = Field(description="Natural Gas!D")
    exclude: bool

class NaturalGasBillingInput(BaseModel):
    """From Natural Gas tab. Container for holding all rows of the billing input table."""
    period_start_date: date
    records: List[NaturalGasBillingRecordInput]


class SummaryOutput(BaseModel):
    """From Summary tab"""
    estimated_balance_point: float = Field(description="Summary!B20") # This is hand-calculated in the spreadsheet
    other_fuel_usage: float = Field(description="Summary!B15")
    average_indoor_temperature: float = Field(description="Summary!B24")
    difference_between_ti_and_tbp: float = Field(description="Summary!B25")
    design_temperature: float = Field(description="Summary!B26")
    whole_home_heat_loss_rate: float = Field(description="Summary!B27") # UA = heat loss rate
    standard_deviation_of_heat_loss_rate: float = Field(description="Summary!B28")
    average_heat_load: float = Field(description="Summary!B29")
    maximum_heat_load: float = Field(description="Summary!B30")

class BalancePointGraphRow(BaseModel):
    """From Summary page"""
    balance_pt: float = Field(description="Summary!G33:35")
    ua: float = Field(description="Summary!H33:35")
    change_in_ua: float = Field(description="Summary!I33:35")
    pct_change: float = Field(description="Summary!J33:35")
    std_dev: float = Field(description="Summary!K33:35")

class BalancePointGraph(BaseModel):
    """From Summary page"""
    records: List[BalancePointGraphRow]


class Constants:
    balance_point_sensitivity: float = 0.5
