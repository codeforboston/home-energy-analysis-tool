import { Form } from '@remix-run/react'
import { Input } from '#/app/components/ui/input.tsx'
import { Label } from '#/app/components/ui/label.tsx'
import { Button } from '#/app/components/ui/button.tsx'

export function HomeInformation() {
	const designTemperature = '63'
	const designTemperatureOverride = '65'
	return (
		<div>
			<h2 className='text-5xl font-extrabold tracking-wide'>Home Information</h2>

			<div className='mt-10'>
				<h6 className='text-zinc-950 text-2xl font-semibold'>Resident/Client</h6>

				<div className='mt-4 flex space-x-4'>
					<div>
						<Label htmlFor="firstName">First Name</Label>
						<Input id="firstName" type="text" placeholder="Bob" />
					</div>
					<div>
						<Label htmlFor="lastName">Last Name</Label>
						<Input id="lastName" type="text" placeholder="Barker" />
					</div>
				</div>

			</div>


			<div className='mt-9'>
				<h6 className='text-zinc-950 text-2xl font-semibold'>Address</h6>

				<div className='mt-4 flex space-x-4'>
					<div>
						<Label htmlFor="address">Street adress</Label>
						<Input id="address" type="text" placeholder="76 Framingham Ave." />
						<Input id="adressTwo" type="text" placeholder="Apt 256" />

						<div className='mt-4 flex'>
							<div>
								<Label htmlFor="city">City/Town</Label>
								<Input id="city" type="text" placeholder="Boston" />
							</div>
							<div>
								<Label htmlFor="state">State</Label>
								<Input id="state" type="text" placeholder="MA" />
							</div>
							<div>
								<Label htmlFor="zipcode">Zipcode</Label>
								<Input id="zipcode" type="text" placeholder="02856" />
							</div>
						</div>
					</div>
				</div>
			</div>


			<div className='mt-9'>
				<h6>
					<Label className='text-zinc-950 text-2xl font-semibold' htmlFor="livingArea">
						Living Area (sf)
					</Label>
				</h6>

				<div className='mt-4'>
					<div>
						<Input id="livingArea" type="number" placeholder="3000" />
						<p className='mt-2 text-sm text-slate-500'>The home's above-grade, conditioned space</p>
					</div>
				</div>
			</div>

			<div>
				<Button>Next ={'>'}</Button>
			</div>
		</div>
	)
}
