import pytest

from rules_engine.helpers import get_design_temp


@pytest.mark.parametrize("state_id,county_id,expected_result", [["01", "007", 26]])
def test_get_design_temp_good_value(state_id: str, county_id: str, expected_result: int):
    res = get_design_temp(state_id, county_id)
    assert res == expected_result


def test_get_design_temp_bad_value():
    with pytest.raises(ValueError) as e:
        get_design_temp('abc', None)
