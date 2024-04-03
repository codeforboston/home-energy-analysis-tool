from datetime import date
import pathlib
from rules_engine import parser
from rules_engine.pydantic_models import NaturalGasBillingRecordInput


ROOT_DIR = pathlib.Path(__file__).parent / "cases" / "examples"


def test_parse_gas_bill_eversource():
    with open(ROOT_DIR / "feldman" / "natural-gas-eversource.csv") as f:
        s = f.read()

    result = parser.parse_gas_bill_eversource(s)

    assert len(result.records) == 36
    for row in result.records:
        assert isinstance(row, NaturalGasBillingRecordInput)

    # input: 12/17/2021,124.00,29,4.28,$224.09,39.0
    # from excel: 11/19/2021,12/17/2021,29,124,,1,4.28,3.82

    second_row = result.records[1]
    assert second_row.period_start_date == date(2021, 11, 19)
    assert second_row.period_end_date == date(2021, 12, 17)
    assert isinstance(second_row.usage_therms, float) 
    assert second_row.usage_therms == 124
    assert second_row.inclusion_override == None


def test_parse_gas_bill_national_grid():
    with open(ROOT_DIR / "quateman" / "natural-gas-national-grid.csv") as f:
        s = f.read()

    result = parser.parse_gas_bill_national_grid(s)

    assert len(result.records) == 25
    for row in result.records:
        assert isinstance(row, NaturalGasBillingRecordInput)
    
    # input: Natural gas billing,11/5/2020,12/3/2020,36,therms,$65.60 ,
    # from excel: 11/6/2020,12/3/2020,28,36,,1,1.29,0.99


    second_row = result.records[1]
    assert second_row.period_start_date == date(2020, 11, 5)
    assert second_row.period_end_date == date(2020, 12, 3)
    assert isinstance(second_row.usage_therms, float) 
    assert second_row.usage_therms == 36
    assert second_row.inclusion_override == None