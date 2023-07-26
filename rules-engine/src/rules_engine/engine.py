import statistics as sts
from enum import Enum
from typing import List, Tuple

import numpy as np


class FuelType(Enum):
    """Enum for fuel types. Values are BTU per usage"""

    GAS = 100000
    OIL = 139600
    PROPANE = 91333


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


def period_hdd(avg_temps: List[float], balance_point: float) -> float:
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
    btu_per_usage: float,
    heat_sys_efficiency: float,
    p_hdd: float,
) -> float:
    """Computes the UA coefficient for a given billing period.

    Arguments:
    days_in_period -- number of days in the given billing period
    daily_heat_usage -- average daily usage for heating during the period
    btu_per_usage -- energy density constant for a given fuel type
    heat_sys_efficiency -- heating system efficiency (decimal between 0 and 1)
    p_hdd -- total number of heating degree days in the given period
    """
    return (
        days_in_period
        * daily_heat_usage
        * btu_per_usage
        * heat_sys_efficiency
        / (p_hdd * 24)
    )


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


def bp_ua_estimates(
    fuel_type: FuelType,
    non_heat_usage: float,
    heat_sys_efficiency: float,
    avg_temps_lists: List[List[float]],
    usages: List[float],
    initial_bp: float = 60,
    bp_sensitivity: float = 2,
) -> Tuple[float, List[float], float, float]:
    """Given a list of billing periods, returns an estimate of balance point,
    a list of UA coefficients for each period, and the average UA coefficient.

    Arguments:
    fuel_type -- heating fuel type in the home. One of "gas", "oil", "propane"
    non_heat_usage -- estimate of daily non-heating fuel usage
    heat_sys_efficiency -- heating system efficiency (decimal between 0 and 1)
    avg_temps_lists -- list of lists of avg daily temps for each period
    usages -- list of fuel usages (one for each period, same order as above)
    initial_bp -- Balance point temperature in degrees F to try at first
    bp_sensitivity -- Degrees F to add/subtract from balance point when refining
    """
    bills_days = [len(l) for l in avg_temps_lists]
    avg_daily_heating_usages = [
        usage / days - non_heat_usage for usage, days in zip(usages, bills_days)
    ]
    period_hdds = [period_hdd(temps, initial_bp) for temps in avg_temps_lists]

    bpu = fuel_type.value  # the value in this case is the BTU per usage

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
    stdev_pct = sts.pstdev(uas) / avg_ua

    bp, uas, avg_ua, stdev_pct = recalculate_bp(
        initial_bp, bp_sensitivity, avg_ua, stdev_pct, avg_temps_lists, partial_uas, uas
    )

    # if the standard deviation of the UAs is below 10% / some threshold,
    # then we can return what we have
    while stdev_pct > 0.10:
        # remove an outlier, recalculate stdev_pct, etc
        biggest_outlier_idx = np.argmax([abs(ua - avg_ua) for ua in uas])
        uas.pop(biggest_outlier_idx)  # removes the biggest outlier
        avg_temps_lists.pop(biggest_outlier_idx)
        partial_uas.pop(biggest_outlier_idx)
        avg_ua = sts.mean(uas)
        stdev_pct = sts.pstdev(uas) / avg_ua
        bp, uas, avg_ua, stdev_pct = recalculate_bp(
            bp, 0.5, avg_ua, stdev_pct, avg_temps_lists, partial_uas, uas
        )

    return bp, uas, avg_ua, stdev_pct


def recalculate_bp(
    initial_bp: float,
    bp_sensitivity: float,
    avg_ua: float,
    stdev_pct: float,
    avg_temps_lists: List[List[float]],
    partial_uas: List[float],
    uas: List[float],
) -> Tuple[float, List[float], float, float]:
    """Tries different balance points plus or minus a given number of degrees,
    choosing whichever one minimizes the standard deviation of the UAs.
    """
    directions_to_check = [1, -1]
    bp = initial_bp

    while directions_to_check:
        bp_i = bp + directions_to_check[0] * bp_sensitivity
        period_hdds_i = [period_hdd(temps, bp_i) for temps in avg_temps_lists]
        uas_i = [pua / period_hdds_i[n] for n, pua in enumerate(partial_uas)]
        avg_ua_i = sts.mean(uas_i)
        stdev_pct_i = sts.pstdev(uas_i) / avg_ua_i
        if stdev_pct_i < stdev_pct:
            bp, uas, avg_ua, stdev_pct = bp_i, uas_i, avg_ua_i, stdev_pct_i
            if len(directions_to_check) == 2:
                directions_to_check.pop(-1)
        else:
            directions_to_check.pop(0)

    return bp, uas, avg_ua, stdev_pct
