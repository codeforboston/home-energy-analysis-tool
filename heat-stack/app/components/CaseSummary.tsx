import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export function CaseSummary() {
	const name = 'Pietro Schirano'
	const street = '567 Pine Avenue Apt 21'
	const city = 'Rivertown'
	const state = 'MA'
	const zip = '02856'
	const country = 'United States of America'
	const livingArea = '3000'
	const designTemperature = '63'
	const designTemperatureOverride = '65'
	const fuelType = 'Natural Gas'
	const heatingSystemEfficiency = '75'
	const setPoint = '70'
	const setbackTemperature = '65'
	const setbackTime = '7'
	const fileName = '20200930_Eversource.csv'
	const averageIndoorTemperature = '63.5'
	const dailyOtherUsage = '1.07'
	const balancePoint = '60.5'
	const numPeriodsIncluded = '30 / 36'
	const standardDevationUA = '5.52'
	const wholeHomeUA = '1,112'

	const data = [
		{
			name: '58 F',
			uv: 15,
			amt: 9,
		},
		{
			name: '59 F',
			uv: 11.3,
			amt: 8.3,
		},
		{
			name: '60 F',
			uv: 7.9,
			amt: 8.6,
		},
		{
			name: '61 F',
			uv: 6.4,
			amt: 7.5,
		},
		{
			name: '62 F',
			uv: 7.1,
			amt: 8.2,
		},
		{
			name: '63 F',
			uv: 13.12,
			amt: 7.89,
		},
	]

	return (
		<main className="main-container">
			<div>
				<div className="page-title"> Case Summary</div>

				<div className="section-title"> Home Information </div>
				<div className="two-cards">
					<div className="card-inner">
						<div className="item-title">
							Resident / Client
							<br />
							<div className="item">{name}</div> <br />
							Address
							<div className="item">{street}</div>
							<div className="item">
								{city}, {state}, {zip}
							</div>
							<div className="item">{country}</div> <br />
							Living Area (sf)
							<div className="item">{livingArea}</div>
						</div>
					</div>

					<div className="card-inner">
						<div className="item-title">
							Design Temperature (°F) <br />
							<div className="item">{designTemperature}</div> <br />
							<div className="item">Override: {designTemperatureOverride}</div>
						</div>
					</div>
				</div>

				<hr />

				<div className="section-title"> Current Heating System </div>
				<div className="two-cards">
					<div className="card-inner">
						<div className="item-title">
							Fuel Type
							<br />
							<div className="item">{fuelType}</div> <br />
							Heating System Efficiency (%)
							<br />
							<div className="item">{heatingSystemEfficiency}</div> <br />
						</div>
					</div>

					<div className="card-inner">
						<div className="item-title">
							Set Point (°F) <br />
							<div className="item">{setPoint}</div> <br />
							Setback Temperature (°F)
							<br />
							<div className="item">{setbackTemperature}</div> <br />
							Setback Time (h)
							<div className="item">{setbackTime}</div>
						</div>
					</div>
				</div>

				<hr />

				<div className="section-title">Energy Use History</div>
				<div className="item-title">
					Data Source
					<br />
					<div className="item">{fileName}</div> <br />
				</div>
				<div className="item-title">Analysis</div>
				<div className="three-cards">
					<div className="card-inner">
						<div className="item-title-small">
							Average Indoor Temperature (°F) <br />
							<div className="item">{averageIndoorTemperature}</div> <br />
							Daily Other Usage <br />
							<div className="item">{dailyOtherUsage}</div> <br />
						</div>
					</div>

					<div className="card-inner">
						<div className="item-title-small">
							Balance Point (°F) <br />
							<div className="item">{balancePoint}</div> <br />
							No. of Periods Included <br />
							<div className="item">{numPeriodsIncluded}</div> <br />
						</div>
					</div>

					<div className="card-inner">
						<div className="item-title-small">
							Standard Deviation of UA (%) <br />
							<div className="item">{standardDevationUA}</div> <br />
							Whole-home UA (BTU/h-F) <br />
							<div className="item">{wholeHomeUA}</div> <br />
						</div>
					</div>
				</div>

				<hr />

				<div className="section-title">Graphs</div>
				<div className="item-title">
					Balance point
					<LineChart
						width={750}
						height={450}
						data={data}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="name" />
						<YAxis />
						<Tooltip />
						<Line type="monotone" dataKey="uv" stroke="#82ca9d" />
					</LineChart>
				</div>
			</div>
		</main>
	)
}
