from rules_engine import engine


def test_hdd():
    assert engine.hdd(72, 60) == 0  # outside hotter than balance point
    assert engine.hdd(60, 60) == 0  # outside equal to balance point
    assert engine.hdd(57, 60) == 3  # outside cooler than balance point


def test_period_hdd():
    bp = 60
    temps_1 = [72, 60, 55, 61]
    temps_2 = [52, 60, 55]
    temps_3 = [72, 60, 65, 60, 80]

    assert engine.period_hdd(temps_1, bp) == 5  # one day with HDDs
    assert engine.period_hdd(temps_2, bp) == 13  # two days with HDDs
    assert engine.period_hdd(temps_3, bp) == 0  # no days with HDDs


def test_ua():
    # I pulled the numbers for this test from the spreadsheet
    bill_days, htg, p_hdd = 32, 6.92, 1015.9
    btu_per_u = 100000
    heat_eff = 0.88

    assert engine.ua(bill_days, htg, btu_per_u, heat_eff, p_hdd) - 799.4 < 0.2


def test_average_indoor_temp():
    set_temp = 68
    setback = 62
    setback_hrs = 8

    # when there is no setback, just put 0 for the setback parameters
    assert engine.average_indoor_temp(set_temp, 0, 0) == set_temp
    assert engine.average_indoor_temp(set_temp, setback, setback_hrs) == 66
