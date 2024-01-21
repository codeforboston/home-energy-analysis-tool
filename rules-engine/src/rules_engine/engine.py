from __future__ import annotations

import bisect
import statistics as sts
from datetime import date, timedelta
from typing import Any, List, Optional, Tuple

from rules_engine.pydantic_models import (
    AnalysisType,
    BalancePointGraph,
    BalancePointGraphRow,
    Constants,
    DhwInput,
    FuelType,
    NaturalGasBillingInput,
    NormalizedBillingPeriodRecordInput,
    OilPropaneBillingInput,
    SummaryInput,
    SummaryOutput,
    TemperatureInput,
)


def get_outputs_oil_propane(
    summary_input: SummaryInput,
    dhw_input: Optional[DhwInput],
    temperature_input: TemperatureInput,
    oil_propane_billing_input: OilPropaneBillingInput,
) -> Tuple[SummaryOutput, BalancePointGraph]:
    billing_periods: List[NormalizedBillingPeriodRecordInput] = []

    last_date = oil_propane_billing_input.preceding_delivery_date
    for input_val in oil_propane_billing_input.records:
        start_date = last_date + timedelta(days=1)
        inclusion = (
            AnalysisType.INCLUDE
            if input_val.inclusion_override
            else AnalysisType.DO_NOT_INCLUDE
        )
        billing_periods.append(
            NormalizedBillingPeriodRecordInput(
                period_start_date=start_date,
                period_end_date=input_val.period_end_date,
                usage=input_val.gallons,
                inclusion_override=inclusion,
            )
        )
        last_date = input_val.period_end_date

    return get_outputs_normalized(
        summary_input, dhw_input, temperature_input, billing_periods
    )


def get_outputs_natural_gas(
    summary_input: SummaryInput,
    temperature_input: TemperatureInput,
    natural_gas_billing_input: NaturalGasBillingInput,
) -> Tuple[SummaryOutput, BalancePointGraph]:
    billing_periods: List[NormalizedBillingPeriodRecordInput] = []

    for input_val in natural_gas_billing_input.records:
        billing_periods.append(
            NormalizedBillingPeriodRecordInput(
                period_start_date=input_val.period_start_date,
                period_end_date=input_val.period_end_date,
                usage=input_val.usage_therms,
                inclusion_override=input_val.inclusion_override,
            )
        )

    return get_outputs_normalized(
        summary_input, None, temperature_input, billing_periods
    )


def get_outputs_normalized(
    summary_input: SummaryInput,
    dhw_input: Optional[DhwInput],
    temperature_input: TemperatureInput,
    billing_periods: List[NormalizedBillingPeriodRecordInput],
) -> Tuple[SummaryOutput, BalancePointGraph]:
    initial_balance_point = 60
    intermediate_billing_periods = convert_to_intermediate_billing_periods(
        temperature_input=temperature_input, billing_periods=billing_periods
    )

    home = Home(
        summary_input=summary_input,
        billing_periods=intermediate_billing_periods,
        initial_balance_point=initial_balance_point,
        has_boiler_for_dhw=dhw_input is not None,
        same_fuel_dhw_heating=dhw_input is not None,
    )
    home.calculate()

    average_indoor_temperature = get_average_indoor_temperature(
        thermostat_set_point=summary_input.thermostat_set_point,
        setback_temperature=summary_input.setback_temperature,
        setback_hours_per_day=summary_input.setback_hours_per_day,
    )
    average_heat_load = get_average_heat_load(
        design_set_point=Constants.DESIGN_SET_POINT,
        avg_indoor_temp=average_indoor_temperature,
        balance_point=home.balance_point,
        design_temp=summary_input.design_temperature,
        ua=home.avg_ua,
    )
    maximum_heat_load = get_maximum_heat_load(
        design_set_point=Constants.DESIGN_SET_POINT,
        design_temp=summary_input.design_temperature,
        ua=home.avg_ua,
    )

    summary_output = SummaryOutput(
        estimated_balance_point=home.balance_point,
        other_fuel_usage=home.avg_non_heating_usage,
        average_indoor_temperature=average_indoor_temperature,
        difference_between_ti_and_tbp=average_indoor_temperature - home.balance_point,
        design_temperature=summary_input.design_temperature,
        whole_home_heat_loss_rate=home.avg_ua,
        standard_deviation_of_heat_loss_rate=home.stdev_pct,
        average_heat_load=average_heat_load,
        maximum_heat_load=maximum_heat_load,
    )

    balance_point_graph = home.balance_point_graph
    return (summary_output, balance_point_graph)


