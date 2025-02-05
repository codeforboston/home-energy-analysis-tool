"""
TODO: Add module description
"""

from __future__ import annotations
from dataclasses import dataclass

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
    HeatLoadInput,
    HeatLoadOutput,
    NaturalGasBillingInput,
    OilPropaneBillingInput,
    ProcessedEnergyBill,
    ProcessedEnergyBillInput,
    RulesEngineResult,
    TemperatureInput,
)


def get_outputs_oil_propane(
    heat_load_input: HeatLoadInput,
    dhw_input: Optional[DhwInput],
    temperature_input: TemperatureInput,
    oil_propane_billing_input: OilPropaneBillingInput,
) -> RulesEngineResult:
    """
    Analyzes the heat load for a home that is using oil or propane as
    its current heating system fuel
    """
    processed_energy_bill_inputs: list[ProcessedEnergyBillInput] = []

    last_date = oil_propane_billing_input.preceding_delivery_date
    for input_val in oil_propane_billing_input.records:
        start_date = last_date + timedelta(days=1)
        processed_energy_bill_inputs.append(
            ProcessedEnergyBillInput(
                period_start_date=start_date,
                period_end_date=input_val.period_end_date,
                usage=input_val.gallons,
                inclusion_override=bool(input_val.inclusion_override),
            )
        )
        last_date = input_val.period_end_date

    return get_outputs_normalized(
        heat_load_input, dhw_input, temperature_input, processed_energy_bill_inputs
    )


def get_outputs_natural_gas(
    heat_load_input: HeatLoadInput,
    temperature_input: TemperatureInput,
    natural_gas_billing_input: NaturalGasBillingInput,
) -> RulesEngineResult:
    """
    Analyze the heat load for a home that is using natural gas as its
    current heating system fuel.
    """
    processed_energy_bill_inputs: list[ProcessedEnergyBillInput] = []

    for input_val in natural_gas_billing_input.records:
        processed_energy_bill_inputs.append(
            ProcessedEnergyBillInput(
                period_start_date=input_val.period_start_date,
                period_end_date=input_val.period_end_date,
                usage=input_val.usage_therms,
                inclusion_override=bool(input_val.inclusion_override),
            )
        )

    return get_outputs_normalized(
        heat_load_input,
        None,
        temperature_input,
        processed_energy_bill_inputs,
    )


def get_outputs_normalized(
    heat_load_input: HeatLoadInput,
    dhw_input: Optional[DhwInput],
    temperature_input: TemperatureInput,
    processed_energy_bill_inputs: list[ProcessedEnergyBillInput],
) -> RulesEngineResult:
    """
    Analyze the heat load for a home based on normalized, fuel-type-
    agnostic billing records.
    """
    initial_balance_point = 60
    intermediate_processed_energy_bills = (
        convert_to_intermediate_processed_energy_bills(
            temperature_input=temperature_input,
            processed_energy_bill_inputs=processed_energy_bill_inputs,
            fuel_type=heat_load_input.fuel_type,
        )
    )

    home = Home.calculate(
        heat_load_input=heat_load_input,
        intermediate_energy_bills=intermediate_processed_energy_bills,
        dhw_input=dhw_input,
        initial_balance_point=initial_balance_point,
    )

    average_indoor_temperature = get_average_indoor_temperature(
        thermostat_set_point=heat_load_input.thermostat_set_point,
        setback_temperature=heat_load_input.setback_temperature,
        setback_hours_per_day=heat_load_input.setback_hours_per_day,
    )
    average_heat_load = get_average_heat_load(
        design_set_point=Constants.DESIGN_SET_POINT,
        avg_indoor_temp=average_indoor_temperature,
        balance_point=home.balance_point,
        design_temp=heat_load_input.design_temperature,
        ua=home.avg_ua,
    )
    maximum_heat_load = get_maximum_heat_load(
        design_set_point=Constants.DESIGN_SET_POINT,
        design_temp=heat_load_input.design_temperature,
        ua=home.avg_ua,
    )

    heat_load_output = HeatLoadOutput(
        estimated_balance_point=home.balance_point,
        other_fuel_usage=home.avg_non_heating_usage,
        average_indoor_temperature=average_indoor_temperature,
        difference_between_ti_and_tbp=average_indoor_temperature - home.balance_point,
        design_temperature=heat_load_input.design_temperature,
        whole_home_heat_loss_rate=home.avg_ua,
        standard_deviation_of_heat_loss_rate=home.stdev_pct,
        average_heat_load=average_heat_load,
        maximum_heat_load=maximum_heat_load,
    )

    balance_point_graph = home.balance_point_graph

    processed_energy_bills = []
    for intermediate_energy_bill in intermediate_processed_energy_bills:
        processed_energy_bill = ProcessedEnergyBill(
            period_start_date=intermediate_energy_bill.input.period_start_date,
            period_end_date=intermediate_energy_bill.input.period_end_date,
            usage=intermediate_energy_bill.input.usage,
            inclusion_override=intermediate_energy_bill.input.inclusion_override,
            analysis_type=intermediate_energy_bill.analysis_type,
            default_inclusion=intermediate_energy_bill.default_inclusion,
            eliminated_as_outlier=intermediate_energy_bill.eliminated_as_outlier,
            whole_home_heat_loss_rate=intermediate_energy_bill.ua,
        )
        processed_energy_bills.append(processed_energy_bill)

    result = RulesEngineResult(
        heat_load_output=heat_load_output,
        balance_point_graph=balance_point_graph,
        processed_energy_bills=processed_energy_bills,
    )
    return result


