/**
 * @vitest-environment jsdom
 */
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Field, FieldErrors, SectionTitle, SubsectionTitle } from './forms.tsx'

describe('SectionTitle', () => {
	it('renders as a legend by default', () => {
		render(<SectionTitle>Home Information</SectionTitle>)
		expect(screen.getByText('Home Information').tagName).toBe('LEGEND')
	})

	it('renders as an h2 when as="h2" is passed', () => {
		render(<SectionTitle as="h2">Heat Load Analysis</SectionTitle>)
		expect(screen.getByText('Heat Load Analysis').tagName).toBe('H2')
	})

	it('names its fieldset when it is the first child', () => {
		render(
			<fieldset>
				<SectionTitle>Existing Heating System</SectionTitle>
				<input />
			</fieldset>,
		)
		expect(
			screen.getByRole('group', { name: 'Existing Heating System' }),
		).toBeInTheDocument()
	})

	it('renders the help button inside the legend when help is passed', () => {
		render(
			<SectionTitle help={{ keyName: 'energy_use_history.help' }}>
				Energy Use History
			</SectionTitle>,
		)
		const legend = screen.getByText('Energy Use History').closest('legend')
		expect(within(legend!).getByRole('button')).toBeInTheDocument()
	})
})

describe('SubsectionTitle', () => {
	it('renders as an h3 by default', () => {
		render(<SubsectionTitle>Thermostat Settings</SubsectionTitle>)
		expect(
			screen.getByRole('heading', { level: 3, name: 'Thermostat Settings' }),
		).toBeInTheDocument()
	})

	it('renders as a legend when as="legend" is passed', () => {
		render(<SubsectionTitle as="legend">Address Information</SubsectionTitle>)
		expect(screen.getByText('Address Information').tagName).toBe('LEGEND')
	})

	it('renders as a label for the given control when as="label" is passed', () => {
		render(
			<>
				<SubsectionTitle as="label" htmlFor="living_area">
					Living Area (sf)
				</SubsectionTitle>
				<input id="living_area" />
			</>,
		)
		expect(screen.getByLabelText('Living Area (sf)').id).toBe('living_area')
	})

	it('renders the help button beside, not inside, a label title', () => {
		render(
			<SubsectionTitle
				as="label"
				htmlFor="living_area"
				help={{ keyName: 'living_area.help' }}
			>
				Living Area (sf)
			</SubsectionTitle>,
		)
		const label = screen.getByText('Living Area (sf)')
		const button = screen.getByRole('button')
		expect(label.tagName).toBe('LABEL')
		expect(label.contains(button)).toBe(false)
		expect(button.parentElement).toBe(label.parentElement)
	})

	it('renders the help button inside a heading title', () => {
		render(
			<SubsectionTitle help={{ keyName: 'heat_load.help' }}>
				Heat Load
			</SubsectionTitle>,
		)
		const heading = screen.getByRole('heading', { level: 3 })
		expect(within(heading).getByRole('button')).toBeInTheDocument()
	})

	it('does not render a help button when help is omitted', () => {
		render(<SubsectionTitle>Address Information</SubsectionTitle>)
		expect(screen.queryByRole('button')).toBeNull()
	})
})

describe('FieldErrors', () => {
	it('reserves the error slot by default when there are no errors', () => {
		const { container } = render(<FieldErrors errors={[]} />)
		expect(container.firstElementChild).toBeEmptyDOMElement()
	})

	it('renders nothing when collapseWhenEmpty is set and there are no errors', () => {
		const { container } = render(
			<FieldErrors errors={[null, undefined]} collapseWhenEmpty />,
		)
		expect(container).toBeEmptyDOMElement()
	})

	it('renders the errors under the given id when collapseWhenEmpty is set', () => {
		render(<FieldErrors id="x-error" errors={['Required']} collapseWhenEmpty />)
		expect(screen.getByRole('list').id).toBe('x-error')
		expect(screen.getByText('Required')).toBeInTheDocument()
	})
})

describe('Field', () => {
	const label = 'Design Temperature Override (℉)'
	const description = 'Leave blank or enter a value in the range -10 to 32'

	it('renders the help button beside, not inside, the label', () => {
		render(
			<Field
				labelProps={{ children: label }}
				inputProps={{ name: 'design_temperature_override' }}
				help={{ keyName: 'design_temperature_override.help' }}
			/>,
		)
		const labelEl = screen.getByText(label)
		expect(labelEl.contains(screen.getByRole('button'))).toBe(false)
		expect(screen.getByLabelText(label).tagName).toBe('INPUT')
	})

	it('renders the description after the input and links it via aria-describedby', () => {
		render(
			<Field
				labelProps={{ children: label }}
				inputProps={{ name: 'design_temperature_override' }}
				description={description}
			/>,
		)
		const input = screen.getByLabelText(label)
		const descriptionEl = screen.getByText(description)
		expect(
			input.compareDocumentPosition(descriptionEl) &
				Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy()
		expect(input).toHaveAccessibleDescription(description)
	})

	it('keeps a caller-supplied aria-describedby alongside the description', () => {
		render(
			<Field
				labelProps={{ children: label }}
				inputProps={{ id: 'dto', 'aria-describedby': 'dto-error' }}
				errors={['Required']}
				description={description}
			/>,
		)
		expect(screen.getByLabelText(label)).toHaveAttribute(
			'aria-describedby',
			'dto-error dto-description',
		)
		expect(screen.getByLabelText(label)).toHaveAccessibleDescription(
			`Required ${description}`,
		)
	})

	it('omits the help button, description, and aria-describedby when not passed', () => {
		render(<Field labelProps={{ children: 'Name' }} inputProps={{}} />)
		expect(screen.queryByRole('button')).toBeNull()
		expect(screen.getByLabelText('Name')).not.toHaveAttribute(
			'aria-describedby',
		)
	})

	it('reserves the error slot by default and drops it with collapseEmptyErrors', () => {
		const { container, rerender } = render(
			<Field labelProps={{ children: 'Name' }} inputProps={{}} />,
		)
		const wrapper = container.firstElementChild!
		expect(wrapper.lastElementChild?.tagName).toBe('DIV')
		expect(wrapper.lastElementChild).toBeEmptyDOMElement()

		rerender(
			<Field
				labelProps={{ children: 'Name' }}
				inputProps={{}}
				collapseEmptyErrors
			/>,
		)
		expect(wrapper.lastElementChild?.tagName).toBe('INPUT')
	})
})
