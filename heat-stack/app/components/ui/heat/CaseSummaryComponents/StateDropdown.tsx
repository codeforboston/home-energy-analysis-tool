import { useState } from 'react'
import Select, { SingleValue, ActionMeta } from 'react-select'

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

interface StateDropdownProps {
	fields: any
	getInputProps: any
	subSubTitleClass: string
}

export function StateDropdown({
	fields,
	getInputProps,
	subSubTitleClass,
}: StateDropdownProps) {
	const [selectedState, setSelectedState] =
		useState<SingleValue<{ value: string; label: string }>>({ value: 'MA', label: 'MA' })
	const [query, setQuery] = useState('')

	const handleInputChange = (inputValue: string) => {
		setQuery(inputValue)
	}

	const handleChange = (
		selectedOption: SingleValue<{ value: string; label: string }>,
		actionMeta: ActionMeta<{ value: string; label: string }>,
	) => {
		setSelectedState(selectedOption)
	}

	const filteredStates =
		query === ''
			? states
			: states.filter((states) =>
					states.label.toLowerCase().includes(query.toLowerCase()),
				)

	return (
		<Select
			value={selectedState}
			onChange={handleChange}
			onInputChange={handleInputChange}
			options={filteredStates}
			isSearchable
			placeholder="Type to select a state"
			className={subSubTitleClass}
			{...getInputProps(fields.state, { type: 'text' })}
      defaultValue={"MA"}
		/>
	)
}