def convert_to_intermediate_billing_periods(
    temperature_input: TemperatureInput,
    billing_periods: List[NormalizedBillingPeriodRecordInput],
) -> List[BillingPeriod]:
    # Build a list of lists of temperatures, where each list of temperatures contains all the temperatures
    # in the corresponding billing period
    intermediate_billing_periods = []

    for billing_period in billing_periods:
        # the HEAT Excel sheet is inclusive of the temperatures that fall on both the start and end dates
        start_idx = bisect.bisect_left(
            temperature_input.dates, billing_period.period_start_date
        )
        end_idx = (
            bisect.bisect_left(temperature_input.dates, billing_period.period_end_date)
            + 1
        )

        analysis_type = date_to_analysis_type(billing_period.period_end_date)
        if billing_period.inclusion_override:
            analysis_type = billing_period.inclusion_override

        intermediate_billing_period = BillingPeriod(
            start_date=billing_period.period_start_date,
            end_date=billing_period.period_end_date,
            avg_temps=temperature_input.temperatures[start_idx:end_idx],
            usage=billing_period.usage,
            analysis_type=analysis_type,
        )
        intermediate_billing_periods.append(intermediate_billing_period)

    return intermediate_billing_periods


def date_to_analysis_type(d: date) -> AnalysisType:
    months = {
        1: AnalysisType.INCLUDE,
        2: AnalysisType.INCLUDE,
        3: AnalysisType.INCLUDE,
        4: AnalysisType.DO_NOT_INCLUDE,
        5: AnalysisType.DO_NOT_INCLUDE,
        6: AnalysisType.DO_NOT_INCLUDE,
        7: AnalysisType.INCLUDE_IN_OTHER_ANALYSIS,
        8: AnalysisType.INCLUDE_IN_OTHER_ANALYSIS,
        9: AnalysisType.INCLUDE_IN_OTHER_ANALYSIS,
        10: AnalysisType.DO_NOT_INCLUDE,
        11: AnalysisType.DO_NOT_INCLUDE,
        12: AnalysisType.INCLUDE,
    }
    return months[d.month]


def hdd(avg_temp: float, balance_point: float) -> float:
    """
    Calculate the heating degree days on a given day for a given
    home.

    Args:
        avg_temp: average outdoor temperature on a given day
        balance_point: outdoor temperature (F) above which no heating
        is required in a given home
    """
    return max(0, balance_point - avg_temp)


def period_hdd(avg_temps: List[float], balance_point: float) -> float:
    """
    Sum up total heating degree days in a given time period for a given
    home.

    Args:
        avg_temps: list of daily average outdoor temperatures (F) for
        the period
        balance_point: outdoor temperature (F) above which no heating is
        required in a given home
    """
    return sum([hdd(temp, balance_point) for temp in avg_temps])


def get_average_indoor_temperature(
    thermostat_set_point: float,
    setback_temperature: Optional[float],
    setback_hours_per_day: Optional[float],
) -> float:
    """
    Calculates the average indoor temperature.

    Args:
        thermostat_set_point: the temp in F at which the home is normally set
        setback_temperature: temp in F at which the home is set during off
        hours
        setback_hours_per_day: average # of hours per day the home is at
        setback temp
    """
    if setback_temperature is None:
        setback_temperature = thermostat_set_point

    if setback_hours_per_day is None:
        setback_hours_per_day = 0

    # again, not sure if we should check for valid values here or whether we can
    # assume those kinds of checks will be handled at the point of user entry
    return (
        (24 - setback_hours_per_day) * thermostat_set_point
        + setback_hours_per_day * setback_temperature
    ) / 24


def get_average_heat_load(
    design_set_point: float,
    avg_indoor_temp: float,
    balance_point: float,
    design_temp: float,
    ua: float,
) -> float:
    """
    Calculate the average heat load.

    Args:
        design_set_point: a standard internal temperature / thermostat
        set point - different from the preferred set point of an
        individual homeowner
        avg_indoor_temp: average indoor temperature on a given day
        balance_point: outdoor temperature (F) above which no heating
        is required
        design_temp: an outside temperature that represents one of the
        coldest days of the year for the given location of a home
        ua: the heat transfer coefficient
    """
    return (design_set_point - (avg_indoor_temp - balance_point) - design_temp) * ua


def get_maximum_heat_load(
    design_set_point: float, design_temp: float, ua: float
) -> float:
    """
    Calculate the max heat load.

    Args:
        design_set_point: a standard internal temperature / thermostat
        set point - different from the preferred set point of an
        individual homeowner
        design_temp: an outside temperature that represents one of the
        coldest days of the year for the given location of a home
        ua: the heat transfer coefficient
    """
    return (design_set_point - design_temp) * ua


