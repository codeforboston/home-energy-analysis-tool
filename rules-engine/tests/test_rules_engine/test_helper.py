import pytest

from rules_engine.helpers import get_design_temp



def test_get_design_temp_good_value(state_id: str,county_id:str):
    # Harcoding this for now
    res = get_design_temp("01","007")
    print(type(res))
    assert res == 26



def test_get_design_temp_bad_value():

    with pytest.raises(ValueError) as e:
        get_design_temp('abc',None)
    print(e)