import { getInputProps } from '@conform-to/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { Link } from 'react-router'
import {
	ErrorList,
	Field,
	SectionTitle,
	SubsectionTitle,
} from '#/app/components/forms.tsx'
import { Input } from '#/app/components/ui/input.tsx'
import { Label } from '#/app/components/ui/label.tsx'
import { executeLookupDesignTempToDisplay } from '#app/utils/rules-engine.ts'
import { HelpButton } from '../../HelpButton.tsx'
import { StateDropdown } from './StateDropdown.tsx'

type HomeInformationProps = { fields: any }

function roundTo(n: number, decimals = 0) {
	const factor = 10 ** decimals
	return Math.round(n * factor) / factor
}

export function HomeInformation(props: HomeInformationProps) {
	const [livingAreaStringDisplayed, setLivingAreaStringDisplayed] = useState(
		() => {
			const string =
				props.fields.living_area.value || props.fields.living_area.defaultValue
			return string ? string.replace(/,/g, '') : ''
		},
	)

	const livingAreaNumberHidden = useMemo(() => {
		const commaFreeString = livingAreaStringDisplayed.replace(/,/g, '')
		const convertedNumber = Number(commaFreeString)
		return !isNaN(convertedNumber) ? convertedNumber.toString() : ''
	}, [livingAreaStringDisplayed])

	const [streetAddress, setStreetAddress] = useState(
		props.fields.street_address.value ||
			props.fields.street_address.defaultValue,
	)
	const [town, setTown] = useState(
		props.fields.town.value || props.fields.town.defaultValue?.town,
	)
	const [usaStateAbbrev, setUsaStateAbbrev] = useState(
		props.fields.state.value || props.fields.state.defaultValue?.state,
	)
	const [geoError, setGeoError] = useState<string | null>(null)
	const [geoCoordinates, setGeoCoordinates] = useState<{
		x: number
		y: number
	} | null>(null)
	const [calcedDesignTemp, setCalcedDesignTemp] = useState<
		[number, number] | null
	>(null) // add this
	const lastRequestedAddressRef = useRef<string | null>(null)

	useEffect(() => {
		if (!geoCoordinates) return
		executeLookupDesignTempToDisplay(geoCoordinates).then((result: any) => {
			setCalcedDesignTemp(result)
		})
	}, [geoCoordinates])

	// Geocode automatically as the user types (debounced), instead of waiting
	// for the address fields to lose focus.
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			void validateGeocode()
		}, 600)
		return () => clearTimeout(timeoutId)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [streetAddress, town, usaStateAbbrev])

	async function validateGeocode() {
		console.log('validateGeocode fired', {
			streetAddress,
			town,
			usaStateAbbrev,
		})
		if (!streetAddress || !town || !usaStateAbbrev) {
			console.log('bailed — a field is empty')
			setGeoError(null)
			return
		}
		const address = `${streetAddress}, ${town}, ${usaStateAbbrev}`
		if (address === lastRequestedAddressRef.current) {
			// Already requested (or in flight) for this exact address — the
			// onBlur trigger and the debounced onChange trigger can both fire
			// for the same final address; skip the duplicate expensive lookup.
			return
		}
		lastRequestedAddressRef.current = address
		try {
			const res = await fetch(`/geocode?address=${encodeURIComponent(address)}`)
			const data: any = await res.json()
			if (!data.coordinates && !data.state_id && !data.county_id) {
				setGeoError(data.message)
			} else {
				console.log('geo', data)
				setGeoError(null)
				setGeoCoordinates(data.coordinates)
				setCalcedDesignTemp(null)
			}
		} catch (error) {
			lastRequestedAddressRef.current = null
			setGeoError('Error connecting to geocoding service' + error)
		}
	}

	// Update percentage when the underlying field changes (e.g., from form reset)
	useEffect(() => {
		const value =
			props.fields.living_area.value || props.fields.living_area.defaultValue
		if (value) {
			setLivingAreaStringDisplayed(Math.round(parseFloat(value)).toString())
		}
	}, [props.fields.living_area.value, props.fields.living_area.defaultValue])

	const handleLivingAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLivingAreaStringDisplayed(e.target.value)
	}

	return (
		<fieldset>
			<div className="my-4 mt-10 flex items-center justify-between">
				<SectionTitle>Home Information</SectionTitle>

				<Link
					to="/cases/new?dev=true"
					reloadDocument
					className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white transition-all hover:bg-emerald-700"
					data-testid="get-started-demo-data"
				>
					Autofill With Demo Data
				</Link>
			</div>

			<div className="mt-10 mt-2">
				<Field
					labelProps={{ children: 'Resident/Client Name(s)' }}
					inputProps={getInputProps(props.fields.name, { type: 'text' })}
					errors={props.fields.name.errors}
				/>
			</div>

			<fieldset>
				<SubsectionTitle as="legend">Address Information</SubsectionTitle>
				<div className="mt-4 flex space-x-4">
					<div className="basis-1/3">
						<Label htmlFor={props.fields.street_address.id}>
							Street Address
						</Label>
						<div className="mt-2">
							<Input
								id={props.fields.street_address.id}
								name={props.fields.street_address.name}
								type="text"
								value={streetAddress}
								onChange={(e) => setStreetAddress(e.target.value)}
								onBlur={() => validateGeocode()}
								aria-invalid={
									props.fields.street_address.errors?.length ? true : undefined
								}
								aria-describedby={props.fields.street_address.errorId}
							/>
							{geoError && <div className="mt-2 text-red-600">{geoError}</div>}
							<div className="min-h-[32px] px-4 pb-3 pt-1">
								<ErrorList
									id={props.fields.street_address.errorId}
									errors={props.fields.street_address.errors}
								/>
							</div>
						</div>
					</div>

					<div className="basis-1/3">
						<Label htmlFor={props.fields.town.id}>City/Town</Label>
						<div className="mt-2">
							<Input
								id={props.fields.town.id}
								name={props.fields.town.name}
								type="text"
								value={town}
								onChange={(e) => setTown(e.target.value)}
								onBlur={() => validateGeocode()}
								aria-invalid={
									props.fields.town.errors?.length ? true : undefined
								}
								aria-describedby={props.fields.town.errorId}
							/>
							<div className="min-h-[32px] px-4 pb-3 pt-1">
								<ErrorList
									id={props.fields.town.errorId}
									errors={props.fields.town.errors}
								/>
							</div>
						</div>
					</div>

					<div className="basis-1/3">
						<Label htmlFor="state">State</Label>
						<div className="mt-2">
							<StateDropdown
								fields={props.fields}
								value={usaStateAbbrev}
								onChange={(val) => setUsaStateAbbrev(val)}
								onBlur={() => validateGeocode()}
							/>
							<div className="min-h-[32px] px-4 pb-3 pt-1">
								<ErrorList
									id={props.fields.state.errorId}
									errors={props.fields.state.errors}
								/>
							</div>
						</div>
					</div>
				</div>
			</fieldset>
			<fieldset>
				<SubsectionTitle as="legend">Heating Design Temperature</SubsectionTitle>

				<div className="mt-4 flex space-x-4">
					<div className="basis-1/2">
						<div className="flex items-center gap-2">
							<Label>Calculated Design Temperature (℉)</Label>
							<HelpButton keyName="calculated_design_temperature.help" />
						</div>
						<div className="item mt-2 flex h-10 items-center font-bold">
							{geoCoordinates === null ? (
								<>Enter address above</>
							) : calcedDesignTemp === null ? (
								<>Calculating...</>
							) : (
								<>{JSON.stringify(roundTo(calcedDesignTemp[0], 2))} °F</>
							)}
						</div>

						<div className="mt-4 mt-2 text-sm text-slate-500">
							This value is calculated from the address and will be used unless
							an override value is entered.
						</div>
					</div>

					<div className="basis-1/2">
						<Field
							labelProps={{ children: 'Design Temperature Override (℉)' }}
							inputProps={getInputProps(props.fields.design_temperature_override, {
								type: 'number',
							})}
							errors={props.fields.design_temperature_override.errors}
							help={{ keyName: 'design_temperature_override.help' }}
							description="Leave blank or enter a value in the range -10 to 32"
						/>
					</div>
				</div>
			</fieldset>
			<div className="mt-1">
				<SubsectionTitle
					as="label"
					htmlFor="living_area"
					help={{ keyName: 'living_area.help' }}
				>
					Living Area (sf)
				</SubsectionTitle>
				<NumericFormat
					id="living_area"
					placeholder="Enter a number 0-10000"
					value={livingAreaStringDisplayed}
					className="mt-2 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid]:border-input-invalid md:text-sm md:file:text-sm"
					onChange={handleLivingAreaChange}
					thousandSeparator={true}
					valueIsNumericString={true}
					allowNegative={false}
					decimalScale={0}
					fixedDecimalScale={true}
				/>

				<Input
					type="hidden"
					name={props.fields.living_area.name}
					value={livingAreaNumberHidden}
				/>

				<div className="min-h-[12px] px-4 pb-2">
					<ErrorList
						id={props.fields.living_area.errorId}
						errors={props.fields.living_area.errors}
					/>
				</div>

				<span className="mt-2 text-sm text-slate-500">
					<span className="my-8">The home's above-grade, conditioned space</span>
				</span>
			</div>
		</fieldset>
	)
}
