import { useForm, getInputProps } from '@conform-to/react'
import { Form } from '@remix-run/react'
import { ErrorList } from './ErrorList.tsx'
import { Button } from '#/app/components/ui/button.tsx'

import { Input } from '#/app/components/ui/input.tsx'
import { Label } from '#/app/components/ui/label.tsx'

type CurrentHeatingSystemProps = { fields: any }

export function CurrentHeatingSystem(props: CurrentHeatingSystemProps) {
	const titleClass = 'text-5xl font-extrabold tracking-wide'
	const descriptiveClass = 'mt-2 text-sm text-slate-500'
	const componentMargin = 'mt-10'
	const subtitleClass = 'text-2xl font-semibold text-zinc-950 mt-9'

	return (
		<div>
			<h2 className={`${titleClass} ${componentMargin}`}>
				Existing Heating System
			</h2>

			{/* <Form method="post" action="/current"> */}
			<div>
				{' '}
				<Label htmlFor="fuelType" className={`${subtitleClass}`}>
					Fuel Type
				</Label>
				<div className="flex space-x-4">
					<div className="basis-1/4">
						<Input {...getInputProps(props.fields.fuelType, { type: "text" })} />
					</div>
				</div>
				<div className="min-h-[32px] px-4 pb-3 pt-1">
					<ErrorList
						id={props.fields.fuelType.errorId}
						errors={props.fields.fuelType.errors}
					/>
				</div>
			</div>

			<Label htmlFor="heatingSystemEfficiency" className={`${subtitleClass}`}>
				Heating system efficiency %
			</Label>
			<div className="flex space-x-4">
				<div className={`basis-1/3`}>
					<Input placeholder="(Percent)" {...getInputProps(props.fields.heatingSystemEfficiency, { type: "text" })} />
					<div className={`${descriptiveClass}`}>
						Typical natural gas efficiency is 80%-95%
					</div>
					<div className="min-h-[32px] px-4 pb-3 pt-1">
						<ErrorList
							id={props.fields.heatingSystemEfficiency.errorId}
							errors={props.fields.heatingSystemEfficiency.errors}
						/>
					</div>
				</div>
			</div>

			<Label htmlFor="designTemperatureOverride" className={`${subtitleClass}`}>
				Design temperature override (°F)
			</Label>
			<div className="flex space-x-4">
				<div className={`basis-1/3`}>
					<Input placeholder="(Optional)" {...getInputProps(props.fields.designTemperatureOverride, { type: "text" })} />
					<div>
						<div className={`${descriptiveClass}`}>
							65°F is the 99% ASHRAE heating design temperature at this location
						</div>
					</div>
					<div className="min-h-[32px] px-4 pb-3 pt-1">
						<ErrorList
							id={props.fields.designTemperatureOverride.errorId}
							errors={props.fields.designTemperatureOverride.errors}
						/>
					</div>
				</div>
			</div>

			<div>
				<h6 className={`${subtitleClass}`}>Thermostat Settings</h6>
				<div className="mt-4 flex space-x-4">
					<div className="basis-1/3">
						<Label htmlFor="thermostatSetPoint">
							<b>Set Point (°F)</b>{' '}
						</Label>
						<Input placeholder="(Fahrenheit)" {...getInputProps(props.fields.thermostatSetPoint, { type: "text" })} />
						<div className={`${descriptiveClass}`}>
							Usual thermostat setting for heating
						</div>
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList
								id={props.fields.thermostatSetPoint.errorId}
								errors={props.fields.thermostatSetPoint.errors}
							/>
						</div>
					</div>
					<div className="basis-1/3">
						<Label htmlFor="setbackTemperature">
							<b>Setback Temperature (°F)</b>
						</Label>
						<Input placeholder="(Optional)" {...getInputProps(props.fields.setbackTemperature, { type: "text" })} />
						<div className={`${descriptiveClass}`}>
							Enter if thermostat is programmed to a lower or higher temperature
							during working or sleep hours
						</div>
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList
								id={props.fields.setbackTemperature.errorId}
								errors={props.fields.setbackTemperature.errors}
							/>
						</div>
					</div>
					<div className="basis-1/3">
						<Label htmlFor="setbackHoursPerDay">
							<b>Setback hours per day</b>
						</Label>
						<Input placeholder="(Optional)" {...getInputProps(props.fields.setbackHoursPerDay, { type: "text" })} />
						<div className={`${descriptiveClass}`}>
							Typical natural gas efficiency is 80%-95%
						</div>
						<div className={`${descriptiveClass}`}>
							Average hours per day that a lower or higher temperature setting
							is in effect
						</div>
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList
								id={props.fields.setbackHoursPerDay.errorId}
								errors={props.fields.setbackHoursPerDay.errors}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* </Form> */}

			{/* removed temporarily for single page app format */}
			{/* <div>
				<Button type="submit">Next ={'>'}</Button>
			</div> */}
		</div>
	)
}
