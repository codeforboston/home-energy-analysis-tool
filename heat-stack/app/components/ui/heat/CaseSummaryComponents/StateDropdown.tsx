import { useState } from 'react'
import { Input } from '#/app/components/ui/input.tsx'
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from '#/app/components/ui/select.tsx'
import { ErrorList } from './ErrorList.tsx'


const states = [
	{ value: 'AL', label: 'AL' },
	{ value: 'AK', label: 'AK' },
	{ value: 'AZ', label: 'AZ' },
	{ value: 'AR', label: 'AR' },
	{ value: 'CA', label: 'CA' },
	{ value: 'CO', label: 'CO' },
	{ value: 'CT', label: 'CT' },
	{ value: 'DE', label: 'DE' },
	{ value: 'FL', label: 'FL' },
	{ value: 'GA', label: 'GA' },
	{ value: 'HI', label: 'HI' },
	{ value: 'ID', label: 'ID' },
	{ value: 'IL', label: 'IL' },
	{ value: 'IN', label: 'IN' },
	{ value: 'IA', label: 'IA' },
	{ value: 'KS', label: 'KS' },
	{ value: 'KY', label: 'KY' },
	{ value: 'LA', label: 'LA' },
	{ value: 'ME', label: 'ME' },
	{ value: 'MD', label: 'MD' },
	{ value: 'MA', label: 'MA' },
	{ value: 'MI', label: 'MI' },
	{ value: 'MN', label: 'MN' },
	{ value: 'MS', label: 'MS' },
	{ value: 'MO', label: 'MO' },
	{ value: 'MT', label: 'MT' },
	{ value: 'NE', label: 'NE' },
	{ value: 'NV', label: 'NV' },
	{ value: 'NH', label: 'NH' },
	{ value: 'NJ', label: 'NJ' },
	{ value: 'NM', label: 'NM' },
	{ value: 'NY', label: 'NY' },
	{ value: 'NC', label: 'NC' },
	{ value: 'ND', label: 'ND' },
	{ value: 'OH', label: 'OH' },
	{ value: 'OK', label: 'OK' },
	{ value: 'OR', label: 'OR' },
	{ value: 'PA', label: 'PA' },
	{ value: 'RI', label: 'RI' },
	{ value: 'SC', label: 'SC' },
	{ value: 'SD', label: 'SD' },
	{ value: 'TN', label: 'TN' },
	{ value: 'TX', label: 'TX' },
	{ value: 'UT', label: 'UT' },
	{ value: 'VT', label: 'VT' },
	{ value: 'VA', label: 'VA' },
	{ value: 'WA', label: 'WA' },
	{ value: 'WV', label: 'WV' },
	{ value: 'WI', label: 'WI' },
	{ value: 'WY', label: 'WY' },
]

type CurrentHeatingSystemProps = { fields: any }

export function StateDropdown(props: CurrentHeatingSystemProps) {
	const [stateSelected, setStateSelected] = useState('MA')

	return (
		<div>
			{/* <Form method="post" action="/current"> */}
			<div>
				<div className="mt-4 flex space-x-4">
					<div className="basis-1/4">
						<Select
							onValueChange={(val) => setStateSelected(val)}
							value={stateSelected}
						>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="State" />
							</SelectTrigger>
							<SelectContent>
								{states.map((state) => (
									<SelectItem
										key={state.value}
										value={state.value}
									>{state.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* This hidden field submits the same value instead. */}
						<Input type="hidden" name="state" value={stateSelected} />
					</div>
				</div>
				<div className="min-h-[32px] px-4 pb-3 pt-1">
					<ErrorList
						id={props.fields.state.errorId}
						errors={props.fields.state.errors}
					/>
				</div>
			</div>
		</div>
	)
}
