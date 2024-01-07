import { HeatingLoadAnalysis } from '#models/HeatingLoadAnalysis.tsx'

export function AnalysisHeader() {
	let heatingLoadAnalysis = new HeatingLoadAnalysis(
		'rules_engine_version?',
		'balance_point_initial?',
		'60.5',
		'1.07',
		'balance_point_sensitivity?',
		'63.5',
		'1,112',
		'5.52',
		'average_heat_load?',
		'maximum_heat_load?',
	)

	return (
		<div className="section-title">
			<div className="item-group-title">Analysis</div>
			<div className="flex flex-row">
				<div className="basis-1/3">
					<div className="item-title-small">
						Average Indoor Temperature <br />
						<div className="item">
							{heatingLoadAnalysis.averageIndoorTemperature} °F
						</div>{' '}
						<br />
						Balance Point Temperature (°F) <br />
						<div className="item">{heatingLoadAnalysis.balancePoint}</div>{' '}
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
							{heatingLoadAnalysis.dailyOtherUsage} therms
						</div>{' '}
					</div>
				</div>
				<div className="basis-1/3">
					<div className="item-title-small">
						Standard Deviation of UA <br />
						<div className="item">
							{heatingLoadAnalysis.standardDevationUA} %
						</div>{' '}
						<br />
						Whole-home UA
						<br />
						<div className="item">
							{heatingLoadAnalysis.wholeHomeUA} BTU/h-°F
						</div>{' '}
						<br />
					</div>
				</div>
			</div>
		</div>
	)
}
