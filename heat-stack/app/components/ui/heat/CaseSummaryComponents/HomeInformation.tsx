import { getInputProps } from '@conform-to/react'
import { useEffect, useMemo, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { Input } from '#/app/components/ui/input.tsx'
import { Label } from '#/app/components/ui/label.tsx'
import { ErrorList } from './ErrorList.tsx'
import { StateDropdown } from './StateDropdown.tsx'


type HomeInformationProps = { fields: any }

export function HomeInformation(props: HomeInformationProps) {
	const titleClass = 'text-4xl font-bold tracking-wide'
	const subtitleClass = 'text-2xl font-semibold text-zinc-950 mt-9'
	const descriptiveClass = 'mt-2 text-sm text-slate-500'
	const componentMargin = 'mt-10'

	// Create a state to track the number value
	const [livingAreaStringDisplayed, setLivingAreaStringDisplayed] = useState(
		() => {
			// Initialize from the field's default value or initial value
			const string =
				props.fields.living_area.value || props.fields.living_area.defaultValue
			return string ? string.replace(/,/g, '') : ''
		},
	)

	// Calculate the decimal value whenever percentage changes
	const livingAreaNumberHidden = useMemo(() => {
		const commaFreeString = livingAreaStringDisplayed.replace(/,/g, '');
		const convertedNumber = Number(commaFreeString);
		return !isNaN(convertedNumber) ? convertedNumber.toString() : ''
	}, [livingAreaStringDisplayed])

	const [streetAddress, setStreetAddress] = useState(
		props.fields.street_address.value || props.fields.street_address.defaultValue
	);
	const [town, setTown] = useState(
		props.fields.town.value || props.fields.town.defaultValue?.town
	  );
	const [usaStateAbbrev, setUsaStateAbbrev] = useState(
		props.fields.state.value || props.fields.state.defaultValue?.state
	);
	const [geoError, setGeoError] = useState<string | null>(null);

	const handleStreetAddressBlur = async () => {
		await validateGeocode()
	}

	const handleTownBlur = async () => {
		await validateGeocode()
	}

	const handleStateBlur = async () => {
		await validateGeocode()
	}

	async function validateGeocode() {
		if (!streetAddress || !town || !usaStateAbbrev) {
			setGeoError(null)
			return
		}

		const address = `${streetAddress}, ${town}, ${usaStateAbbrev}`
		try {
			const res = await fetch(`/geocode?address=${encodeURIComponent(address)}`)
			const data: any = await res.json() 
			if (!data.coordinates) {
				setGeoError( data.message )
			} else {
				setGeoError(null)
			}
		} catch (error) {
			setGeoError("Error connecting to geocoding service" + error)
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

	// Handle the percentage input change
	const handleLivingAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLivingAreaStringDisplayed(e.target.value);
	}

	return (
		<fieldset>
			<legend className={`${titleClass} ${componentMargin}`}>
				Home Information
			</legend>
			<Label className={`${subtitleClass}`} htmlFor="name">
				Resident/Client Name(s)
			</Label>
			{/* <Form method="post" action="/inputs1"> */}

			<div className={`${componentMargin}`}>
				<div className="mt-4 flex space-x-4">
					<div>
						<Input {...getInputProps(props.fields.name, { type: 'text' })} />
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList
								id={props.fields.name.errorId}
								errors={props.fields.name.errors}
							/>
						</div>
					</div>
				</div>
			</div>
			<fieldset>
				<legend className={`${subtitleClass}`}>Address Information</legend>
				<div className="mt-4 flex space-x-4">
					<div className="basis-1/3">
						<Label htmlFor={props.fields.street_address.id}>Street Address</Label>
						<div className="mt-4">
							<Input
								id={props.fields.street_address.id}
								name={props.fields.street_address.name}
								type="text"
								value={streetAddress}
								onChange={(e) => setStreetAddress(e.target.value)}
								onBlur={handleStreetAddressBlur}
								aria-invalid={props.fields.street_address.errors?.length ? true : undefined}
								aria-describedby={props.fields.street_address.errorId}
							/>
							{geoError && (
								<div style={{ color: "red", marginTop: "0.5rem" }}>{geoError}</div>
							)}
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
						<div className="mt-4">
							<Input
								id={props.fields.town.id}
								name={props.fields.town.name}
								type="text"
								value={town}
								onChange={(e) => setTown(e.target.value)}
								onBlur={handleTownBlur}
								aria-invalid={props.fields.town.errors?.length ? true : undefined}
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
						<Label htmlFor="state">
							State
						</Label>
						<div className="mt-4">
							<StateDropdown
								fields={props.fields}
								value={usaStateAbbrev}
								onChange={(val) => { setUsaStateAbbrev(val)}}
								onBlur={handleStateBlur}
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

			<div className="mt-9">
				<Label className={`${subtitleClass}`} htmlFor="living_area">
					Living Area (sf)
				</Label>
				<div className="mt-4">
					<div>
						<NumericFormat
							id="living_area"
							// Don't include a name to prevent it from being submitted
							placeholder="Enter a number 0-10000"
							// type="number"
							value={livingAreaStringDisplayed}
							/* classes as if it was Conform: */
							className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid]:border-input-invalid md:text-sm md:file:text-sm"
							onChange={handleLivingAreaChange}
							thousandSeparator={true} // Add this line to include commas
							valueIsNumericString={true} // Add this line to treat the value as a numeric string
							allowNegative={false} // Ensure negative numbers are not allowed
							decimalScale={0} // Set the decimal scale to 0 to avoid decimal points
							fixedDecimalScale={true} // Ensure the decimal scale is fixed
						/>
						{/* Use the actual field from Conform but with our calculated decimal value */}
						<Input
							type="hidden"
							name={props.fields.living_area.name}
							value={livingAreaNumberHidden}
						/>
						<div className="min-h-[12px] px-4 pb-3 pt-1">
							<ErrorList
								id={props.fields.living_area.errorId}
								errors={props.fields.living_area.errors}
							/>
						</div>
					</div>
					<span className={`${descriptiveClass}`}>
						The home's above-grade, conditioned space
					</span>
				</div>
			</div>

			{/* removed temporarily for single page app format */}
			{/* <div>
				<Button type="submit">Next ={'>'}</Button>
			</div> */}

			{/* </Form> */}
		</fieldset>
	)
}
