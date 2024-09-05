import { type z } from 'zod'
import { type HeatLoadAnalysisZod} from '#types/index'

type HeatLoadAnalysisZod = z.infer<typeof HeatLoadAnalysisZod>
export function AnalysisHeader(props: { usage_data: any }) {
	// const heatLoadAnalysis: HeatLoadAnalysisZod = {
	// 	rulesEngineVersion: 'Beta 1',
	// 	estimatedBalancePoint: 60.5,
	// 	otherFuelUsage: 1.07,
	// 	averageIndoorTemperature: 68,
	// 	differenceBetweenTiAndTbp: 0,
	// 	design_temperature: 0,
	// 	wholeHomeHeatLossRate: 1112,
	// 	standardDeviationHeatLossRate: 5.52,
	// 	averageHeatLoad: 0,
	// 	maximumHeatLoad: 0,
	// }

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
	

	const summaryOutputs = props.usage_data?.get('summary_output')

	// Calculate the number of billing periods included in Heating calculations
	const heatingAnalysisTypeRecords = props.usage_data?.get('billing_records')?.filter((billingRecord) => billingRecord.get('analysis_type') == 1)
	
	const recordsIncludedByDefault = heatingAnalysisTypeRecords?.filter((billingRecord) => billingRecord.get('default_inclusion_by_calculation') == true && billingRecord.get('inclusion_override') == false).length

	const recordsIncludedByOverride = heatingAnalysisTypeRecords?.filter((billingRecord) => billingRecord.get('default_inclusion_by_calculation') == false && billingRecord.get('inclusion_override') == true).length

	const numRecordsForHeatingCalculations = recordsIncludedByDefault + recordsIncludedByOverride

	return (
		<div className="section-title">
			<div className="item-group-title">Heat Load Analysis</div>
			<div className="flex flex-row">
				<div className="basis-1/3">
					<div className="item-title-small">
						Average Indoor Temperature <br />
						<div className="item">
							 {summaryOutputs?.get('average_indoor_temperature')} °F
						</div>{' '}
						<br />
						Balance Point Temperature<br />
						<div className="item">
							{summaryOutputs?.get('estimated_balance_point')} °F
						</div>{' '}
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
							{summaryOutputs?.get('other_fuel_usage').toFixed(2)} therms
						</div>{' '}
					</div>
				</div>
				<div className="basis-1/3">
					<div className="item-title-small">
						Standard Deviation of UA <br />
						<div className="item">
							{/* Rounding to two decimal places */}
							{(summaryOutputs?.get('standard_deviation_of_heat_loss_rate')*100).toFixed(2)} %
						</div>{' '}
						<br />
						Whole-home UA
						<br />
						<div className="item">
							{/* Rounding to zero decimal places */}
							{summaryOutputs?.get('whole_home_heat_loss_rate').toFixed(0)} BTU/h-°F
						</div>{' '}
						<br />
					</div>
				</div>
			</div>
		</div>
	)
}
