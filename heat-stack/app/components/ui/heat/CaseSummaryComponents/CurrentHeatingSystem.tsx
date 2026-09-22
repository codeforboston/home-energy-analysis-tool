import { getInputProps } from '@conform-to/react'
import { useEffect, useMemo, useState } from 'react'

import {
	ErrorList,
	Field,
	SectionTitle,
	SubsectionTitle,
} from '#/app/components/forms.tsx'
import { Input } from '#/app/components/ui/input.tsx'
import { Label } from '#/app/components/ui/label.tsx'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '#/app/components/ui/select.tsx'

type CurrentHeatingSystemProps = { fields: any }

export function CurrentHeatingSystem(props: CurrentHeatingSystemProps) {
	// Create a state to track the percentage value
	const [percentageValueDisplayed, setPercentageValueDisplayed] = useState(
		() => {
			const value =
				props.fields.heating_system_efficiency.value ||
				props.fields.heating_system_efficiency.defaultValue
			return value ? Math.round(parseFloat(value) * 100).toString() : ''
		},
	)

	// Calculate the decimal value whenever percentage changes
	const decimalValueHidden = useMemo(() => {
		const percentNum = parseFloat(percentageValueDisplayed)
		return !isNaN(percentNum) ? (percentNum / 100).toString() : ''
	}, [percentageValueDisplayed])

	// Update percentage when the underlying field changes (e.g., from form reset)
	useEffect(() => {
		const value =
			props.fields.heating_system_efficiency.value ||
			props.fields.heating_system_efficiency.defaultValue
		if (value) {
			setPercentageValueDisplayed(
				Math.round(parseFloat(value) * 100).toString(),
			)
		}
	}, [
		props.fields.heating_system_efficiency.value,
		props.fields.heating_system_efficiency.defaultValue,
	])

	// Handle the percentage input change
	const handlePercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPercentageValueDisplayed(e.target.value)
	}

	const [fuelType, setFuelType] = useState('GAS')

	return (
		<fieldset>
			<SectionTitle className="mt-10">Existing Heating System</SectionTitle>

			<div className="mt-10 mt-4">
				<Label htmlFor="fuel_type">Fuel Type</Label>
				<div className="mt-2 flex space-x-4">
					<div className="basis-1/4">
						<Select onValueChange={(val) => setFuelType(val)} value={fuelType}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Fuel Type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="GAS">Natural Gas</SelectItem>
							</SelectContent>
						</Select>

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

			<SubsectionTitle
				as="label"
				htmlFor="heating_system_efficiency_display"
				help={{ keyName: 'heating_system_efficiency.help' }}
			>
				Heating System Efficiency %
			</SubsectionTitle>
			<div className="mt-2 flex space-x-4">
				<div className="basis-1/3">
					{/* Display percentage to the user */}
					<Input
						id="heating_system_efficiency_display"
						// Don't include a name to prevent it from being submitted
						placeholder="Enter a percentage (60-100)"
						type="number"
						value={percentageValueDisplayed}
						onChange={handlePercentageChange}
					/>

					{/* Use the actual field from Conform but with our calculated decimal value */}
					<Input
						type="hidden"
						name={props.fields.heating_system_efficiency.name}
						value={decimalValueHidden}
					/>
					<span className="mt-2 text-sm text-slate-500">
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
				<SubsectionTitle as="legend">Thermostat Settings</SubsectionTitle>
				<div className="mt-4 flex space-x-4">
					<div className="basis-1/3">
						<Field
							labelProps={{ children: 'Set Point (°F)' }}
							inputProps={{
								placeholder: '(Fahrenheit)',
								...getInputProps(props.fields.thermostat_set_point, {
									type: 'text',
								}),
							}}
							errors={props.fields.thermostat_set_point.errors}
							description="Usual thermostat setting for heating"
						/>
					</div>

					<div className="basis-1/3">
						<Field
							labelProps={{ children: 'Setback Temperature (°F)' }}
							inputProps={{
								placeholder: 'Optional',
								...getInputProps(props.fields.setback_temperature, {
									type: 'text',
								}),
							}}
							errors={props.fields.setback_temperature.errors}
							description="Enter if thermostat is programmed to a lower or higher temperature during working or sleep hours"
						/>
					</div>

					<div className="basis-1/3">
						<Field
							labelProps={{ children: 'Setback hours per day' }}
							inputProps={{
								placeholder: 'Optional',
								...getInputProps(props.fields.setback_hours_per_day, {
									type: 'text',
								}),
							}}
							errors={props.fields.setback_hours_per_day.errors}
							description="Average hours per day that a lower or higher temperature setting is in effect"
						/>
					</div>
				</div>
			</fieldset>
		</fieldset>
	)
}
