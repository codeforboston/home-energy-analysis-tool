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
1. Look at names of classes, match with erd
5. Combine get_outputs_normalized and convert_to_intermediate_billing_record and get rid of NormalizedBillingRecord. There is only one place NormalizedBillingRecord is used and combining code
gets rid of the need for the class.
- Change
```
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

    def get_outputs_normalized
      loops through billing_periods and does a bunch of stuff
  
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
6. Home - Call home.calculate from home.init or move the code from home.init into home.calculate.  Otherwise, the fact that Home.init does calculations is hidden.  Code looks like this:
```
home=Home(args)   # does some calculations
home.calculate() # does some calculations
```
This would change to either 
```
home=Home(args)
```
or 
```
home=Home.calculate(args)
```
7. Home - change to functional programming paradigm where you provide inputs and outputs
    - Change
    `_calculate_avg_summer_usage()` => `avg_summer_usage = _get_avg_summer_usage(summer_bills)`
    - Change
 `_calculate_avg_non_heating_usage ()` =>
to 
```
avg_non_heating_usage = _get_avg_non_heating_usage (      
    fuel_type,
    avg_summer_usage,
    dhw_input.estimated_water_heating_efficiency, 
    dhw_input.number_of_occupants,
    stand_by_losses, 
    heating_system_efficiency
)
```
==================
- change 
`for billing_period in billing_periods ...` =>
to
```
for billing_period in billing_periods
       { bills_summer, bills_winter, bills_shoulder }
        =_categorize_bills_by_season (billing_periods)
```
==================
- Change
```
calculate_dhw_usage()
```
to 
```      
           dhw_usage = _calculate_dhw_usage (
           estimated_water_heating_efficiency, 
           dhw_input.number_of_occupants,
           stand_by_losses, 
           heating_system_efficiency
           )
```
==================
- Change
`self.initialize_ua(billing_period)` => `_set_ua(billing_period,avg_non_heating_usage)`

- Change?? Parameters are never set
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
==================
- calculate method
`self._calculate_avg_non_heating_usage` - duplicated.  Remove one of the calls
==================

- Change
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
==================



