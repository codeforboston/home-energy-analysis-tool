import { useForm, getInputProps, useInputControl } from '@conform-to/react'
import { useEffect, useMemo, useState, useRef } from 'react'
import { Button } from '#/app/components/ui/button.tsx'

import { Input } from '#/app/components/ui/input.tsx'
import { Label } from '#/app/components/ui/label.tsx'
import { ErrorList } from './ErrorList.tsx'

type CurrentHeatingSystemProps = { fields: any }

export function CurrentHeatingSystem(props: CurrentHeatingSystemProps) {
	const titleClass = 'text-4xl font-bold tracking-wide'
	const descriptiveClass = 'mt-2 text-sm text-slate-500'
	const componentMargin = 'mt-10'
	const subtitleClass = 'text-2xl font-semibold text-zinc-950 mt-9'

	// Create a state to track the percentage value
	const [percentageValue, setPercentageValue] = useState(() => {
		// Initialize from the field's default value or initial value
		const value =
			props.fields.heating_system_efficiency.value ||
			props.fields.heating_system_efficiency.defaultValue
		return value ? Math.round(parseFloat(value) * 100).toString() : ''
	})

	// Calculate the decimal value whenever percentage changes
	const decimalValue = useMemo(() => {
		const percentNum = parseFloat(percentageValue)
		return !isNaN(percentNum) ? (percentNum / 100).toString() : ''
	}, [percentageValue])

	// Update percentage when the underlying field changes (e.g., from form reset)
	useEffect(() => {
		const value =
			props.fields.heating_system_efficiency.value ||
			props.fields.heating_system_efficiency.defaultValue
		if (value) {
			setPercentageValue(Math.round(parseFloat(value) * 100).toString())
		}
	}, [
		props.fields.heating_system_efficiency.value,
		props.fields.heating_system_efficiency.defaultValue,
	])

	// Handle the percentage input change
	const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPercentageValue(e.target.value)
	}

	const [fuelType, setFuelType] = useState('')

	useEffect(() => {
		// Set the initial value of the form field
		setFuelType('GAS')
	}, []) // Empty dependency array ensures this runs only once at mount

	return (
		<fieldset>
			<legend className={`${titleClass} ${componentMargin}`}>
				Existing Heating System
			</legend>

			{/* <Form method="post" action="/current"> */}
			<div className={`${componentMargin}`}>
				<Label htmlFor="fuel_type" className={`${subtitleClass}`}>
					Fuel Type
				</Label>
				<div className="mt-4 flex space-x-4">
					<div className="basis-1/4">
						{/* Disabled fields don't submit. */}
						<Input
							aria-disabled={true}
							disabled={true}
							onChange={(e) => setFuelType(e.target.value)}
							{...getInputProps(props.fields.fuel_type, { type: 'text' })}
						/>
						{/* This hidden field submits the same value instead. */}
						<Input type="hidden" name="fuel_type" value={fuelType} />
					</div>
				</div>
				<div className="min-h-[32px] px-4 pb-3 pt-1">
					<ErrorList
						id={props.fields.fuel_type.errorId}
						errors={props.fields.fuel_type.errors}
					/>
				</div>
			</div>

			<Label
				htmlFor="heating_system_efficiency_display"
				className={`${subtitleClass}`}
			>
				Heating System Efficiency %
			</Label>
			<div className="mt-4 flex space-x-4">
				<div className={`basis-1/3`}>
					{/* Display percentage to the user */}
					<Input
						id="heating_system_efficiency_display"
						// Don't include a name to prevent it from being submitted
						placeholder="Enter a percentage (60-100)"
						type="number"
						value={percentageValue}
						onChange={handlePercentageChange}
					/>
					{/* Use the actual field from Conform but with our calculated decimal value */}
					<Input
						type="hidden"
						name={props.fields.heating_system_efficiency.name}
						value={decimalValue}
					/>
					<span className={`${descriptiveClass}`}>
						Enter efficiency as a percentage (60-100). Typical natural gas
						efficiency is 80-95%.
					</span>
					<div className="min-h-[32px] px-4 pb-3 pt-1">
						<ErrorList
							id={props.fields.heating_system_efficiency.errorId}
							errors={props.fields.heating_system_efficiency.errors}
						/>
					</div>
				</div>
			</div>

			<fieldset>
				<legend className={`${subtitleClass}`}>Thermostat Settings</legend>
				<div className="mt-4 flex space-x-4">
					<div className="basis-1/3">
						<Label htmlFor="thermostat_set_point" className="font-bold">
							Set Point (°F)
						</Label>
						<Input
							placeholder="(Fahrenheit)"
							{...getInputProps(props.fields.thermostat_set_point, {
								type: 'text',
							})}
						/>
						<span className={`${descriptiveClass}`}>
							Usual thermostat setting for heating
						</span>
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList
								id={props.fields.thermostat_set_point.errorId}
								errors={props.fields.thermostat_set_point.errors}
							/>
						</div>
					</div>

					<div className="basis-1/3">
						<Label className="font-bold" htmlFor="setback_temperature">
							Setback Temperature (°F)
						</Label>
						<Input
							placeholder="Optional"
							{...getInputProps(props.fields.setback_temperature, {
								type: 'text',
							})}
						/>
						<span className={`${descriptiveClass}`}>
							Enter if thermostat is programmed to a lower or higher temperature
							during working or sleep hours
						</span>
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList
								id={props.fields.setback_temperature.errorId}
								errors={props.fields.setback_temperature.errors}
							/>
						</div>
					</div>

					<div className="basis-1/3">
						<Label className="font-bold" htmlFor="setback_hours_per_day">
							Setback hours per day
						</Label>
						<Input
							placeholder="Optional"
							{...getInputProps(props.fields.setback_hours_per_day, {
								type: 'text',
							})}
						/>
						<span className={`${descriptiveClass}`}>
							Average hours per day that a lower or higher temperature setting
							is in effect
						</span>
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList
								id={props.fields.setback_hours_per_day.errorId}
								errors={props.fields.setback_hours_per_day.errors}
							/>
						</div>
					</div>
				</div>
			</fieldset>

			{/* </Form> */}

			{/* removed temporarily for single page app format */}
			{/* <div>
				<Button type="submit">Next ={'>'}</Button>
			</div> */}
		</fieldset>
	)
}
