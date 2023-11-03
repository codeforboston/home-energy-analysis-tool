import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export function CaseSummary() {
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
				<div className="navigation">Back to website</div>

				<div className="header-cards">
					<div className="card-inner">
						<h5 className="text-h5">Winnie Carroll’s Case Summary</h5>
					</div>

					<div className="card-inner">179 Broadway, Somerville, MA 02145</div>
				</div>
				<div className="main-title">
					<h5 className="text-center text-h5">
						Summary of heat load analysis outputs
					</h5>
				</div>
			</div>

			<div className="main-cards">
				<div className="card-inner">
					<div className="card-title">
						Avg heat load at design temp
						<br />
						<br />
						<b className="card-statistic">58,582 BTU/h</b>
					</div>
				</div>

				<div className="card-inner">
					<div className="card-title">
						Average indoor temp
						<br />
						<br />
						<b className="card-statistic">60.0 F</b>
					</div>
				</div>

				<div className="card-inner">
					<div className="card-title">
						Standard deviation of UA
						<br />
						<br />
						<b className="card-statistic">5.08%</b>
					</div>
				</div>

				<div className="card-inner">
					<div>
						Balance point
						<LineChart
							width={250}
							height={150}
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

				<div className="card-inner">
					<div className="card-title">
						Max heat load at design temp
						<br />
						<br />
						<b className="card-statistic">69,793 BTU/h</b>
					</div>
				</div>

				<div className="card-inner">
					<div className="card-title">
						Design temp
						<br />
						<br />
						<b className="card-statistic">8.4 F</b>
					</div>
				</div>

				<div className="card-inner">
					<div className="card-title">
						Whole home UA
						<br />
						<br />
						<b className="card-statistic">1057 BTU/h-F</b>
					</div>
				</div>
			</div>
		</main>
	)
}
