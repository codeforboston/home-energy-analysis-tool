import { Form } from '@remix-run/react'
import { Button } from '#/app/components/ui/button.tsx'
import { Input } from '#/app/components/ui/input.tsx'
import { Label } from '#/app/components/ui/label.tsx'

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
	name: z.string().max(nameMaxLength),
	address: z.string().max(addressMaxLength),
	livingSpace: z.number().min(1),
})

export async function action({ request, params }: ActionFunctionArgs) {
	invariantResponse(params.homeId, 'homeId param is required')

	const formData = await request.formData()
	const submission = parseWithZod(formData, {
		schema: HomeInformationSchema,
	})

	if (!submission.value) {
		return json({ status: 'error', submission } as const, {
			status: 400,
		})
	}
	const { name, address, livingSpace } = submission.value

	// await updateNote({ id: params.noteId, title, content })

	// return redirect(`/inputs1`)
}

export function HomeInformation() {
	const titleClass = 'text-5xl font-extrabold tracking-wide'
	const subtitleClass = 'text-2xl font-semibold text-zinc-950 mt-9'
	const descriptiveClass = 'mt-2 text-sm text-slate-500'
	const componentMargin = 'mt-10'
	return (
		<div>
			<h2 className={`${titleClass}`}>Home Information</h2>

			<Form method="post" action="/inputs1">
				<div className={`${componentMargin}`}>
					<h6 className={`${subtitleClass}`}>Resident/Client</h6>

					<div className="mt-4 flex space-x-4">
						<div>
							<Label htmlFor="firstName">First Name</Label>
							<Input name="firstName" id="firstName" type="text" />
						</div>
						<div>
							<Label htmlFor="lastName">Last Name</Label>
							<Input name="lastName" id="lastName" type="text" />
						</div>
					</div>
				</div>

				<div className="mt-9">
					<h6 className={`${subtitleClass}`}>Address</h6>

					<div className="mt-4 flex space-x-4">
						<div>
							<Label htmlFor="address">Street address</Label>
							<Input name="address" id="address" type="text" />
							<Input name="addressTwo" id="adressTwo" type="text" />

							<div className="mt-4 flex space-x-4">
								<div>
									<Label htmlFor="city">City/Town</Label>
									<Input name="city" id="city" type="text" />
								</div>
								<div>
									<Label htmlFor="state">State</Label>
									<Input name="state" id="state" type="text" />
								</div>
								<div>
									<Label htmlFor="zipcode">Zipcode</Label>
									<Input name="zipcode" id="zipcode" type="text" />
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-9">
					<h6>
						<Label className={`${subtitleClass}`} htmlFor="livingArea">
							Living Area (sf)
						</Label>
					</h6>

					<div className="mt-4 flex space-x-2">
						<div>
							<Input name="livingArea" id="livingArea" type="number" />
							<p className={`${descriptiveClass}`}>
								The home's above-grade, conditioned space
							</p>
						</div>
					</div>
				</div>

				{/* removed temporarily for single page app format */}
				{/* <div>
          <Button type="submit">Next ={'>'}</Button>
        </div> */}
		<Button type="submit">Submit</Button>
			</Form>
		</div>
	)
}
