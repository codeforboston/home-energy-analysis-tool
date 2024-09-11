

// Archived 03/19/2024


import { useForm } from '@conform-to/react'

/** THE BELOW PROBABLY NEED TO MOVE TO A ROUTE RATHER THAN A COMPONENT, including action function, */
// import { redirect } from '@remix-run/react'
import { parseWithZod } from '@conform-to/zod'
import { type ActionFunctionArgs } from '@remix-run/node'
import { Form, redirect, useActionData } from '@remix-run/react'
import { z } from 'zod'
import { ErrorList } from '#app/components/ui/heat/CaseSummaryComponents/ErrorList.tsx'
import { HomeInformation } from '../../components/ui/heat/CaseSummaryComponents/HomeInformation.tsx'

const nameMaxLength = 50
const addressMaxLength = 100

/** Modeled off the conform example at
 *     https://github.com/epicweb-dev/web-forms/blob/b69e441f5577b91e7df116eba415d4714daacb9d/exercises/03.schema-validation/03.solution.conform-form/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L48 */
const HomeInformationSchema = z.object({
	name: z.string().min(1).max(nameMaxLength),
	address: z.string().min(1).max(addressMaxLength),
	living_area: z.number().min(1),
})

export async function action({ request, params }: ActionFunctionArgs) {
	// Checks if url has a homeId parameter, throws 400 if not there
	// invariantResponse(params.homeId, 'homeId param is required')

	const formData = await request.formData()
	const submission = parseWithZod(formData, {
		schema: HomeInformationSchema,
	})

	if(submission.status !== "success") {
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
	// - [ ] Save to cookie and redirect to next form
	// - [ ] Build form #2 and #3
	// - [ ] Form errors (if we think of a use case - 2 fields conflicting...)

	const { name, address, living_area } = submission.value

	// await updateNote({ id: params.noteId, title, content })

	return redirect(`/inputs1`)
}

export default function Inputs1() {
	const lastResult = useActionData<typeof action>()
	const [form, fields] = useForm({
		lastResult,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: HomeInformationSchema })
		},
		defaultValue: {
			
		},
		shouldValidate: 'onBlur',
	})

	return (
		
		<Form id={form.id} method="post" onSubmit={form.onSubmit} action="/inputs1">
			<HomeInformation fields={fields} />
			<ErrorList id={form.errorId} errors={form.errors} />
		</Form>
	)
}