def convert_to_intermediate_processed_energy_bills(
    temperature_input: TemperatureInput,
    processed_energy_bill_inputs: list[ProcessedEnergyBillInput],
    fuel_type: FuelType,
) -> list[IntermediateEnergyBill]:
    """
    Converts temperature data and billing period inputs into internal
    classes used for heat loss calculations.

    TODO: Extract this method to another class or make it private
    """
    # Build a list of lists of temperatures, where each list of temperatures contains all the temperatures
    # in the corresponding billing period
    intermediate_processed_energy_bill_inputs = []
    default_inclusion = False

    for processed_energy_bill_input in processed_energy_bill_inputs:
        # the HEAT Excel sheet is inclusive of the temperatures that fall on both the start and end dates
        start_idx = bisect.bisect_left(
            temperature_input.dates, processed_energy_bill_input.period_start_date
        )
        end_idx = (
            bisect.bisect_left(
                temperature_input.dates, processed_energy_bill_input.period_end_date
            )
            + 1
        )

        if fuel_type == FuelType.GAS:
            analysis_type, default_inclusion = _date_to_analysis_type_natural_gas(
                processed_energy_bill_input.period_end_date
            )
        elif fuel_type == FuelType.OIL or fuel_type == FuelType.PROPANE:
            analysis_type, default_inclusion = _date_to_analysis_type_oil_propane(
                processed_energy_bill_input.period_start_date,
                processed_energy_bill_input.period_end_date,
            )
        else:
            raise ValueError("Unsupported fuel type.")

        intermediate_energy_bill = IntermediateEnergyBill(
            input=processed_energy_bill_input,
            avg_temps=temperature_input.temperatures[start_idx:end_idx],
            usage=processed_energy_bill_input.usage,
            analysis_type=analysis_type,
            default_inclusion=default_inclusion,
            inclusion_override=processed_energy_bill_input.inclusion_override,
        )
        intermediate_processed_energy_bill_inputs.append(intermediate_energy_bill)

    return intermediate_processed_energy_bill_inputs


