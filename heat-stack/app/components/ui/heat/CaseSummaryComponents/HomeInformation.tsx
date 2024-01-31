import { Form } from '@remix-run/react'
// import { Button } from '#/app/components/ui/button.tsx'
import { Input } from '#/app/components/ui/input.tsx'
import { Label } from '#/app/components/ui/label.tsx'

export function HomeInformation() {
	const titleClass = 'text-5xl font-extrabold tracking-wide'
	const subtitleClass = 'text-2xl font-semibold text-zinc-950 mt-9'
	const descriptiveClass = 'mt-2 text-sm text-slate-500'
	const componentMargin = 'mt-10'
	return (
		<div>
			<h2 className={`${titleClass}`}>Home Information</h2>

			<Form method="post" action="/homes">
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
			</Form>
		</div>
	)
}
