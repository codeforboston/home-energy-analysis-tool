/**
 * @vitest-environment jsdom
 */
import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LabelWithHelp, SectionTitle, SubsectionTitle } from './forms.tsx'

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

describe('LabelWithHelp', () => {
	it('renders a plain label when help is omitted', () => {
		render(<LabelWithHelp htmlFor="town">City/Town</LabelWithHelp>)
		expect(screen.getByText('City/Town').tagName).toBe('LABEL')
		expect(screen.queryByRole('button')).toBeNull()
	})

	it('renders the help button beside, not inside, the label', () => {
		render(
			<LabelWithHelp
				htmlFor="design_temperature_override"
				help={{ keyName: 'design_temperature_override.help' }}
			>
				Design Temperature Override (℉)
			</LabelWithHelp>,
		)
		const label = screen.getByText('Design Temperature Override (℉)')
		const button = screen.getByRole('button')
		expect(label.contains(button)).toBe(false)
		expect(button.parentElement).toBe(label.parentElement)
	})
})
