import { FieldMetadata, useForm, getInputProps } from '@conform-to/react'
import { Button } from '#/app/components/ui/button.tsx'
import { Input } from '#/app/components/ui/input.tsx'
import { Label } from '#/app/components/ui/label.tsx'
import { ErrorList } from "./ErrorList.tsx"

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

type HomeInformationProps = {fields: any};

export function HomeInformation(props: HomeInformationProps) {
	const titleClass = 'text-5xl font-extrabold tracking-wide'
	const subtitleClass = 'text-2xl font-semibold text-zinc-950 mt-9'
	const descriptiveClass = 'mt-2 text-sm text-slate-500'
	const componentMargin = 'mt-10'

	return (
		<fieldset>
			<legend className={`${titleClass} ${componentMargin}`}>Home Information</legend>

			{/* <Form method="post" action="/inputs1"> */}
			<div className={`${componentMargin}`}>
				<Label className={`${subtitleClass}`} htmlFor="name">
					Resident/Client Name(s)
				</Label>
				<div className="mt-4 flex space-x-4">
					<div>
						<Input {...getInputProps(props.fields.name, { type: "text" })} />
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
					Street Address, City, State
				</Label>
				<div className="mt-4 flex space-x-4">
					<div>
						<Input {...getInputProps(props.fields.address, { type: "text" })} />
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
				<Label className={`${subtitleClass}`} htmlFor="living_area">
					Living Area (sf)
				</Label>
				<div className="mt-4 flex space-x-2">
					<div>
						<Input {...getInputProps(props.fields.living_area, { type: "text" })}  />
						<span className={`${descriptiveClass}`}>
							The home's above-grade, conditioned space
						</span>
						<div className="min-h-[12px] px-4 pb-3 pt-1">
							<ErrorList
								id={props.fields.living_area.errorId}
								errors={props.fields.living_area.errors}
							/>
						</div>
					</div>
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
