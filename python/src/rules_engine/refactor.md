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
2. Rename rules-engine to "python"
3. Rename NormalizedBillingRecordBase class to BillingInput
4. Rename BillingPeriod to IntermediateProcessedEnergyBill and processed_energy_bill_input to processed_energy_bill_intermediate
5. Combine get_outputs_normalized and convert_to_intermediate_processed_energy_bill and get rid of NormalizedBillingRecord. There is only one place NormalizedBillingRecord is used and combining code
gets rid of the need for the class.
- Change
```
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
        heat_load_input, None, temperature_input, processed_energy_bill_inputs
    )

    def get_outputs_normalized
      loops through processed_energy_bill_inputs and does a bunch of stuff
  
```
to 
```
      inputBill = 
            ProcessedEnergyBillInput(
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
      processedBill = IntermediateProcessedEnergyBill(
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
`for processed_energy_bill_input in processed_energy_bill_inputs ...` =>
to
```
for processed_energy_bill_input in processed_energy_bill_inputs
       { summer_processed_energy_bills, winter_processed_energy_bills, shoulder_processed_energy_bills }
        =_categorize_bills_by_season (processed_energy_bill_inputs)
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
`self.initialize_ua(processed_energy_bill_input)` => `_set_ua(processed_energy_bill_input,avg_non_heating_usage)`

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
            winter_processed_energy_bills)
```    
==================



