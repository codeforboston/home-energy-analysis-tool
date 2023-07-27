from pytest import approx

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

    ua_estimate = engine.ua(bill_days, htg, btu_per_u, heat_eff, p_hdd)
    assert abs(ua_estimate - 799.4) < 0.2


def test_average_indoor_temp():
    set_temp = 68
    setback = 62
    setback_hrs = 8

    # when there is no setback, just put 0 for the setback parameters
    assert engine.average_indoor_temp(set_temp, 0, 0) == set_temp
    assert engine.average_indoor_temp(set_temp, setback, setback_hrs) == 66


def test_bp_ua_estimates():
    temps = [[28, 29, 30, 29], [32, 35, 35, 38], [41, 43, 42, 42]]
    usages = [50, 45, 30]
    billing_periods = [
        engine.BillingPeriod(temps[i], usages[i], engine.FuelType.GAS, 0.24, 58, 0.88)
        for i in range(len(usages))
    ]
    bp, bills, avg_ua, stdev_pct = engine.bp_ua_estimates(billing_periods)
    ua_1, ua_2, ua_3 = [bill.ua for bill in bills]

    assert bp == 60
    assert ua_1 == approx(1450.5, abs=1)
    assert ua_2 == approx(1615.3, abs=1)
    assert ua_3 == approx(1479.6, abs=1)
    assert avg_ua == approx(1515.1, abs=1)
    assert stdev_pct == approx(0.0474, abs=0.01)


def test_bp_ua_with_outlier():
    temps = [
        [41.7, 41.6, 32, 25.4],
        [28, 29, 30, 29],
        [32, 35, 35, 38],
        [41, 43, 42, 42],
    ]
    usages = [60, 50, 45, 30]
    billing_periods = [
        engine.BillingPeriod(temps[i], usages[i], engine.FuelType.GAS, 0.24, 58, 0.88)
        for i in range(len(usages))
    ]
    bp, bills, avg_ua, stdev_pct = engine.bp_ua_estimates(billing_periods)
    ua_1, ua_2, ua_3 = [bill.ua for bill in bills]

    assert bp == 60
    assert ua_1 == approx(1450.5, abs=1)
    assert ua_2 == approx(1615.3, abs=1)
    assert ua_3 == approx(1479.6, abs=1)
    assert avg_ua == approx(1515.1, abs=1)
    assert stdev_pct == approx(0.0474, abs=0.01)


if __name__ == "__main__":
    test_hdd()
    test_period_hdd()
    test_ua()
    test_average_indoor_temp()
    test_bp_ua_estimates()
    test_bp_ua_with_outlier()
