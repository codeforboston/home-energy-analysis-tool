import { Form } from '@remix-run/react'
import { Input } from '../input.tsx'
import { Label } from '../label.tsx'

export function HomeInformation() {
	const name = 'Pietro Schirano'
	const street = '567 Pine Avenue Apt 21'
	const city = 'Rivertown'
	const state = 'MA'
	const zip = '02856'
	const country = 'United States of America'
	const livingArea = '3000'
	const designTemperature = '63'
	const designTemperatureOverride = '65'
	return (
		<div className="section-title">
			Home Information
			<div className="flex flex-row">
				<div className="basis-1/2">
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

				<div className="basis-1/2">
					<div className="item-title">
						Design Temperature (°F) <br />
						<div className="item">{designTemperature}</div> <br />
						<Form
							method="GET"
							action="/users"
							className="flex flex-wrap items-center justify-center gap-2"
							onChange={e => true}
						>
							<div className="flex-1">
								<Label htmlFor="override">Override</Label>
								<Input
									type="text"
									name="override"
									id="override"
									defaultValue={designTemperatureOverride}
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
