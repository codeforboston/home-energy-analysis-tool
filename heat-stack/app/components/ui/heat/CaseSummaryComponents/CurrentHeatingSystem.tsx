import { Home } from '#models/Home.tsx'

export function CurrentHeatingSystem() {
	let home = new Home(
		'Pietro',
		'Schirano',
		'3,000',
		'63',
		'65',
		'Natural Gas',
		'75',
		'70',
		'65',
		'7',
	)
	return (
		<div className="section-title">
			Current Heating System
			<hr />
			<div className="flex flex-row">
				<div className="basis-1/2">
					<div className="item-title">
						Fuel Type
						<br />
						<div className="item-big">{home.fuelType}</div> <br />
						Heating System Efficiency (%)
						<br />
						<div className="item-big">{home.heatingSystemEfficiency}</div>{' '}
						<br />
					</div>
				</div>

				<div className="basis-1/2">
					<div className="item-group-title">Thermostat Settings</div>
					<div className="item-title">
						Set Point (°F) <br />
						<div className="item">{home.setPoint}</div> <br />
						Setback Temperature (°F)
						<br />
						<div className="item">{home.setbackTemperature}</div> <br />
						Setback Time (h)
						<div className="item">{home.setbackTime}</div>
					</div>
				</div>
			</div>
		</div>
	)
}
