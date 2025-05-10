from rules_engine import parser
from rules_engine.pydantic_models import (
    FuelType,
    HeatLoadInput,
    TemperatureInput
)
from rules_engine import engine

def executeParse(csvDataJs):
    naturalGasInputRecords = parser.parse_gas_bill(csvDataJs)
    return naturalGasInputRecords.model_dump(mode="json")