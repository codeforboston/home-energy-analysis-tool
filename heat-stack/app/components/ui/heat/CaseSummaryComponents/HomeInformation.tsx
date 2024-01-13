import { Form } from '@remix-run/react'
import { Button } from '#/app/components/ui/button.tsx'
import { Input } from '#/app/components/ui/input.tsx'
import { Label } from '#/app/components/ui/label.tsx'

export function HomeInformation() {
	return (
		<div>
			<h2 className="text-5xl font-extrabold tracking-wide">
				Home Information
			</h2>

			<Form method="post" action="/homes">
				<div className="mt-10">
					<h6 className="text-2xl font-semibold text-zinc-950">
						Resident/Client
					</h6>

					<div className="mt-4 flex space-x-4">
						<div>
							<Label htmlFor="firstName">First Name</Label>
							<Input
								name="firstName"
								id="firstName"
								type="text"
								placeholder="Bob"
							/>
						</div>
						<div>
							<Label htmlFor="lastName">Last Name</Label>
							<Input
								name="lastName"
								id="lastName"
								type="text"
								placeholder="Barker"
							/>
						</div>
					</div>
				</div>

				<div className="mt-9">
					<h6 className="text-2xl font-semibold text-zinc-950">Address</h6>

					<div className="mt-4 flex space-x-4">
						<div>
							<Label htmlFor="address">Street address</Label>
							<Input
								name="address"
								id="address"
								type="text"
								placeholder="76 Framingham Ave."
							/>
							<Input
								name="addressTwo"
								id="adressTwo"
								type="text"
								placeholder="Apt 256"
							/>

							<div className="mt-4 flex">
								<div>
									<Label htmlFor="city">City/Town</Label>
									<Input
										name="city"
										id="city"
										type="text"
										placeholder="Boston"
									/>
								</div>
								<div>
									<Label htmlFor="state">State</Label>
									<Input name="state" id="state" type="text" placeholder="MA" />
								</div>
								<div>
									<Label htmlFor="zipcode">Zipcode</Label>
									<Input
										name="zipcode"
										id="zipcode"
										type="text"
										placeholder="02856"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-9">
					<h6>
						<Label
							className="text-2xl font-semibold text-zinc-950"
							htmlFor="livingArea"
						>
							Living Area (sf)
						</Label>
					</h6>

					<div className="mt-4">
						<div>
							<Input
								name="livingArea"
								id="livingArea"
								type="number"
								placeholder="3000"
							/>
							<p className="mt-2 text-sm text-slate-500">
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
