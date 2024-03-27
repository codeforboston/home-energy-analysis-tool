/** THE BELOW PROBABLY NEEDS TO MOVE TO A ROUTE RATHER THAN A COMPONENT, including action function, */
// import { redirect } from '@remix-run/react'
import { useForm } from '@conform-to/react'
import { parseWithZod } from '@conform-to/zod'
import { invariantResponse } from '@epic-web/invariant'
import { json, ActionFunctionArgs } from '@remix-run/node'
import { Form, redirect, useActionData } from '@remix-run/react'
import { z } from 'zod'

// Ours
import { ErrorList } from '#app/components/ui/heat/CaseSummaryComponents/ErrorList.tsx'
import { Home, Location, Case } from '../../../types/index.ts'
import { CurrentHeatingSystem } from '../../components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx'
import { EnergyUseHistory } from '../../components/ui/heat/CaseSummaryComponents/EnergyUseHistory.tsx'
import { HomeInformation } from '../../components/ui/heat/CaseSummaryComponents/HomeInformation.tsx'
import HeatLoadAnalysis from './heatloadanalysis.tsx'
import { Button } from '#/app/components/ui/button.tsx'

const nameMaxLength = 50
const addressMaxLength = 100

/** Modeled off the conform example at
 *     https://github.com/epicweb-dev/web-forms/blob/b69e441f5577b91e7df116eba415d4714daacb9d/exercises/03.schema-validation/03.solution.conform-form/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L48 */

// const HomeInformationSchema = {
// 	name: z.string().min(1).max(nameMaxLength),
// 	address: z.string().min(1).max(addressMaxLength),
// 	livingSpace: z.number().min(1),
// }
// // type Home = z.infer<typeof HomeSchema>

// // TODO Next: Ask an LLM how we get fuelType out of HomeSchema from zod

const HomeFormSchema = Home.pick({ livingArea: true })
	.and(Location.pick({ address: true }))
	.and(Case.pick({ name: true }))

const CurrentHeatingSystemSchema = Home.pick({
	fuelType: true,
	heatingSystemEfficiency: true,
	thermostatSetPoint: true,
	setbackTemperature: true,
	setbackHoursPerDay: true,
	designTemperatureOverride: true,
})

const Schema = HomeFormSchema.and(CurrentHeatingSystemSchema)

// const EnergyUseSchema = '';

export async function action({ request, params }: ActionFunctionArgs) {
	// Checks if url has a homeId parameter, throws 400 if not there
	// invariantResponse(params.homeId, 'homeId param is required')

	const formData = await request.formData()
	const submission = parseWithZod(formData, {
		schema: Schema,
	})

	if (submission.status !== 'success') {
		return submission.reply()
		// submission.reply({
		// 	// You can also pass additional error to the `reply` method
		// 	formErrors: ['Submission failed'],
		// 	fieldErrors: {
		// 		address: ['Address is invalid'],
		// 	},

		// 	// or avoid sending the the field value back to client by specifying the field names
		// 	hideFields: ['password'],
		// }),
		// {status: submission.status === "error" ? 400 : 200}
	}

	// TODO NEXT WEEK
	// - [x] Server side error checking/handling
	// - [x] ~Save to cookie and redirect to next form~ Put everything on the same page
	// - [ ] - Get zod and Typescript to play nice
	// - [ ] (We're here) Build form #2
	// - [ ] Build form #3
	// - [ ] Form errors (if we think of a use case - 2 fields conflicting...)

	const { name, address, livingArea, fuelType,
		heatingSystemEfficiency,
		thermostatSetPoint,
		setbackTemperature,
		setbackHoursPerDay,
		designTemperatureOverride } = submission.value

	// await updateNote({ id: params.noteId, title, content })

	return redirect(`/inputs1`)
}

export default function Inputs() {
	const lastResult = useActionData<typeof action>()
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: Schema })
		},
		defaultValue: {},
		shouldValidate: 'onBlur',
	})

	return (
		<>
			<Form
				id={form.id}
				method="post"
				onSubmit={form.onSubmit}
				action="/single"
			>
				<HomeInformation fields={fields} />
				<CurrentHeatingSystem fields={fields} />
				<EnergyUseHistory />
				<ErrorList id={form.errorId} errors={form.errors} />
				<Button type="submit">Submit</Button>
			</Form>
			<HeatLoadAnalysis />
		</>
	)
}
