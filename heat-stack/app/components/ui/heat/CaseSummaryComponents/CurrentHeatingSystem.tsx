import { useForm, getInputProps } from '@conform-to/react'
import { Button } from '#/app/components/ui/button.tsx'

import { Input } from '#/app/components/ui/input.tsx'
import { Label } from '#/app/components/ui/label.tsx'
import { ErrorList } from './ErrorList.tsx'

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
				<Label htmlFor="fuel_type" className={`${subtitleClass}`}>
					Fuel Type
				</Label>
				<div className="flex space-x-4">
					<div className="basis-1/4">
						<Input {...getInputProps(props.fields.fuel_type, { type: "text" })} />
					</div>
				</div>
				<div className="min-h-[32px] px-4 pb-3 pt-1">
					<ErrorList
						id={props.fields.fuel_type.errorId}
						errors={props.fields.fuel_type.errors}
					/>
				</div>
			</div>

			<Label htmlFor="heating_system_efficiency" className={`${subtitleClass}`}>
				Heating System Efficiency %
			</Label>
			<div className="flex space-x-4">
				<div className={`basis-1/3`}>
					<Input placeholder="(Percent)" {...getInputProps(props.fields.heating_system_efficiency, { type: "text" })} />
					<div className={`${descriptiveClass}`}>
						Typical natural gas efficiency is 80%-95%
					</div>
					<div className="min-h-[32px] px-4 pb-3 pt-1">
						<ErrorList
							id={props.fields.heating_system_efficiency.errorId}
							errors={props.fields.heating_system_efficiency.errors}
						/>
					</div>
				</div>
			</div>

			<Label htmlFor="design_temperature_override" className={`${subtitleClass}`}>
				Design Temperature Override (°F)
			</Label>
			<div className="flex space-x-4">
				<div className={`basis-1/3`}>
					<Input placeholder="(Optional)" {...getInputProps(props.fields.design_temperature_override, { type: "text" })} />
					<div>
						<div className={`${descriptiveClass}`}>
							65°F is the 99% ASHRAE heating design temperature at this location
						</div>
					</div>
					<div className="min-h-[32px] px-4 pb-3 pt-1">
						<ErrorList
							id={props.fields.design_temperature_override.errorId}
							errors={props.fields.design_temperature_override.errors}
						/>
					</div>
				</div>
			</div>

			<div>
				<h6 className={`${subtitleClass}`}>Thermostat Settings</h6>
				<div className="mt-4 flex space-x-4">
					<div className="basis-1/3">
						<Label htmlFor="thermostat_set_point">
							<b>Set Point (°F)</b>{' '}
						</Label>
						<Input placeholder="(Fahrenheit)" {...getInputProps(props.fields.thermostat_set_point, { type: "text" })} />
						<div className={`${descriptiveClass}`}>
							Usual thermostat setting for heating
						</div>
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList
								id={props.fields.thermostat_set_point.errorId}
								errors={props.fields.thermostat_set_point.errors}
							/>
						</div>
					</div>
					<div className="basis-1/3">
						<Label htmlFor="setback_temperature">
							<b>Setback Temperature (°F)</b>
						</Label>
						<Input placeholder="(Optional)" {...getInputProps(props.fields.setback_temperature, { type: "text" })} />
						<div className={`${descriptiveClass}`}>
							Enter if thermostat is programmed to a lower or higher temperature
							during working or sleep hours
						</div>
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList
								id={props.fields.setback_temperature.errorId}
								errors={props.fields.setback_temperature.errors}
							/>
						</div>
					</div>
					<div className="basis-1/3">
						<Label htmlFor="setback_hours_per_day">
							<b>Setback hours per day</b>
						</Label>
						<Input placeholder="(Optional)" {...getInputProps(props.fields.setback_hours_per_day, { type: "text" })} />
						<div className={`${descriptiveClass}`}>
							Typical natural gas efficiency is 80%-95%
						</div>
						<div className={`${descriptiveClass}`}>
							Average hours per day that a lower or higher temperature setting
							is in effect
						</div>
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList
								id={props.fields.setback_hours_per_day.errorId}
								errors={props.fields.setback_hours_per_day.errors}
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
