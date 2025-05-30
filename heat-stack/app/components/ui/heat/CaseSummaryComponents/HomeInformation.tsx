import { FieldMetadata, useForm, getInputProps } from '@conform-to/react'
import { useEffect, useMemo, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { Button } from '#/app/components/ui/button.tsx'
import { Input } from '#/app/components/ui/input.tsx'
import { Label } from '#/app/components/ui/label.tsx'
import { ErrorList } from './ErrorList.tsx'

// /** THE BELOW PROBABLY NEED TO MOVE TO A ROUTE RATHER THAN A COMPONENT, including action function, */
// // import { redirect } from '@remix-run/react'
// import { json, ActionFunctionArgs } from '@remix-run/node'
// import { invariantResponse } from '@epic-web/invariant'
// import { parseWithZod } from '@conform-to/zod'
// import { z } from 'zod'

// const nameMaxLength = 1
// const addressMaxLength = 1

// /** Modeled off the conform example at
//  *     https://github.com/epicweb-dev/web-forms/blob/b69e441f5577b91e7df116eba415d4714daacb9d/exercises/03.schema-validation/03.solution.conform-form/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L48 */
// const HomeInformationSchema = z.object({
// 	name: z.string().max(nameMaxLength),
// 	address: z.string().max(addressMaxLength),
// 	livingSpace: z.number().min(1),
// })

// export async function action({ request, params }: ActionFunctionArgs) {
// 	invariantResponse(params.homeId, 'homeId param is required')

// 	const formData = await request.formData()
// 	const submission = parseWithZod(formData, {
// 		schema: HomeInformationSchema,
// 	})

// 	if (!submission.value) {
// 		return json({ status: 'error', submission } as const, {
// 			status: 400,
// 		})
// 	}
// 	const { name, address, livingSpace } = submission.value

// 	// await updateNote({ id: params.noteId, title, content })

// 	// return redirect(`/inputs1`)
// }

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
		const convertedNumber = Number(livingAreaStringDisplayed)
		return !isNaN(convertedNumber) ? convertedNumber.toString() : ''
	}, [livingAreaStringDisplayed])

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
		setLivingAreaStringDisplayed(e.target.value)
	}

	return (
		<fieldset>
			<legend className={`${titleClass} ${componentMargin}`}>
				Home Information
			</legend>

			{/* <Form method="post" action="/inputs1"> */}
			<div className={`${componentMargin}`}>
				<Label className={`${subtitleClass}`} htmlFor="name">
					Resident/Client Name(s)
				</Label>
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

			<div className="mt-9">
				<Label className={`${subtitleClass}`} htmlFor="address">
					Street Address
				</Label>
				<div className="mt-4 flex space-x-4">
					<div>
						<Input {...getInputProps(props.fields.address, { type: 'text' })} />
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList
								id={props.fields.address.errorId}
								errors={props.fields.address.errors}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-9">
				<Label className={`${subtitleClass}`} htmlFor="town">
					Town
				</Label>
				<div className="mt-4 flex space-x-4">
					<div>
						<Input {...getInputProps(props.fields.town, { type: 'text' })} />
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList
								id={props.fields.town.errorId}
								errors={props.fields.town.errors}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* TODO: Add dropdown of state abbreviation suggestions */}
			<div className="mt-9">
				<Label className={`${subtitleClass}`} htmlFor="state">
					State (Abbreviation)
				</Label>
				<div className="mt-4 flex space-x-4">
					<div>
						<Input {...getInputProps(props.fields.state, { type: 'text' })} />
						<div className="min-h-[32px] px-4 pb-3 pt-1">
							<ErrorList
								id={props.fields.state.errorId}
								errors={props.fields.state.errors}
							/>
						</div>
					</div>
				</div>
			</div>

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
