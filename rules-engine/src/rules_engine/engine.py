import statistics as sts


def hdd(avg_temp: float, balance_point: float) -> float:
    """Calculate the heating degree days on a given day for a given home.

    Arguments:
    avg_temp -- average outdoor temperature on a given day
    balance_point -- outdoor temperature above which no heating is required in
    a given home
    """
    diff = balance_point - avg_temp

    if diff < 0:
        return 0
    else:
        return diff


def period_hdd(avg_temps: list, balance_point: float) -> float:
    """Sum up total heating degree days in a given time period for a given home.

    Arguments:
    avg_temps -- list of daily average outdoor temperatures (F) for the period
    balance_point -- outdoor temperature (F) above which no heating is required
    in a given home
    """
    return sum([hdd(temp, balance_point) for temp in avg_temps])


def ua(
    days_in_period: int,
    daily_heat_usage: float,
    BTU_per_usage: float,
    heat_sys_efficiency: float,
    period_hdd: float,
) -> float:
    """Computes the UA coefficient for a given billing period.

    Arguments:
    days_in_period -- number of days in the given billing period
    daily_heat_usage -- average daily usage for heating during the period
    BTU_per_usage -- energy density constant for a given fuel type
    heat_sys_efficiency -- heating system efficiency (decimal between 0 and 1)
    period_hdd -- total number of heating degree days in the given period
    """
    return (
        days_in_period
        * daily_heat_usage
        * BTU_per_usage
        * heat_sys_efficiency
        / (period_hdd * 24)
    )


def get_avg_temps(end_dates: list, days_in_bills: list) -> list:
    """Returns a list of lists of average daily temperatures for each period

    Arguments:
    end_dates -- list of ending dates for each billing period
    days_in_bills -- lengths in days for the list of billing periods
    """
    # TODO: write this method once we know how we're getting temp data
    return [[]]


def bp_ua_estimates(
    fuel_type: str,
    non_heat_usage: float,
    heat_sys_efficiency: float,
    end_dates: list,
    bills_days: list,
    usages: list,
    initial_bp: float = 60,
):
    """Given a list of billing periods, returns an estimate of balance point,
    a list of UA coefficients for each period, and the average UA coefficient.

    Arguments:
    fuel_type -- heating fuel type in the home. One of "gas", "oil", "propane"
    balance_point -- outdoor temperature (F) above which no heating is required
    in a given home
    non_heat_usage -- estimate of daily non-heating fuel usage
    end_dates -- list of ending dates for each billing period
    bills_days -- lengths in days for the list of billing periods
    usages -- list of fuel usages for each billing period
    """

    # this implementation assumes that the three list arguments are the same
    # length, and also that the fuel_type string is valid. Not sure if this is
    # the place to do that checking, or if it will be handled earlier

    avg_daily_heating_usages = [
        usage / days - non_heat_usage for usage, days in zip(usages, bills_days)
    ]
    avg_temps_lists = get_avg_temps(end_dates, bills_days)
    period_hdds = [period_hdd(temps, initial_bp) for temps in avg_temps_lists]

    btu_per_usage = {
        "gas": 100000,  # usage in therms
        "oil": 139600,  # usage in gallons
        "propane": 91333,  # usage in gallons
    }
    bpu = btu_per_usage[fuel_type]

    uas = [
        ua(
            bills_days[period],
            avg_daily_heating_usages[period],
            bpu,
            heat_sys_efficiency,
            period_hdds[period],
        )
        for period in range(len(usages))
    ]
    partial_uas = [ua * period_hdds[period] for period, ua in enumerate(uas)]
    avg_ua = sts.mean(uas)
    stdev_pct = sts.stdev(uas) / avg_ua

    bp_sensitivity = 2
    directions_to_check = [1, -1]
    bp = initial_bp

    while directions_to_check:
        bp_i = bp + directions_to_check[0] * bp_sensitivity
        period_hdds_i = [period_hdd(temps, bp_i) for temps in avg_temps_lists]
        uas_i = [pua / period_hdds_i[n] for n, pua in enumerate(partial_uas)]
        avg_ua_i = sts.mean(uas_i)
        stdev_pct_i = sts.stdev(uas_i) / avg_ua_i
        if stdev_pct_i < stdev_pct:
            bp, uas, avg_ua, stdev_pct = bp_i, uas_i, avg_ua_i, stdev_pct_i
            if len(directions_to_check) == 2:
                directions_to_check.pop(-1)
        else:
            directions_to_check.pop(0)

    return bp, uas, avg_ua


def average_indoor_temp(
    tstat_set: float, tstat_setback: float, setback_daily_hrs: float
) -> float:
    """Calculates the average indoor temperature.

    Arguments:
    tstat_set -- the temp in F at which the home is normally set
    tstat_setback -- temp in F at which the home is set during off hours
    setback_daily_hrs -- average # of hours per day the home is at setback temp
    """
    # again, not sure if we should check for valid values here or whether we can
    # assume those kinds of checks will be handled at the point of user entry
    return (
        (24 - setback_daily_hrs) * tstat_set + setback_daily_hrs * tstat_setback
    ) / 24
