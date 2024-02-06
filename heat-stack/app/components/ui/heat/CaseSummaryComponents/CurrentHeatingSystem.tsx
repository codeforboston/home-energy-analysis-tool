import { Form } from '@remix-run/react'
import { Button } from '#/app/components/ui/button.tsx'

import { Input } from '#/app/components/ui/input.tsx'
import { Label } from '#/app/components/ui/label.tsx'

export function CurrentHeatingSystem() {
	const titleClass = 'text-5xl font-extrabold tracking-wide'
	const subtitleClass = 'text-2xl font-semibold text-zinc-950 mt-9'
	const descriptiveClass = 'mt-2 text-sm text-slate-500'
	const componentMargin = 'mt-10'

	return (
		<div>
			<h2 className={`${titleClass} ${componentMargin}`}>
				Existing Heating System
			</h2>

			<Form method="post" action="/current">
				<h6 className={`${subtitleClass}`}>Fuel Type</h6>
				<div className="flex space-x-4">
					<div className="basis-1/4">
						<Input name="fuelType" id="fuelType" type="text" />
					</div>
				</div>

				<h6 className={`${subtitleClass}`}>Heating system efficiency %</h6>
				<div className="flex space-x-4">
					<div className={`basis-1/3`}>
						<Input
							name="heatingSystemEfficiency"
							id="heatingSystemEfficiency"
							type="text"
							placeholder="(Percent)"
						/>
						<div className={`${descriptiveClass}`}>
							Typical natural gas efficiency is 80%-95%
						</div>
					</div>
				</div>

				<h6 className={`${subtitleClass}`}>Design temperature override (°F)</h6>
				<div className="flex space-x-4">
					<div className={`basis-1/3`}>
						<Input
							name="designTemperatureOverride"
							id="designTemperatureOverride"
							type="text"
							placeholder="(Optional)"
						/>
						<div>
							<div className={`${descriptiveClass}`}>
								65°F is the 99% ASHRAE heating design temperature at this
								location
							</div>
						</div>
					</div>
				</div>

				<div>
					<h6 className={`${subtitleClass}`}>Thermostat Settings</h6>
					<div className="mt-4 flex space-x-4">
						<div className="basis-1/3">
							<Label htmlFor="setPoint">
								<b>Set Point (°F)</b>{' '}
							</Label>
							<Input
								name="setPointTemperature"
								id="setPointTemperature"
								type="text"
								placeholder="(Fahrenheit)"
							/>
							<div className={`${descriptiveClass}`}>
								Usual thermostat setting for heating
							</div>
						</div>
						<div className="basis-1/3">
							<Label htmlFor="setPoint">
								<b>Setback Temperature (°F)</b>
							</Label>
							<Input
								name="setBackTemperature"
								id="setBackTemperature"
								type="text"
								placeholder="(Optional)"
							/>
							<div className={`${descriptiveClass}`}>
								Enter if thermostat is programmed to a lower or higher
								temperature during working or sleep hours
							</div>
						</div>
						<div className="basis-1/3">
							<Label htmlFor="setPoint">
								<b>Setback hours per day</b>
							</Label>
							<Input
								name="setBackTime"
								id="setBackTime"
								type="text"
								placeholder="(Optional)"
							/>
							<div className={`${descriptiveClass}`}>
								Typical natural gas efficiency is 80%-95%
							</div>
							<div className={`${descriptiveClass}`}>
								Average hours per day that a lower or higher temperature setting
								is in effect
							</div>
						</div>
					</div>
				</div>

				<div>
					<h6 className={`${subtitleClass}`}>Heating Fuel Usage</h6>
					<Button type="submit">Upload</Button>
				</div>
			</Form>

			{/* removed temporarily for single page app format */}
			{/* <div>
        <Button type="submit">Next ={'>'}</Button>
      </div> */}
		</div>
	)
}
