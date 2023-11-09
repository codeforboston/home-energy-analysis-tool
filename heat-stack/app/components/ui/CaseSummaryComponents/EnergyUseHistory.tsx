export function EnergyUseHistory() {
	const averageIndoorTemperature = '63.5'
	const dailyOtherUsage = '1.07'
	const balancePoint = '60.5'
	const numPeriodsIncluded = '30 / 36'
	const standardDevationUA = '5.52'
	const wholeHomeUA = '1,112'
	const fileName = '20200930_Eversource.csv'

	return (
		<div className="section-title">
			Energy Use History
			<hr />
			<div className="item-group-title">
				Data Source
				<br />
				<div className="item">{fileName}</div> <br />
			</div>
			<div className="item-group-title">Analysis</div>
			<div className="flex flex-row">
				<div className="basis-1/3">
					<div className="item-title-small">
						Average Indoor Temperature (°F) <br />
						<div className="item">{averageIndoorTemperature}</div> <br />
						Daily Other Usage <br />
						<div className="item">{dailyOtherUsage}</div> <br />
					</div>
				</div>
				<div className="basis-1/3">
					<div className="item-title-small">
						Balance Point (°F) <br />
						<div className="item">{balancePoint}</div> <br />
						No. of Periods Included <br />
						<div className="item">{numPeriodsIncluded}</div> <br />
					</div>
				</div>
				<div className="basis-1/3">
					<div className="item-title-small">
						Standard Deviation of UA (%) <br />
						<div className="item">{standardDevationUA}</div> <br />
						Whole-home UA (BTU/h-°F) <br />
						<div className="item">{wholeHomeUA}</div> <br />
					</div>
				</div>
			</div>
			<div className="item-title-small">Usage Details</div>
			<div className="item-title-small">(insert chart here)</div>
		</div>
	)
}
