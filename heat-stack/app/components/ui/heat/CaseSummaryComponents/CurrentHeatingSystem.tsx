import { Form } from '@remix-run/react'
// removed temporarily for single-page app format
// import { Button } from '#/app/components/ui/button.tsx'
import { Input } from '#/app/components/ui/input.tsx'
import { Label } from '#/app/components/ui/label.tsx'

export function CurrentHeatingSystem() {
	const titleClassTailwind = 'text-5xl font-extrabold tracking-wide'
	const subTitleClassTailwind = 'text-2xl font-semibold text-zinc-950'
	return (
		<div>
			<h2 className={`${titleClassTailwind}`}>Existing Heating System</h2>

			<Form method="post" action="/current">
				<div>
					<Label htmlFor="fuelType">
						<b>Fuel Type</b>
					</Label>
					<Input name="fuelType" id="fuelType" type="text" />
				</div>

				<div>
					<Label htmlFor="heatingSystemEfficiency">
						<b>Heating system efficiency %</b>
					</Label>
					<Input
						name="heatingSystemEfficiency"
						id="heatingSystemEfficiency"
						type="text"
					/>
				</div>

				<div>
					<Label htmlFor="designTemperatureOverride">
						<b>Design temperature override (°F)</b>
					</Label>
					<Input
						name="designTemperatureOverride"
						id="designTemperatureOverride"
						type="text"
					/>
				</div>

				<h6 className={`${subTitleClassTailwind}`}>Thermostat Settings</h6>

				<div className="flex flex-row">
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
			</Form>

			{/* removed temporarily for single page app format */}
			{/* <div>
				<Button type="submit">Next ={'>'}</Button>
			</div> */}
		</div>
	)
}
