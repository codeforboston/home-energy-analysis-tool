from rules_engine import calculate


def executeCalculationPyCode(csvDataJs, form_data):
    all_data = calculate.calculate(csvDataJs, form_data)
    return all_data.model_dump(mode="json")