class Home:
    """
    Defines attributes and methods for calculating home heat metrics.

    The information associated with the energy usage of a single home owner
    is used to instantiate this class.  Using that information and the type
    of fuel used, calculates the UA for different billing periods and the
    standard deviation of the UA values across them.
    """

    def __init__(
        self,
        summary_input: SummaryInput,
        billing_periods: List[BillingPeriod],
        initial_balance_point: float = 60,
        has_boiler_for_dhw: bool = False,
        same_fuel_dhw_heating: bool = False,
    ):
        self.fuel_type = summary_input.fuel_type
        self.heat_sys_efficiency = summary_input.heating_system_efficiency
        self.thermostat_set_point = summary_input.thermostat_set_point
        self.balance_point = initial_balance_point
        self.has_boiler_for_dhw = has_boiler_for_dhw
        self.same_fuel_dhw_heating = same_fuel_dhw_heating
        self._initialize_billing_periods(billing_periods)

    def _initialize_billing_periods(self, billing_periods: List[BillingPeriod]) -> None:
        self.bills_winter = []
        self.bills_summer = []
        self.bills_shoulder = []

        # winter months 1; summer months -1; shoulder months 0
        for billing_period in billing_periods:
            billing_period.set_initial_balance_point(self.balance_point)

            if billing_period.analysis_type == AnalysisType.INCLUDE:
                self.bills_winter.append(billing_period)
            elif billing_period.analysis_type == AnalysisType.DO_NOT_INCLUDE:
                self.bills_summer.append(billing_period)
            else:
                self.bills_shoulder.append(billing_period)

        self._calculate_avg_summer_usage()
        self._calculate_avg_non_heating_usage()
        for billing_period in self.bills_winter:
            self.initialize_ua(billing_period)

    def _calculate_avg_summer_usage(self) -> None:
        """
        Calculate average daily summer usage
        """
        summer_usage_total = sum([bp.usage for bp in self.bills_summer])
        summer_days = sum([bp.days for bp in self.bills_summer])
        if summer_days != 0:
            self.avg_summer_usage = summer_usage_total / summer_days
        else:
            self.avg_summer_usage = 0

    def _calculate_boiler_usage(self, fuel_multiplier: float) -> float:
        """
        Calculate boiler usage with oil or propane
        Args:
            fuel_multiplier: a constant that's determined by the fuel
            type
        """

        # self.num_occupants: the number of occupants in Home
        # self.water_heat_efficiency: a number indicating how efficient the heating system is

        return 0 * fuel_multiplier

    def _calculate_avg_non_heating_usage(self) -> None:
        """
        Calculate avg non heating usage for this home
        """

        if self.fuel_type == FuelType.GAS:
            self.avg_non_heating_usage = self.avg_summer_usage
        elif self.has_boiler_for_dhw and self.same_fuel_dhw_heating:
            fuel_multiplier = 1  # default multiplier, for oil, placeholder number
            if self.fuel_type == FuelType.PROPANE:
                fuel_multiplier = 2  # a placeholder number
            self.avg_non_heating_usage = self._calculate_boiler_usage(fuel_multiplier)
        else:
            self.avg_non_heating_usage = 0

    def _calculate_balance_point_and_ua(
        self,
        initial_balance_point_sensitivity: float = 2,
        stdev_pct_max: float = 0.10,
        max_stdev_pct_diff: float = 0.01,
        next_balance_point_sensitivity: float = 0.5,
    ) -> None:
        """
        Calculates the estimated balance point and UA coefficient for
        the home, removing UA outliers based on a normalized standard
        deviation threshold.
        """

        self.balance_point_graph = BalancePointGraph(records=[])

        self.uas = [billing_period.ua for billing_period in self.bills_winter]
        self.avg_ua = sts.mean(self.uas)
        self.stdev_pct = sts.pstdev(self.uas) / self.avg_ua

        balance_point_graph_row = BalancePointGraphRow(
            balance_point=self.balance_point,
            heat_loss_rate=self.avg_ua,
            change_in_heat_loss_rate=0,
            percent_change_in_heat_loss_rate=0,
            standard_deviation=self.stdev_pct,
        )

        self.balance_point_graph.records.append(balance_point_graph_row)

        self._refine_balance_point(initial_balance_point_sensitivity)

        while self.stdev_pct > stdev_pct_max:
            outliers = [abs(bill.ua - self.avg_ua) for bill in self.bills_winter]
            biggest_outlier = max(outliers)
            biggest_outlier_idx = outliers.index(biggest_outlier)
            outlier = self.bills_winter.pop(
                biggest_outlier_idx
            )  # removes the biggest outlier
            uas_i = [billing_period.ua for billing_period in self.bills_winter]
            avg_ua_i = sts.mean(uas_i)
            stdev_pct_i = sts.pstdev(uas_i) / avg_ua_i
            if (
                self.stdev_pct - stdev_pct_i < max_stdev_pct_diff
            ):  # if it's a small enough change
                self.bills_winter.append(
                    outlier
                )  # then it's not worth removing it, and we exit
                break  # may want some kind of warning to be raised as well
            else:
                self.uas, self.avg_ua, self.stdev_pct = uas_i, avg_ua_i, stdev_pct_i

            self._refine_balance_point(next_balance_point_sensitivity)

    def _refine_balance_point(self, balance_point_sensitivity: float) -> None:
        """
        Tries different balance points plus or minus a given number
        of degrees, choosing whichever one minimizes the standard
        deviation of the UAs.
        """
        directions_to_check = [1, -1]

        while directions_to_check:
            bp_i = (
                self.balance_point + directions_to_check[0] * balance_point_sensitivity
            )

            if bp_i > self.thermostat_set_point:
                break  # may want to raise some kind of warning as well

            period_hdds_i = [
                period_hdd(bill.avg_temps, bp_i) for bill in self.bills_winter
            ]
            uas_i = [
                bill.partial_ua / period_hdds_i[n]
                for n, bill in enumerate(self.bills_winter)
            ]
            avg_ua_i = sts.mean(uas_i)
            stdev_pct_i = sts.pstdev(uas_i) / avg_ua_i

            if stdev_pct_i >= self.stdev_pct:
                directions_to_check.pop(0)
            else:
                # TODO: For balance point graph, store the old balance
                # point in a list to keep track of all intermediate balance
                # point temperatures?

                change_in_heat_loss_rate = avg_ua_i - self.avg_ua
                percent_change_in_heat_loss_rate = (
                    100 * change_in_heat_loss_rate / avg_ua_i
                )
                self.balance_point, self.avg_ua, self.stdev_pct = (
                    bp_i,
                    avg_ua_i,
                    stdev_pct_i,
                )

                balance_point_graph_row = BalancePointGraphRow(
                    balance_point=self.balance_point,
                    heat_loss_rate=self.avg_ua,
                    change_in_heat_loss_rate=change_in_heat_loss_rate,
                    percent_change_in_heat_loss_rate=percent_change_in_heat_loss_rate,
                    standard_deviation=self.stdev_pct,
                )
                self.balance_point_graph.records.append(balance_point_graph_row)

                for n, bill in enumerate(self.bills_winter):
                    bill.total_hdd = period_hdds_i[n]
                    bill.ua = uas_i[n]

                if len(directions_to_check) == 2:
                    directions_to_check.pop(-1)

    def calculate(
        self,
        initial_balance_point_sensitivity: float = 2,
        stdev_pct_max: float = 0.10,
        max_stdev_pct_diff: float = 0.01,
        next_balance_point_sensitivity: float = 0.5,
    ) -> None:
        """
        For this Home, calculates avg non heating usage and then the estimated balance point
        and UA coefficient for the home, removing UA outliers based on a normalized standard
        deviation threshold.
        """
        self._calculate_avg_non_heating_usage()
        self._calculate_balance_point_and_ua(
            initial_balance_point_sensitivity,
            stdev_pct_max,
            max_stdev_pct_diff,
            next_balance_point_sensitivity,
        )

    def initialize_ua(self, billing_period: BillingPeriod) -> None:
        """
        Average heating usage, partial UA, initial UA. requires that
        self.home have non heating usage calculated.
        """
        billing_period.avg_heating_usage = (
            billing_period.usage / billing_period.days
        ) - self.avg_non_heating_usage
        billing_period.partial_ua = self.calculate_partial_ua(billing_period)
        billing_period.ua = billing_period.partial_ua / billing_period.total_hdd

    def calculate_partial_ua(self, billing_period: BillingPeriod) -> float:
        """
        The portion of UA that is not dependent on the balance point
        """
        return (
            billing_period.days
            * billing_period.avg_heating_usage  # gallons or therms
            * self.fuel_type.value  # therm or gallon to BTU
            * self.heat_sys_efficiency  # unitless
            / 24
            # days * gallons/day * (BTU/gallon)/1 day (24 hours)
            # BTUs/hour
        )

    def get_all_billing_periods(self) -> List[BillingPeriod]:
        return self.bills_winter + self.bills_shoulder + self.bills_summer


class BillingPeriod:
    avg_heating_usage: float
    balance_point: float
    partial_ua: float
    ua: float
    total_hdd: float

    def __init__(
        self,
        start_date: date,
        end_date: date,
        avg_temps: List[float],
        usage: float,
        analysis_type: AnalysisType,
    ) -> None:
        self.start_date = start_date
        self.end_date = end_date
        self.avg_temps = avg_temps
        self.usage = usage
        self.analysis_type = analysis_type
        self.days = len(self.avg_temps)

    def set_initial_balance_point(self, balance_point: float) -> None:
        self.balance_point = balance_point
        self.total_hdd = period_hdd(self.avg_temps, self.balance_point)
