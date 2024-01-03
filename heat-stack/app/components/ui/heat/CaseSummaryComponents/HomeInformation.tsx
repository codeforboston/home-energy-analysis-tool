import { Form } from '@remix-run/react'

import { Home } from '#models/Home.tsx'
import { Location } from '#models/Location.tsx'

import { Input } from '../../input.tsx'
import { Label } from '../../label.tsx'

export function HomeInformation() {
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

	let location = new Location(
		'567 Pine Avenue Apt 21',
		'Rivertown',
		'MA',
		'02856',
		'United States of America',
	)

	return (
		<div className="section-title">
			Home Information
			<hr />
			<div className="flex flex-row">
				<div className="basis-1/2">
					<div className="item-title">
						Resident / Client
						<br />
						<div className="item-big">
							{home.first_name} {home.last_name}
						</div>{' '}
						<br />
						Address
						<div className="item-big">{location.street}</div>
						<div className="item-big">
							{location.city}, {location.state}, {location.zip}
						</div>
						<div className="item-big">{location.country}</div> <br />
						Living Area (sf)
						<div className="item-big">{home.livingArea}</div>
					</div>
				</div>

				<div className="basis-1/2">
					<div className="item-title">
						Design Temperature (°F) <br />
						<div className="item-big">{home.designTemperature}</div> <br />
						<Form
							method="GET"
							action="/users"
							className="flex flex-wrap items-center justify-center gap-2"
							onChange={e => true}
						>
							<div className="flex-1">
								<Label className="item-title" htmlFor="override">
									Override
								</Label>
								<Input
									type="text"
									name="override"
									id="override"
									defaultValue={home.designTemperatureOverride}
									className="w-full"
								/>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</div>
	)
}
