

Qs:
- stand_by_losses

home variables used
```
  avg_ua
  balance_point
  non_heating_usage
  stdev_pct
  balance_point_graph
```

1. Remove temporary_rules_engine.py

2. Combine class NormalizedBillingPeriodRecordBase and class NormalizedBillingPeriodRecord
3. Rename new combined class to BillingInput
4. Rename BillingPeriod to ProcessedBill and billing_period to processed_bill
5. Combine get_outputs_normalized and convert_to_intermediate_billing_record
- Change
```
        billing_periods.append(
            NormalizedBillingPeriodRecordBase(
                period_start_date=input_val.period_start_date,
                period_end_date=input_val.period_end_date,
                usage=input_val.usage_therms,
                analysis_type_override=input_val.inclusion_override,
                inclusion_override=True,
            )
        )
```
to 
```
      inputBill = 
            NormalizedBillingPeriodRecordBase(
                period_start_date=input_val.period_start_date,
                period_end_date=input_val.period_end_date,
                usage=input_val.usage_therms,
                analysis_type_override=input_val.inclusion_override,
                inclusion_override=True,
            )
        )
      avg_temps = derive_avg_temps(temparature_input)
      default_analysis_type = derive_default_analysis_type
        ( fuel_type,
          inputBill.start_date,
          inputBill.end_date
        )
      processedBill = ProcessedBill(
        input = inputBill,
        avg_temps = avg_temps,
        default_analysis_type = default_analysis_type
        // usage not needed, it is part of inputBill
      )
```
6.Home - Have Home.init call Home.calculate rather than call it separately
7. Home - change to functional programming where you provide all inputs needed
    - _calculate_avg_summer_usage() =>
      avg_summer_usage = _get_avg_summer_usage(summer_bills)
    - `_calculate_avg_non_heating_usage ()` =>

avg_non_heating_usage = _get_avg_non_heating_usage (      
    fuel_type,
    avg_summer_usage,
    dhw_input.estimated_water_heating_efficiency, 
    dhw_input.number_of_occupants,
    stand_by_losses, 
    heating_system_efficiency
)

`for billing_period in billing_periods` =>
```
       { bills_summer, bills_winter, bills_shoulder }
        =_categorize_bills_by_season (billing_periods)
```
`calculate_dhw_usage()` =>
```      
           dhw_usage = _calculate_dhw_usage (
           estimated_water_heating_efficiency, 
           dhw_input.number_of_occupants,
           stand_by_losses, 
           heating_system_efficiency
           )
```
`self.initialize_ua(billing_period)` =>
`_set_ua(billing_period,avg_non_heating_usage)`

```
def calculate(
        self,
        initial_balance_point_sensitivity: float = 0.5,
        stdev_pct_max: float = 0.10,
        max_stdev_pct_diff: float = 0.01,
        next_balance_point_sensitivity: float = 0.5,
    ) 
```
=>
```
def calculate (
    
    initial_balance_point_sensitivity: float = 0.5,
    stdev_pct_max: float = 0.10,
    max_stdev_pct_diff: float = 0.01,
    next_balance_point_sensitivity: float = 0.5,
```

calculate
`self._calculate_avg_non_heating_usage` (duplicate)
```
self._calculate_balance_point_and_ua(
            initial_balance_point_sensitivity,
            stdev_pct_max,
            max_stdev_pct_diff,
            next_balance_point_sensitivity,
        )
``` => 
```
{   balance_point, stdev_pct
                balance_point_graph } =
             _get_graph (initial_balance_point_sensitivity,
            stdev_pct_max,
            max_stdev_pct_diff,
            next_balance_point_sensitivity,
            bills_winter)
```    



