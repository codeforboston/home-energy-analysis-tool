import { Form } from '@remix-run/react'
import React from 'react'
// removed temporarily for single-page app format
// import { Button } from '#/app/components/ui/button.tsx'
import { Input } from '#/app/components/ui/input.tsx'
import { Label } from '#/app/components/ui/label.tsx'

export function CurrentHeatingSystem() {
	const titleClassTailwind = 'text-5xl font-extrabold tracking-wide'
	const subTitleClassTailwind = 'text-2xl font-semibold text-zinc-950'
	const componentMargin = 'mt-10'
	return (
		<div>
			<h2 className={`${titleClassTailwind} ${componentMargin}`}>
				Existing Heating System
			</h2>

			<Form method="post" action="/current">
				<div className={`${componentMargin}`}>
					<Label htmlFor="fuelType">Fuel Type</Label>
					<Input name="fuelType" id="fuelType" type="text" />
				</div>

				<div className="mt-4 flex space-x-4">
					<div>
						<Label htmlFor="heatingSystemEfficiency">
							Heating system efficiency %
						</Label>
						<Input
							name="heatingSystemEfficiency"
							id="heatingSystemEfficiency"
							type="text"
						/>
					</div>

					<div>
						<Label htmlFor="designTemperatureOverride">
							Design temperature override (°F)
						</Label>
						<Input
							name="designTemperatureOverride"
							id="designTemperatureOverride"
							type="text"
						/>
					</div>
				</div>

				<div className="mt-9">
					<h6 className={`${subTitleClassTailwind}`}>Thermostat Settings</h6>

					<div className="mt-4 flex space-x-4">
						<div className="basis-1/3">
							<Label htmlFor="setPoint">Set Point (°F) </Label>
							<Input
								name="setPointTemperature"
								id="setPointTemperature"
								type="text"
							/>
						</div>

						<div className="basis-1/3">
							<Label htmlFor="setPoint">Setback Temperature (°F)</Label>
							<Input
								name="setBackTemperature"
								id="setBackTemperature"
								type="text"
							/>
						</div>

						<div className="basis-1/3">
							<Label htmlFor="setPoint">Setback hours per day</Label>
							<Input name="setBackTime" id="setBackTime" type="text" />
						</div>
					</div>
				</div>
			</Form>

			{/* removed temporarily for single page app format */}
			{/* <div>
				<Button type="submit">Next ={'>'}</Button>
			</div> */}
		</div>
	)
}