def _date_to_analysis_type_oil_propane(
    start_date: date, end_date: date
) -> tuple[AnalysisType, bool]:
    """
    Converts the dates from a billing period into an enum representing
    the period's usage in the rules engine.
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
        _analysis_type = AnalysisType.ALLOWED_HEATING_USAGE
        _default_inclusion = True
    return (_analysis_type, _default_inclusion)


def _date_to_analysis_type_natural_gas(d: date) -> tuple[AnalysisType, bool]:
    """
    Converts the dates from a billing period into an enum representing
    the period's usage in the rules engine.
    """
    months = {
        1: AnalysisType.ALLOWED_HEATING_USAGE,
        2: AnalysisType.ALLOWED_HEATING_USAGE,
        3: AnalysisType.ALLOWED_HEATING_USAGE,
        4: AnalysisType.ALLOWED_HEATING_USAGE,
        5: AnalysisType.NOT_ALLOWED_IN_CALCULATIONS,
        6: AnalysisType.ALLOWED_NON_HEATING_USAGE,
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
    Calculates the average indoor temperature

    Args:
        thermostat_set_point: the temp in F at which the home is
        normally set
        setback_temperature: temp in F at which the home is set during
        off hours
        setback_hours_per_day: average # of hours per day the home is
        at setback temp
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
    Defines attributes and methods for calculating home heat metrics

    The information associated with the energy usage of a single home
    owner is used to instantiate this class.  Using that information
    and the type of fuel used, calculates the UA for different billing
    periods and the standard deviation of the UA values across them
    """

    # TODO: re-evaluate below
    avg_non_heating_usage = 0.0
    avg_ua = 0.0
    stdev_pct = 0.0
    balance_point_graph = BalancePointGraph(records=[])

    def _init(
        self,
        heat_load_input: HeatLoadInput,
        intermediate_energy_bills: list[IntermediateEnergyBill],
        dhw_input: Optional[DhwInput],
        initial_balance_point: float = 60,
    ) -> None:
        self.fuel_type = heat_load_input.fuel_type
        self.heat_system_efficiency = heat_load_input.heating_system_efficiency
        self.thermostat_set_point = heat_load_input.thermostat_set_point
        self.balance_point = initial_balance_point
        self.dhw_input = dhw_input

        (
            self.winter_processed_energy_bills,
            self.summer_processed_energy_bills,
        ) = Home._processed_energy_bill_inputs(
            intermediate_energy_bills, self.balance_point
        )
        self.avg_summer_usage = Home._avg_summer_usage(
            self.summer_processed_energy_bills
        )
        self.avg_non_heating_usage = Home._avg_non_heating_usage(
            self.fuel_type,
            self.avg_summer_usage,
            self.dhw_input,
            self.heat_system_efficiency,
        )
        for processed_energy_bill in self.winter_processed_energy_bills:
            self.initialize_ua(
                processed_energy_bill,
                fuel_type=self.fuel_type,
                heat_system_efficiency=self.heat_system_efficiency,
                avg_non_heating_usage=self.avg_non_heating_usage,
            )

    @staticmethod
    def _processed_energy_bill_inputs(
        intermediate_energy_bills: list[IntermediateEnergyBill], balance_point: float
    ) -> tuple[list[IntermediateEnergyBill], list[IntermediateEnergyBill]]:
        winter_processed_energy_bills = []
        summer_processed_energy_bills = []

        # winter months 1 (ALLOWED_HEATING_USAGE)
        # summer months -1 (ALLOWED_NON_HEATING_USAGE)
        # shoulder months 0 (NOT_ALLOWED...)
        for processed_energy_bill in intermediate_energy_bills:
            processed_energy_bill.set_initial_balance_point(balance_point)
            """
            The UI depicts billing period usage as several distinctive 
            icons on the left hand column of the screen:
            "analysis_type".

            For winter "cusp" months, for example April and November 
            in MA, the UI will show those rows grayed out:
            "default_inclusion".

            The user has the ability to "include" those cusp months in 
            calculations by checking a box on far right:
            "inclusion_override".

            The user may also choose to "exclude" any other "allowed" 
            month by checking a box on the far right:
            "inclusion_override".

            The following code implements this algorithm and adds bills 
            accordingly to winter, summer, or shoulder (i.e. excluded) 
            lists.
            """
            _analysis_type = processed_energy_bill.analysis_type
            _default_inclusion = processed_energy_bill.default_inclusion

            if processed_energy_bill.inclusion_override:
                _default_inclusion = not _default_inclusion

            if (
                _analysis_type == AnalysisType.ALLOWED_HEATING_USAGE
                and _default_inclusion
            ):
                winter_processed_energy_bills.append(processed_energy_bill)
            elif (
                _analysis_type == AnalysisType.ALLOWED_NON_HEATING_USAGE
                and _default_inclusion
            ):
                summer_processed_energy_bills.append(processed_energy_bill)

        return winter_processed_energy_bills, summer_processed_energy_bills

    @staticmethod
    def _avg_summer_usage(
        summer_processed_energy_bills: list[IntermediateEnergyBill],
    ) -> float:
        """
        Calculates average daily summer usage
        """
        summer_usage_total = sum([bp.usage for bp in summer_processed_energy_bills])
        summer_days = sum([bp.days for bp in summer_processed_energy_bills])
        if summer_days != 0:
            return summer_usage_total / summer_days
        else:
            return 0

    @staticmethod
    def _avg_non_heating_usage(
        fuel_type: FuelType,
        avg_summer_usage: float,
        dhw_input: Optional[DhwInput],
        heat_system_efficiency: float,
    ) -> float:
        """Calculates avg non heating usage for this home"""
        if fuel_type == FuelType.GAS:
            return avg_summer_usage
        elif dhw_input is not None and fuel_type == FuelType.OIL:
            # TODO: support non-heating usage for Propane in addition to fuel oil
            return calculate_dhw_usage(dhw_input, heat_system_efficiency)
        else:
            return 0.0

    # @staticmethod
    def _calculate_balance_point_and_ua(
        self,
        balance_point: float,
        avg_ua: float,
        stdev_pct: float,
        uas: float,
        balance_point_graph: BalancePointGraph,
        thermostat_set_point: float,
        stdev_pct_max: float = 0.10,
        max_stdev_pct_diff: float = 0.01,
        next_balance_point_sensitivity: float = 0.5,
    ) -> None:
        """
        Calculates the estimated balance point and UA coefficient for
        the home, removing UA outliers based on a normalized standard
        deviation threshold
        """
        balance_point_graph_row = BalancePointGraphRow(
            balance_point=balance_point,
            heat_loss_rate=avg_ua,
            change_in_heat_loss_rate=0,
            percent_change_in_heat_loss_rate=0,
            standard_deviation=stdev_pct,
        )

        balance_point_graph.records.append(balance_point_graph_row)

        results = Home._refine_balance_point(
            balance_point=balance_point,
            balance_point_sensitivity=next_balance_point_sensitivity,
            avg_ua=avg_ua,
            stdev_pct=stdev_pct,
            thermostat_set_point=thermostat_set_point,
            winter_processed_energy_bills=self.winter_processed_energy_bills,
        )

        new_balance_point = results.balance_point
        new_avg_ua = results.avg_ua
        new_stdev_pct = results.stdev_pct
        balance_point_graph_records_extension = results.balance_point_graph_records_extension

        if isinstance(balance_point_graph_records_extension, list):
            balance_point_graph.records.extend(
                balance_point_graph_records_extension
            )

        while new_stdev_pct > stdev_pct_max:
            outliers = [
                abs(bill.ua - self.avg_ua)
                for bill in self.winter_processed_energy_bills
                if bill.ua is not None
            ]
            biggest_outlier = max(outliers)
            biggest_outlier_idx = outliers.index(biggest_outlier)
            outlier = self.winter_processed_energy_bills.pop(
                biggest_outlier_idx
            )  # removes the biggest outlier
            outlier.eliminated_as_outlier = True
            uas_i = [
                processed_energy_bill.ua
                for processed_energy_bill in self.winter_processed_energy_bills
                if processed_energy_bill.ua is not None
            ]
            avg_ua_i = sts.mean(uas_i)
            stdev_pct_i = sts.pstdev(uas_i) / avg_ua_i
            if (
                # the outlier has been removed
                new_stdev_pct - stdev_pct_i
                < max_stdev_pct_diff
            ):  # if it's a small enough change
                # add the outlier back in
                self.winter_processed_energy_bills.append(
                    outlier
                )  # then it's not worth removing it, and we exit
                outlier.eliminated_as_outlier = False
                break  # may want some kind of warning to be raised as well
            else:
                uas, avg_ua, stdev_pct = uas_i, avg_ua_i, stdev_pct_i

            results = self._refine_balance_point(
                balance_point = balance_point,
                balance_point_sensitivity=next_balance_point_sensitivity,
                avg_ua=avg_ua,
                stdev_pct=stdev_pct,
                thermostat_set_point=self.thermostat_set_point,
                winter_processed_energy_bills=self.winter_processed_energy_bills,
            )

            new_balance_point = results.balance_point
            new_avg_ua = results.avg_ua
            new_stdev_pct = results.stdev_pct
            balance_point_graph_records_extension = results.balance_point_graph_records_extension

            if isinstance(balance_point_graph_records_extension, list):
                balance_point_graph.records.extend(
                    balance_point_graph_records_extension
                )
        return (new_balance_point, new_avg_ua, new_stdev_pct, uas, 
                balance_point_graph)


    @dataclass
    class RefineBalancePointResults:
        balance_point: float
        avg_ua: float
        stdev_pct: float
        balance_point_graph_records_extension: list[BalancePointGraphRow]
        def __init__(self, balance_point,avg_ua,stdev_pct,balance_point_graph_records_extension):
            self.balance_point = balance_point
            self.avg_ua = avg_ua
            self.stdev_pct = stdev_pct
            self.balance_point_graph_records_extension = balance_point_graph_records_extension 

    @staticmethod
    def _refine_balance_point(
        *,
        balance_point: float,
        balance_point_sensitivity: float,
        avg_ua: float,
        stdev_pct: float,
        thermostat_set_point: float,
        winter_processed_energy_bills: list[IntermediateEnergyBill],
    ) -> RefineBalancePointResults:
        """
        Tries different balance points plus or minus a given number
        of degrees, choosing whichever one minimizes the standard
        deviation of the UAs.
        """
        directions_to_check = [1, -1]

        balance_point_graph_records_extension = []

        while directions_to_check:
            bp_i = balance_point + directions_to_check[0] * balance_point_sensitivity

            if bp_i > thermostat_set_point:
                break  # may want to raise some kind of warning as well

            period_hdds_i = [
                period_hdd(bill.avg_temps, bp_i)
                for bill in winter_processed_energy_bills
            ]
            uas_i = [
                bill.partial_ua / period_hdds_i[n]
                for n, bill in enumerate(winter_processed_energy_bills)
            ]
            avg_ua_i = sts.mean(uas_i)
            stdev_pct_i = sts.pstdev(uas_i) / avg_ua_i

            change_in_heat_loss_rate = avg_ua_i - avg_ua
            percent_change_in_heat_loss_rate = 100 * change_in_heat_loss_rate / avg_ua_i

            balance_point_graph_row = BalancePointGraphRow(
                balance_point=bp_i,
                heat_loss_rate=avg_ua_i,
                change_in_heat_loss_rate=change_in_heat_loss_rate,
                percent_change_in_heat_loss_rate=percent_change_in_heat_loss_rate,
                standard_deviation=stdev_pct_i,
            )
            balance_point_graph_records_extension.append(balance_point_graph_row)

            if stdev_pct_i >= stdev_pct:
                directions_to_check.pop(0)
            else:
                balance_point, avg_ua, stdev_pct = (
                    bp_i,
                    avg_ua_i,
                    stdev_pct_i,
                )

                balance_point_graph_row = BalancePointGraphRow(
                    balance_point=balance_point,
                    heat_loss_rate=avg_ua,
                    change_in_heat_loss_rate=change_in_heat_loss_rate,
                    percent_change_in_heat_loss_rate=percent_change_in_heat_loss_rate,
                    standard_deviation=stdev_pct,
                )
                balance_point_graph_records_extension.append(balance_point_graph_row)

                for n, bill in enumerate(winter_processed_energy_bills):
                    bill.total_hdd = period_hdds_i[n]
                    bill.ua = uas_i[n]

                if len(directions_to_check) == 2:
                    directions_to_check.pop(-1)

        return Home.RefineBalancePointResults(
            balance_point= balance_point,
            avg_ua = avg_ua,
            stdev_pct = stdev_pct,
            balance_point_graph_records_extension = balance_point_graph_records_extension,
        )

    @classmethod
    def calculate(
        cls,
        heat_load_input: HeatLoadInput,
        intermediate_energy_bills: list[IntermediateEnergyBill],
        dhw_input: Optional[DhwInput],
        initial_balance_point: float = 60,
        stdev_pct_max: float = 0.10,
        max_stdev_pct_diff: float = 0.01,
        next_balance_point_sensitivity: float = 0.5,
    ) -> "Home":
        """
        For this Home, calculates avg non heating usage and then the
        estimated balance point and UA coefficient for the home,
        removing UA outliers based on a normalized standard deviation
        threshold
        """
        home = object.__new__(cls)
        home._init(
            heat_load_input=heat_load_input,
            intermediate_energy_bills=intermediate_energy_bills,
            dhw_input=dhw_input,
            initial_balance_point=initial_balance_point,
        )
        home.avg_non_heating_usage = Home._avg_non_heating_usage(
            home.fuel_type,
            home.avg_summer_usage,
            home.dhw_input,
            home.heat_system_efficiency,
        )

        home.uas = [
            processed_energy_bill.ua
            for processed_energy_bill in home.winter_processed_energy_bills
            if processed_energy_bill.ua is not None
        ]

        home.balance_point_graph = BalancePointGraph(records=[])

        home.avg_ua = sts.mean(home.uas)
        home.stdev_pct = sts.pstdev(home.uas) / home.avg_ua

        (home.balance_point, home.avg_ua, home.stdev_pct, 
         home.uas, home.balance_point_graph) = home._calculate_balance_point_and_ua(
            home.balance_point,
            home.avg_ua,
            home.stdev_pct,
            home.uas,
            home.balance_point_graph,
            home.thermostat_set_point,
            stdev_pct_max,
            max_stdev_pct_diff,
            next_balance_point_sensitivity,
        )

        return home

    @staticmethod
    def initialize_ua(
        intermediate_energy_bill: IntermediateEnergyBill,
        fuel_type: FuelType,
        heat_system_efficiency: float,
        avg_non_heating_usage: float,
    ) -> None:
        """
        Average heating usage, partial UA, initial UA. requires that
        self.home have non heating usage calculated.
        """
        intermediate_energy_bill.avg_heating_usage = (
            intermediate_energy_bill.usage / intermediate_energy_bill.days
        ) - avg_non_heating_usage
        intermediate_energy_bill.partial_ua = Home.calculate_partial_ua(
            intermediate_energy_bill, fuel_type, heat_system_efficiency
        )
        intermediate_energy_bill.ua = (
            intermediate_energy_bill.partial_ua / intermediate_energy_bill.total_hdd
        )

    @staticmethod
    def calculate_partial_ua(
        intermediate_energy_bill: IntermediateEnergyBill,
        fuel_type: FuelType,
        heat_system_efficiency: float,
    ) -> float:
        """
        The portion of UA that is not dependent on the balance point
        """
        return (
            intermediate_energy_bill.days
            * intermediate_energy_bill.avg_heating_usage  # gallons or therms
            * fuel_type.value  # therm or gallon to BTU
            * heat_system_efficiency  # unitless
            / 24
            # days * gallons/day * (BTU/gallon)/1 day (24 hours)
            # BTUs/hour
        )


class IntermediateEnergyBill:
    """
        An internal class storing data whence heating usage per billing
        period is calculated.
    self.avg_non_heating_usage = Home.
                self.fuel_type, self.avg_summer_usage, self.dhw_input,
                self.heat_system_efficiency
        @staticmethod
                fuel_type: FuelType,
                avg_summer_usage: float,
                dhw_input: DhwInput,
                heat_system_efficiency: float
            floaterae-return self.return return
    """

    input: ProcessedEnergyBillInput
    avg_heating_usage: float
    balance_point: float
    partial_ua: float
    ua: Optional[float]
    total_hdd: float
    eliminated_as_outlier: bool

    def __init__(
        self,
        input: ProcessedEnergyBillInput,
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
