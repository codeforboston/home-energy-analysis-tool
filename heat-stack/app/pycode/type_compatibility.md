# Type Compatibility Between Pydantic and TypeScript

## Type Correspondences

| Python Type (Pydantic) | TypeScript Type (Zod) | Compatibility Status | Notes |
|------------------------|------------------------|----------------------|-------|
| `FuelType` Enum        | `z.enum(['GAS','OIL','PROPANE'])` | ✅ Compatible | Python uses enum values, TS uses string values, but they're compatible |
| `HeatLoadInput`        | `HomeSchema` + `design_temperature` | ⚠️ Partial Match | TS has additional fields (`numberOfOccupants`, etc) |
| `HeatLoadOutput`       | `summaryOutputSchema` | ✅ Compatible | Fields match exactly |
| `BalancePointGraphRow` | `balancePointGraphRecordSchema` | ✅ Compatible | Fields match exactly |
| `BalancePointGraph`    | `balancePointGraphSchema` | ✅ Compatible | Fields match exactly |
| `ProcessedEnergyBill`  | `oneProcessedEnergyBillSchema` | ⚠️ Partial Match | `analysis_type` is Enum in Python but number in TS |
| `TemperatureInput`     | `TemperatureInputDataConverted` | ⚠️ Partial Match | Python uses `datetime`, TS uses string |
| `AnalysisType` Enum    | `z.number()` | ⚠️ Partial Match | Should use enum values in TS for better type safety |

## Compatibility Details

### FuelType
- Python: Enum with values `GAS`, `OIL`, `PROPANE` 
- TypeScript: String enum with the same values
- Compatibility: Good, strings pass correctly

### HeatLoadInput vs HomeSchema
- Python: `living_area`, `fuel_type`, `heating_system_efficiency`, `thermostat_set_point`, `setback_temperature`, `setback_hours_per_day`, `design_temperature`
- TypeScript: Same fields plus additional DHW fields
- Compatibility: Good for the matching fields, but TypeScript has extra fields that may not be used

### HeatLoadOutput vs summaryOutputSchema
- Fields match exactly between both models
- Compatibility: Perfect match

### ProcessedEnergyBill vs oneProcessedEnergyBillSchema
- Main issue: `analysis_type` is an Enum in Python but a number in TypeScript
- TypeScript commented code indicates enum was considered but not implemented
- Compatibility: Will work as long as the enum values match the numbers (which they do)

### TemperatureInput vs TemperatureInputDataConverted
- Python: Uses `datetime` objects for dates
- TypeScript: Uses string format
- Compatibility: Works with proper date conversion (which is handled in the code)

## Recommendations

1. **Update AnalysisType in TypeScript**: Change `analysis_type: z.number()` to a proper enum in TypeScript that matches the Python enum values for better type safety and code readability.

2. **Standardize Date Handling**: Consider consistent date handling between Python and TypeScript - either all string-based or consistent date object conversions.

3. **Consolidate Home and DHW Models**: Consider consolidating `HomeSchema` in TypeScript to better match the Python `HeatLoadInput` model by separating out the DHW fields.

4. **Add Type Documentation**: Add documentation to both the Python and TypeScript models to explicitly describe the relationships between the two type systems.