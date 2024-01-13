export function AnalysisHeader() {
	const averageIndoorTemperature = '63.5'
	const dailyOtherUsage = '1.07'
	const balancePoint = '60.5'
	const standardDevationUA = '5.52'
	const wholeHomeUA = '1,112'

	return (
		<div className="section-title">
			<div className="item-group-title">Analysis</div>
			<div className="flex flex-row">
				<div className="basis-1/3">
					<div className="item-title-small">
						Average Indoor Temperature <br />
						<div className="item">{averageIndoorTemperature} °F</div> <br />
						Balance Point Temperature (°F) <br />
						<div className="item">{balancePoint}</div> <br />
					</div>
				</div>
				<div className="basis-1/3">
					<div className="item-title-small">
						Number of Periods Included <br />
						<div className="item">(to be calculated)</div>
						<br />
						Daily non-heating Usage <br />
						<div className="item">{dailyOtherUsage} therms</div>{' '}
					</div>
				</div>
				<div className="basis-1/3">
					<div className="item-title-small">
						Standard Deviation of UA <br />
						<div className="item">{standardDevationUA} %</div> <br />
						Whole-home UA
						<br />
						<div className="item">{wholeHomeUA} BTU/h-°F</div> <br />
					</div>
				</div>
			</div>
		</div>
	)
}
