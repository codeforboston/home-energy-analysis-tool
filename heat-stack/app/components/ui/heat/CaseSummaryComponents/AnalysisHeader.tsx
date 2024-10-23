import { type z } from 'zod';
import { type UsageDataSchema } from '#/types/types.ts'; 

export function AnalysisHeader({ usage_data }: { usage_data: UsageDataSchema}) {
	// Example usage_data
	// new Map([[
	// 		"estimated_balance_point",
	// 		61.5
	// 	],[
	// 		"other_fuel_usage",
	// 		0.2857142857142857
	// 	],[
	// 		"average_indoor_temperature",
	// 		67
	// 	],[
	// 		"difference_between_ti_and_tbp",
	// 		5.5
	// 	],[
	// 		"design_temperature",
	// 		1
	// 	],[
	// 		"whole_home_heat_loss_rate",
	// 		48001.81184312083
	// 	],[
	// 		"standard_deviation_of_heat_loss_rate",
	// 		0.08066745182677547
	// 	],[
	// 		"average_heat_load",
	// 		3048115.0520381727
	// 	],[
	// 		"maximum_heat_load",
	// 		3312125.0171753373
	// 	]])

	// Extract the summary_output from usage_data
	const summaryOutputs = usage_data?.summary_output;

	// Calculate the number of billing periods included in Heating calculations
	const heatingAnalysisTypeRecords = usage_data?.billing_records?.filter(
		(billingRecord) => billingRecord.analysis_type === 1,
		// Do wee need this code instead? (billingRecord) => billingRecord.analysis_type !== "NOT_ALLOWED_IN_CALCULATIONS",
	);

	const recordsIncludedByDefault = heatingAnalysisTypeRecords?.filter(
		(billingRecord) =>
		billingRecord.default_inclusion_by_calculation === true &&
		billingRecord.inclusion_override === false,
	).length;

	const recordsIncludedByOverride = heatingAnalysisTypeRecords?.filter(
		(billingRecord) =>
		billingRecord.default_inclusion_by_calculation === false &&
		billingRecord.inclusion_override === true,
	).length;

	const numRecordsForHeatingCalculations =
		(recordsIncludedByDefault || 0) + (recordsIncludedByOverride || 0);


	return (
		<div className="section-title">
			<div className="item-group-title">Heat Load Analysis</div>
			<div className="flex flex-row">
				<div className="basis-1/3">
					<div className="item-title-small">
						Average Indoor Temperature <br />
						<div className="item">
							{summaryOutputs?.average_indoor_temperature} °F
						</div>
						<br />
						Balance Point Temperature
						<br />
						<div className="item">
							{summaryOutputs?.estimated_balance_point} °F
						</div>
						<br />
					</div>
				</div>
				<div className="basis-1/3">
					<div className="item-title-small">
						Number of Periods Included <br />
						<div className="item">{numRecordsForHeatingCalculations}</div>
						<br />
						Daily non-heating Usage <br />
						<div className="item">
							{/* Rounding to two decimal places */}
							{summaryOutputs?.other_fuel_usage?.toFixed(2)} therms
						</div>
					</div>
				</div>
				<div className="basis-1/3">
					<div className="item-title-small">
						Standard Deviation of UA <br />
						<div className="item">
							{/* Rounding to two decimal places */}
							{(
								summaryOutputs?.standard_deviation_of_heat_loss_rate * 100
							)?.toFixed(2)}{' '}
							%
						</div>
						<br />
						Whole-home UA
						<br />
						<div className="item">
							{/* Rounding to zero decimal places */}
							{summaryOutputs?.whole_home_heat_loss_rate?.toFixed(0)} BTU/h-°F
						</div>
						<br />
					</div>
				</div>
			</div>
		</div>
	)
}
