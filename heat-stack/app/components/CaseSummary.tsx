import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from 'recharts'

export function CaseSummary() {
	const data = [
		{
			name: 'Page A',
			uv: 4000,
			pv: 2400,
			amt: 2400,
		},
		{
			name: 'Page B',
			uv: 3000,
			pv: 1398,
			amt: 2210,
		},
		{
			name: 'Page C',
			uv: 2000,
			pv: 9800,
			amt: 2290,
		},
		{
			name: 'Page D',
			uv: 2780,
			pv: 3908,
			amt: 2000,
		},
		{
			name: 'Page E',
			uv: 1890,
			pv: 4800,
			amt: 2181,
		},
		{
			name: 'Page F',
			uv: 2390,
			pv: 3800,
			amt: 2500,
		},
		{
			name: 'Page G',
			uv: 3490,
			pv: 4300,
			amt: 2100,
		},
	]

	return (
		<main className="main-container">
			<div>
				<b>Back to website</b>
				<br />
				<h3>Winnie Carroll’s Case Summary</h3>
				<h5>179 Broadway, Somerville, MA 02145</h5>
				<div className="main-title">
					<h3>Summary of heat load analysis outputs</h3>
				</div>
			</div>
			<div className="main-cards">
				<div className="card-inner">
					<img
						src="https://heat-tool.s3.amazonaws.com/graphic1.png"
						alt="grapic"
					/>
				</div>

				<div className="card-inner">
					<img
						src="https://heat-tool.s3.amazonaws.com/graphic2.png"
						alt="grapic"
					/>
				</div>

				<div className="card-inner">
					<img
						src="https://heat-tool.s3.amazonaws.com/graphic3.png"
						alt="grapic"
					/>
				</div>

				<div className="card-inner">
					<img
						src="https://heat-tool.s3.amazonaws.com/graphic4.png"
						alt="grapic"
					/>
				</div>
			</div>
			<div className="main-cards">
				<div className="card-inner">
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
						<Legend />
						<Line
							type="monotone"
							dataKey="pv"
							stroke="#8884d8"
							activeDot={{ r: 8 }}
						/>
						<Line type="monotone" dataKey="uv" stroke="#82ca9d" />
					</LineChart>
				</div>
			</div>
		</main>
	)
}
