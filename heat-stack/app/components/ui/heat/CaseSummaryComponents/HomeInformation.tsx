import { getInputProps } from '@conform-to/react'
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

export function HomeInformation({ fields }: HomeInformationProps) {
	const labelClass = 'w-40 text-base font-medium text-gray-800'
	const rowClass = 'flex items-center space-x-4'
	const fieldGroupClass = 'space-y-1'
	const inputClass = 'placeholder-italic'

	return (
		<fieldset className="space-y-8">
			<legend className="text-4xl font-bold tracking-wide mt-10">
				Home Information
			</legend>

			{/* Client Name */}
			<div className={fieldGroupClass}>
				<div className={rowClass}>
					<Label htmlFor="name" className={labelClass}>
						Resident or Client Name(s)
					</Label>
					<Input
						{...getInputProps(fields.name, { type: 'text' })}
						placeholder="e.g., Jane Doe"
						className={`w-64 ${inputClass}`}
					/>
				</div>
				<ErrorList id={fields.name.errorId} errors={fields.name.errors} />
			</div>

			{/* Address */}
			<div className={fieldGroupClass}>
				<div className={rowClass}>
					<Label htmlFor="address" className={labelClass}>
						Street Address, City, State
					</Label>
					<Input
						{...getInputProps(fields.address, { type: 'text' })}
						placeholder="e.g., 123 Main St, Anytown, MA 01234"
						className={`w-[28rem] ${inputClass}`}
					/>
				</div>
				<ErrorList id={fields.address.errorId} errors={fields.address.errors} />
			</div>

			{/* Living Area */}
			<div className={fieldGroupClass}>
				<div className={rowClass}>
					<Label htmlFor="living_area" className={labelClass}>
						Living Area
					</Label>
					<Input
						{...getInputProps(fields.living_area, { type: 'number' })}
						placeholder="e.g., 1800"
						className={`w-32 ${inputClass}`}
						inputMode="numeric"
					/>
				</div>
				<ErrorList
					id={fields.living_area.errorId}
					errors={fields.living_area.errors}
				/>
			</div>
		</fieldset>
	)
}
