import { type z } from 'zod'
import { type HeatLoadAnalysisZod} from '#types/index'

type HeatLoadAnalysisZod = z.infer<typeof HeatLoadAnalysisZod>
export function AnalysisHeader(props: { usage_data: any }) {
	const heatLoadAnalysis: HeatLoadAnalysisZod = {
		rulesEngineVersion: 'Beta 1',
		estimatedBalancePoint: 60.5,
		otherFuelUsage: 1.07,
		averageIndoorTemperature: 68,
		differenceBetweenTiAndTbp: 0,
		design_temperature: 0,
		wholeHomeHeatLossRate: 1112,
		standardDeviationHeatLossRate: 5.52,
		averageHeatLoad: 0,
		maximumHeatLoad: 0,
	}
	console.log("AnalysisHeader:", props.usage_data?.get('summary_output'))

	const summaryOutputs = props.usage_data?.get('summary_output')
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
							{/* {heatLoadAnalysis.estimatedBalancePoint} */}
							{summaryOutputs?.get('estimated_balance_point')} °F
						</div>{' '}
						<br />
					</div>
				</div>
				<div className="basis-1/3">
					<div className="item-title-small">
						Number of Periods Included <br />
						<div className="item">(to be calculated)</div>
						<br />
						Daily non-heating Usage <br />
						<div className="item">
							{/* {heatLoadAnalysis.otherFuelUsage} therms */}
							{/* Rounding to two decimal places */}
							{summaryOutputs?.get('other_fuel_usage').toFixed(2)} therms
						</div>{' '}
					</div>
				</div>
				<div className="basis-1/3">
					<div className="item-title-small">
						Standard Deviation of UA <br />
						<div className="item">
							{/* {heatLoadAnalysis.standardDeviationHeatLossRate} % */}
							{/* Rounding to two decimal places */}
							{(summaryOutputs?.get('standard_deviation_of_heat_loss_rate')*100).toFixed(2)} %
						</div>{' '}
						<br />
						Whole-home UA
						<br />
						<div className="item">
							{/* {heatLoadAnalysis.wholeHomeHeatLossRate} BTU/h-°F */}
							{summaryOutputs?.get('whole_home_heat_loss_rate').toFixed(0)} BTU/h-°F
						</div>{' '}
						<br />
					</div>
				</div>
			</div>
		</div>
	)
}
