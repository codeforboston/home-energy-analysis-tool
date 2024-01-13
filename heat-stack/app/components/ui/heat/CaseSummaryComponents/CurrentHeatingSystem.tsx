import { type Home } from '#model/Homes.tsx'

export function CurrentHeatingSystem() {
	const someHome: Home = {
		livingArea: 0,
		fuelType: 'Natural Gas',
		// designTemperatureOverride: number,
		heatingSystemEfficiency: 75,
		thermostatSetPoint: 70,
		setbackTemperature: 65,
		setBackHoursPerDay: 7,
		// numberOfOccupants: number
		// estimatedWaterHeatingEfficiency: number
		// standByLosses: number
	}

	return (
		<div className="section-title">
			Current Heating System
			<hr />
			<div className="flex flex-row">
				<div className="basis-1/2">
					<div className="item-title">
						Fuel Type
						<br />
						<div className="item-big">{someHome.fuelType}</div> <br />
						Heating System Efficiency (%)
						<br />
						<div className="item-big">
							{someHome.heatingSystemEfficiency}
						</div>{' '}
						<br />
					</div>
				</div>

				<div className="basis-1/2">
					<div className="item-group-title">Thermostat Settings</div>
					<div className="item-title">
						Set Point (°F) <br />
						<div className="item">{someHome.setbackTemperature}</div> <br />
						Setback Temperature (°F)
						<br />
						<div className="item">{someHome.setbackTemperature}</div> <br />
						Setback Time (h)
						<div className="item">{someHome.setBackHoursPerDay}</div>
					</div>
				</div>
			</div>
		</div>
	)
}
