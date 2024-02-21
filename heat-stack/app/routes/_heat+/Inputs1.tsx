import { HomeInformation } from '../../components/ui/heat/CaseSummaryComponents/HomeInformation.tsx'
import { Form } from '@remix-run/react'

/** THE BELOW PROBABLY NEED TO MOVE TO A ROUTE RATHER THAN A COMPONENT, including action function, */
// import { redirect } from '@remix-run/react'
import { json, ActionFunctionArgs } from '@remix-run/node'
import { invariantResponse } from '@epic-web/invariant'
import { parseWithZod } from '@conform-to/zod'
import { z } from 'zod'

const nameMaxLength = 1
const addressMaxLength = 1

/** Modeled off the conform example at
 *     https://github.com/epicweb-dev/web-forms/blob/b69e441f5577b91e7df116eba415d4714daacb9d/exercises/03.schema-validation/03.solution.conform-form/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L48 */
const HomeInformationSchema = z.object({
	name: z.string().min(1).max(nameMaxLength),
	address: z.string().min(1).max(addressMaxLength),
	livingSpace: z.number().min(1),
})

export async function action({ request, params }: ActionFunctionArgs) {
	// invariantResponse(params.homeId, 'homeId param is required')

	const formData = await request.formData()
	const submission = parseWithZod(formData, {
		schema: HomeInformationSchema,
	})

	if(submission.status !== "success") {
		return json(
			submission.reply(), {status: submission.status === "error" ? 400 : 200}
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
		);
	}

	// TODO NEXT WEEK
	// Add error components that will show the validation errors. See
	// https://github.com/epicweb-dev/web-forms/blob/main/exercises/03.schema-validation/03.solution.conform-form/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx
	// ErrorList, useForm, etc
	// Once we get it working, break out into 2 teams, each working on the other 2 parts of the form

	const { name, address, livingSpace } = submission.value

	// await updateNote({ id: params.noteId, title, content })

	return redirect(`/inputs1`)
}

export default function Inputs1() {
	return (
		
		<Form method="post" action="/inputs1">
			<HomeInformation />
		</Form>
	)
}
