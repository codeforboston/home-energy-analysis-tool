"""
TODO: Add module description
"""

from __future__ import annotations

import bisect
import statistics as sts
from datetime import date, timedelta
from typing import Any, Optional

from rules_engine.pydantic_models import (
    AnalysisType,
    BalancePointGraph,
    BalancePointGraphRow,
    Constants,
    DhwInput,
    FuelType,
    NaturalGasBillingInput,
    NormalizedBillingPeriodRecord,
    NormalizedBillingPeriodRecordBase,
    OilPropaneBillingInput,
    RulesEngineResult,
    SummaryInput,
    SummaryOutput,
    TemperatureInput,
)


def get_outputs_oil_propane(
    summary_input: SummaryInput,
    dhw_input: Optional[DhwInput],
    temperature_input: TemperatureInput,
    oil_propane_billing_input: OilPropaneBillingInput,
) -> RulesEngineResult:
    """
    Analyze the heat load for a home that is using oil or propane as its current heating system fuel.
    """
    billing_periods: list[NormalizedBillingPeriodRecordBase] = []

    last_date = oil_propane_billing_input.preceding_delivery_date
    for input_val in oil_propane_billing_input.records:
        start_date = last_date + timedelta(days=1)
        billing_periods.append(
            NormalizedBillingPeriodRecordBase(
                period_start_date=start_date,
                period_end_date=input_val.period_end_date,
                usage=input_val.gallons,
                inclusion_override=bool(input_val.inclusion_override),
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
) -> RulesEngineResult:
    """
    Analyze the heat load for a home that is using natural gas as its current heating system fuel.
    """
    billing_periods: list[NormalizedBillingPeriodRecordBase] = []

    for input_val in natural_gas_billing_input.records:
        billing_periods.append(
            NormalizedBillingPeriodRecordBase(
                period_start_date=input_val.period_start_date,
                period_end_date=input_val.period_end_date,
                usage=input_val.usage_therms,
                inclusion_override=bool(input_val.inclusion_override),
            )
        )

    return get_outputs_normalized(
        summary_input, None, temperature_input, billing_periods
    )


def get_outputs_normalized(
    summary_input: SummaryInput,
    dhw_input: Optional[DhwInput],
    temperature_input: TemperatureInput,
    billing_periods: list[NormalizedBillingPeriodRecordBase],
) -> RulesEngineResult:
    """
    Analyze the heat load for a home based on normalized, fuel-type-agnostic billing records.
    """
    initial_balance_point = 60
    intermediate_billing_periods = convert_to_intermediate_billing_periods(
        temperature_input=temperature_input,
        billing_periods=billing_periods,
        fuel_type=summary_input.fuel_type,
    )

    home = Home(
        summary_input=summary_input,
        billing_periods=intermediate_billing_periods,
        dhw_input=dhw_input,
        initial_balance_point=initial_balance_point,
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

    billing_records = []
    for billing_period in intermediate_billing_periods:
        billing_record = NormalizedBillingPeriodRecord(
            period_start_date=billing_period.input.period_start_date,
            period_end_date=billing_period.input.period_end_date,
            usage=billing_period.input.usage,
            inclusion_override=billing_period.input.inclusion_override,
            analysis_type=billing_period.analysis_type,
            default_inclusion=billing_period.default_inclusion,
            eliminated_as_outlier=billing_period.eliminated_as_outlier,
            whole_home_heat_loss_rate=billing_period.ua,
        )
        billing_records.append(billing_record)

    result = RulesEngineResult(
        summary_output=summary_output,
        balance_point_graph=balance_point_graph,
        billing_records=billing_records,
    )
    return result


def convert_to_intermediate_billing_periods(
    temperature_input: TemperatureInput,
    billing_periods: list[NormalizedBillingPeriodRecordBase],
    fuel_type: FuelType,
) -> list[BillingPeriod]:
    """
    Converts temperature data and billing period inputs into internal classes used for heat loss calculations.

    TODO: Extract this method to another class or make it private
    """
    # Build a list of lists of temperatures, where each list of temperatures contains all the temperatures
    # in the corresponding billing period
    intermediate_billing_periods = []
    default_inclusion = False

    for billing_period in billing_periods:
        # the HEAT Excel sheet is inclusive of the temperatures that fall on both the start and end dates
        start_idx = bisect.bisect_left(
            temperature_input.dates, billing_period.period_start_date
        )
        end_idx = (
            bisect.bisect_left(temperature_input.dates, billing_period.period_end_date)
            + 1
        )

        if fuel_type == FuelType.GAS:
            analysis_type, default_inclusion = _date_to_analysis_type_natural_gas(
                billing_period.period_end_date
            )
        elif fuel_type == FuelType.OIL or fuel_type == FuelType.PROPANE:
            analysis_type, default_inclusion = _date_to_analysis_type_oil_propane(
                billing_period.period_start_date, billing_period.period_end_date
            )
        else:
            raise ValueError("Unsupported fuel type.")

        intermediate_billing_period = BillingPeriod(
            input=billing_period,
            avg_temps=temperature_input.temperatures[start_idx:end_idx],
            usage=billing_period.usage,
            analysis_type=analysis_type,
            default_inclusion=default_inclusion,
            inclusion_override=billing_period.inclusion_override,
        )
        intermediate_billing_periods.append(intermediate_billing_period)

    return intermediate_billing_periods


def _date_to_analysis_type_oil_propane(
    start_date: date, end_date: date
) -> AnalysisType:
    """
    Converts the dates from a billing period into an enum representing the period's usage in the rules engine.
    """
    if (
        (end_date.month > 4 and end_date.month < 11)
        or (start_date.month > 3 and start_date.month < 10)
        or (start_date.month < 7 and end_date.month > 7)
        or (start_date.month < 7 and start_date.year < end_date.year)
    ):
        _analysis_type = AnalysisType.NOT_ALLOWED_IN_CALCULATIONS
        _default_inclusion = False
    else:
        _analysis_type =  AnalysisType.ALLOWED_HEATING_USAGE
        _default_inclusion = True
    return (_analysis_type, _default_inclusion)


def _date_to_analysis_type_natural_gas(d: date) -> tuple[AnalysisType, bool]:
    """
    Converts the dates from a billing period into an enum representing the period's usage in the rules engine.
    """
    months = {
        1: AnalysisType.ALLOWED_HEATING_USAGE,
        2: AnalysisType.ALLOWED_HEATING_USAGE,
        3: AnalysisType.ALLOWED_HEATING_USAGE,
        4: AnalysisType.ALLOWED_HEATING_USAGE,
        5: AnalysisType.NOT_ALLOWED_IN_CALCULATIONS,
        6: AnalysisType.NOT_ALLOWED_IN_CALCULATIONS,
        7: AnalysisType.ALLOWED_NON_HEATING_USAGE,
        8: AnalysisType.ALLOWED_NON_HEATING_USAGE,
        9: AnalysisType.ALLOWED_NON_HEATING_USAGE,
        10: AnalysisType.NOT_ALLOWED_IN_CALCULATIONS,
        11: AnalysisType.ALLOWED_HEATING_USAGE,
        12: AnalysisType.ALLOWED_HEATING_USAGE,
    }
    
    default_inclusion_by_month = { 
        1: True,
        2: True,
        3: True,
        4: False,
        5: False,
        6: False,
        7: True,
        8: True,
        9: True,
        10: False,
        11: False,
        12: True,
    }

    _analysis_type = months[d.month]
    _default_inclusion = default_inclusion_by_month[d.month]

    return (_analysis_type, _default_inclusion)


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


def period_hdd(avg_temps: list[float], balance_point: float) -> float:
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


def calculate_dhw_usage(dhw_input: DhwInput, heating_system_efficiency: float) -> float:
    """
    Calculate non-heating usage with oil or propane
    """
    if dhw_input.estimated_water_heating_efficiency is not None:
        heating_system_efficiency = dhw_input.estimated_water_heating_efficiency

    stand_by_losses = Constants.DEFAULT_STAND_BY_LOSSES
    if dhw_input.stand_by_losses is not None:
        stand_by_losses = dhw_input.stand_by_losses

    daily_fuel_oil_use_for_dhw = (
        dhw_input.number_of_occupants
        * Constants.DAILY_DHW_CONSUMPTION_PER_OCCUPANT
        * Constants.WATER_WEIGHT
        * (Constants.LEAVING_WATER_TEMPERATURE - Constants.ENTERING_WATER_TEMPERATURE)
        * Constants.SPECIFIC_HEAT_OF_WATER
        / Constants.FUEL_OIL_BTU_PER_GAL
        / (heating_system_efficiency * (1 - stand_by_losses))
    )

    return daily_fuel_oil_use_for_dhw


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
        billing_periods: list[BillingPeriod],
        dhw_input: Optional[DhwInput],
        initial_balance_point: float = 60,
    ):
        self.fuel_type = summary_input.fuel_type
        self.heat_sys_efficiency = summary_input.heating_system_efficiency
        self.thermostat_set_point = summary_input.thermostat_set_point
        self.balance_point = initial_balance_point
        self.dhw_input = dhw_input
        self._initialize_billing_periods(billing_periods)

    def _initialize_billing_periods(self, billing_periods: list[BillingPeriod]) -> None:
        self.bills_winter = []
        self.bills_summer = []
        self.bills_shoulder = []

        # winter months 1 (ALLOWED_HEATING_USAGE); summer months -1 (ALLOWED_NON_HEATING_USAGE); shoulder months 0 (NOT_ALLOWED...)
        for billing_period in billing_periods:
            billing_period.set_initial_balance_point(self.balance_point)

            """
            The UI depicts billing period usage as several distinctive icons on the left hand column of the screen; "analysis_type"
            For winter "cusp" months, for example April and November in MA, the UI will show those rows grayed out; "default_inclusion"
            The user has the ability to "include" those cusp months in calculations by checking a box on far right; "inclusion_override"
            The user may also choose to "exclude" any other "allowed" month by checking a box on the far right; "inclusion_override"
            The following code implements this algorithm and adds bills accordingly to winter, summer, or shoulder (i.e. excluded) lists
            """

            _analysis_type = billing_period.analysis_type
            _default_inclusion = billing_period.default_inclusion

            # Only bills deemed ALLOWED by the AnalysisType algorithm can be included/excluded by the user
            # if (
            #     _analysis_type == AnalysisType.ALLOWED_HEATING_USAGE
            #     or _analysis_type == AnalysisType.ALLOWED_NON_HEATING_USAGE
            # ):
            #     if billing_period.inclusion_override:
            #         # The user has requested we override an inclusion algorithm decision
            #         if billing_period.winter_cusp_month == True:
            #             # This bill is on the cusp of winter; the user has requested we include it
            #             _analysis_type = AnalysisType.ALLOWED_HEATING_USAGE
            #         else:
            #             # The user has requested we exclude this bill from our calculations
            #             _analysis_type = AnalysisType.NOT_ALLOWED_IN_CALCULATIONS
            #     else:
            #         # The user has chosen to not override our automatic calculations, even for a winter cusp month
            #         if billing_period.winter_cusp_month == True:
            #             _analysis_type = AnalysisType.NOT_ALLOWED_IN_CALCULATIONS

            # Assign the bill to the appropriate list for winter or summer calculations

            if billing_period.inclusion_override:
                _default_inclusion = not _default_inclusion
            
            if _analysis_type == AnalysisType.ALLOWED_HEATING_USAGE and _default_inclusion:
                    self.bills_winter.append(billing_period)
            elif _analysis_type == AnalysisType.ALLOWED_NON_HEATING_USAGE and _default_inclusion:
                    self.bills_summer.append(billing_period)
            else:  # the rest are excluded from calculations
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

    def _calculate_avg_non_heating_usage(self) -> None:
        """
        Calculate avg non heating usage for this home
        """

        if self.fuel_type == FuelType.GAS:
            self.avg_non_heating_usage = self.avg_summer_usage
        elif self.dhw_input is not None and self.fuel_type == FuelType.OIL:
            # TODO: support non-heating usage for Propane in addition to fuel oil
            self.avg_non_heating_usage = calculate_dhw_usage(
                self.dhw_input, self.heat_sys_efficiency
            )
        else:
            self.avg_non_heating_usage = 0

    def _calculate_balance_point_and_ua(
        self,
        initial_balance_point_sensitivity: float = 0.5,
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
            outlier.eliminated_as_outlier = True
            uas_i = [billing_period.ua for billing_period in self.bills_winter]
            avg_ua_i = sts.mean(uas_i)
            stdev_pct_i = sts.pstdev(uas_i) / avg_ua_i
            if (
                # the outlier has been removed
                self.stdev_pct - stdev_pct_i
                < max_stdev_pct_diff
            ):  # if it's a small enough change
                # add the outlier back in
                self.bills_winter.append(
                    outlier
                )  # then it's not worth removing it, and we exit
                outlier.eliminated_as_outlier = False
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

            change_in_heat_loss_rate = avg_ua_i - self.avg_ua
            percent_change_in_heat_loss_rate = 100 * change_in_heat_loss_rate / avg_ua_i

            balance_point_graph_row = BalancePointGraphRow(
                balance_point=bp_i,
                heat_loss_rate=avg_ua_i,
                change_in_heat_loss_rate=change_in_heat_loss_rate,
                percent_change_in_heat_loss_rate=percent_change_in_heat_loss_rate,
                standard_deviation=stdev_pct_i,
            )
            self.balance_point_graph.records.append(balance_point_graph_row)

            if stdev_pct_i >= self.stdev_pct:
                directions_to_check.pop(0)
            else:
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
        initial_balance_point_sensitivity: float = 0.5,
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


class BillingPeriod:
    """
    An internal class storing data whence heating usage per billing
    period is calculated.
    """

    input: NormalizedBillingPeriodRecordBase
    avg_heating_usage: float
    balance_point: float
    partial_ua: float
    ua: Optional[float]
    total_hdd: float
    eliminated_as_outlier: bool

    def __init__(
        self,
        input: NormalizedBillingPeriodRecordBase,
        avg_temps: list[float],
        usage: float,
        analysis_type: AnalysisType,
        default_inclusion: bool,
        inclusion_override: bool,
    ) -> None:
        self.input = input
        self.avg_temps = avg_temps
        self.usage = usage
        self.analysis_type = analysis_type
        self.default_inclusion = default_inclusion
        self.inclusion_override = inclusion_override
        self.eliminated_as_outlier = False
        self.ua = None

        self.days = len(self.avg_temps)

    def set_initial_balance_point(self, balance_point: float) -> None:
        self.balance_point = balance_point
        self.total_hdd = period_hdd(self.avg_temps, self.balance_point)

    def __str__(self) -> str:
        return f"{self.input}, {self.ua}, {self.eliminated_as_outlier}, {self.days}, {self.avg_temps}, {self.usage}, {self.analysis_type}, {self.default_inclusion}"

    def __repr__(self) -> str:
        return self.__str__()
