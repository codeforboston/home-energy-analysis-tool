export function CurrentHeatingSystem() {
	const fuelType = 'Natural Gas'
	const heatingSystemEfficiency = '75'
	const setPoint = '70'
	const setbackTemperature = '65'
	const setbackTime = '7'

	return (
		<div className="section-title">
			Current Heating System
			<div className="flex flex-row">
				<div className="basis-1/2">
					<div className="item-title">
						Fuel Type
						<br />
						<div className="item">{fuelType}</div> <br />
						Heating System Efficiency (%)
						<br />
						<div className="item">{heatingSystemEfficiency}</div> <br />
					</div>
				</div>

				<div className="basis-1/2">
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
		</div>
	)
}
