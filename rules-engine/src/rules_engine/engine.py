from datetime import datetime, timedelta

btu_per_usage = {
    "gas": 100000,  # usage in therms
    "oil": 139600,  # usage in gallons
    "propane": 91333,  # usage in gallons
}


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
    period_hdd: int,
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
    pass  # TODO: write this method once we know how we're getting temp data


def uas(
    fuel_type: str,
    balance_point: float,
    non_heating_usage: float,
    heat_sys_efficiency: float,
    end_dates: list,
    days_in_bills: list,
    usages: list,
):
    """Given a list of billing periods, returns a list of UA coefficients

    Arguments:
    fuel_type -- heating fuel type in the home. One of "gas", "oil", "propane"
    balance_point -- outdoor temperature (F) above which no heating is required
    in a given home
    non_heating_usage -- estimate of daily non-heating fuel usage
    end_dates -- list of ending dates for each billing period
    days_in_bills -- lengths in days for the list of billing periods
    usages -- list of fuel usages for each billing period
    """

    # this implementation assumes that the three list arguments are the same
    # length, and also that the fuel_type string is valid. Not sure if this is
    # the place to do that checking, or if it will be handled earlier

    avg_daily_heating_usages = [
        usage / days - non_heating_usage for usage, days in zip(usages, days_in_bills)
    ]
    period_hdds = [
        period_hdd(temps, balance_point)
        for temps in get_avg_temps(end_dates, days_in_bills)
    ]
    BTU_per_usage = btu_per_usage[fuel_type]

    return [
        ua(
            days_in_bills[period],
            avg_daily_heating_usages[period],
            BTU_per_usage,
            heat_sys_efficiency,
            period_hdds[period],
        )
        for period in range(len(usages))
    ]
