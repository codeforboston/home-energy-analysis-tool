import React, { useState } from 'react'
import Select, { SingleValue, ActionMeta } from 'react-select'

const people = [
	{ value: 1, label: 'Durward Reynolds' },
	{ value: 2, label: 'Kenton Towne' },
	{ value: 3, label: 'Therese Wunsch' },
	{ value: 4, label: 'Benedict Kessler' },
	{ value: 5, label: 'Katelyn Rohan' },
]

export function StateDropdown() {
	const [selectedPerson, setSelectedPerson] =
		useState<SingleValue<{ value: number; label: string }>>(null)
	const [query, setQuery] = useState('')

	const handleInputChange = (inputValue: string) => {
		setQuery(inputValue)
	}

	const handleChange = (
		selectedOption: SingleValue<{ value: number; label: string }>,
		actionMeta: ActionMeta<{ value: number; label: string }>,
	) => {
		setSelectedPerson(selectedOption)
	}

	const filteredPeople =
		query === ''
			? people
			: people.filter((person) =>
					person.label.toLowerCase().includes(query.toLowerCase()),
				)

	return (
		<Select
			value={selectedPerson}
			onChange={handleChange}
			onInputChange={handleInputChange}
			options={filteredPeople}
			isSearchable
			placeholder="Select a person"
		/>
	)
}
