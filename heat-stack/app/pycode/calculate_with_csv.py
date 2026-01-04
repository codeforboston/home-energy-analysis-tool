from rules_engine import calculate

# from rules_engine.pydantic_models import (FuelType, HeatLoadInput,
#                                           TemperatureInput)


def executeCalculateWithCsv(csvDataJs, parsedFormJs):
    # print("executeCalculateWithCsv - started", {csvDataJs, parsedFormJs})
    result = calculate.calculate_from_csv(csvDataJs, parsedFormJs)
    return result.model_dump(mode="json")
