from rules_engine import engine, parser
from rules_engine.pydantic_models import (FuelType, HeatLoadInput,
                                          TemperatureInput)


def executeParse(csvDataJs):
    naturalGasInputRecords = parser.parse_gas_bill(csvDataJs)
    return naturalGasInputRecords.model_dump(mode="json")
