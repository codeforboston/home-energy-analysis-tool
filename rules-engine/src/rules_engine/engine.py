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


class BillingPeriod:
    def __init__(
        self,
        avg_temps: List[float],
        usage: float,
        fuel_type: FuelType,
        avg_non_heat_usage: float,
        balance_point: float,
        heat_sys_efficiency: float,
    ):
        self.avg_temps = avg_temps
        self.usage = usage
        self.days = len(self.avg_temps)
        self.avg_heating_usage = (self.usage / self.days) - avg_non_heat_usage
        self.total_hdd = period_hdd(self.avg_temps, balance_point)
        self.ua = ua(
            self.days,
            self.avg_heating_usage,
            fuel_type.value,
            heat_sys_efficiency,
            self.total_hdd,
        )
        self.partial_ua = self.ua * self.total_hdd


def bp_ua_estimates(
    billing_periods: List[BillingPeriod],
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
    uas = [bp.ua for bp in billing_periods]
    avg_ua = sts.mean(uas)
    stdev_pct = sts.pstdev(uas) / avg_ua

    bp, bills, avg_ua, stdev_pct = recalculate_bp(
        58, 2, avg_ua, stdev_pct, billing_periods
    )

    # if the standard deviation of the UAs is below 10% / some threshold,
    # then we can return what we have
    while stdev_pct > 0.10:
        # remove an outlier, recalculate stdev_pct, etc
        biggest_outlier_idx = np.argmax([abs(bill.ua - avg_ua) for bill in bills])
        outlier = bills.pop(biggest_outlier_idx)  # removes the biggest outlier
        avg_ua_i = sts.mean(uas)
        stdev_pct_i = sts.pstdev(uas) / avg_ua
        if stdev_pct - stdev_pct_i < 0.01:
            bills.append(outlier)
            break  # may want some kind of warning to be raised as well

        bp, bills, avg_ua, stdev_pct = recalculate_bp(bp, 0.5, avg_ua, stdev_pct, bills)

    return bp, bills, avg_ua, stdev_pct


def recalculate_bp(
    initial_bp: float,
    bp_sensitivity: float,
    avg_ua: float,
    stdev_pct: float,
    bills: List[BillingPeriod],
) -> Tuple[float, List[BillingPeriod], float, float]:
    """Tries different balance points plus or minus a given number of degrees,
    choosing whichever one minimizes the standard deviation of the UAs.
    """
    directions_to_check = [1, -1]
    bp = initial_bp

    while directions_to_check:
        bp_i = bp + directions_to_check[0] * bp_sensitivity
        period_hdds_i = [period_hdd(bill.avg_temps, bp_i) for bill in bills]
        uas_i = [bill.partial_ua / period_hdds_i[n] for n, bill in enumerate(bills)]
        avg_ua_i = sts.mean(uas_i)
        stdev_pct_i = sts.pstdev(uas_i) / avg_ua_i
        if stdev_pct_i < stdev_pct:
            bp, avg_ua, stdev_pct = bp_i, avg_ua_i, stdev_pct_i

            for n, bill in enumerate(bills):
                bill.total_hdd = period_hdds_i[n]
                bill.ua = uas_i[n]

            if len(directions_to_check) == 2:
                directions_to_check.pop(-1)
        else:
            directions_to_check.pop(0)

    return bp, bills, avg_ua, stdev_pct
