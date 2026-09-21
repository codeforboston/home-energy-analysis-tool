/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Field, SectionTitle, SubsectionTitle } from './forms.tsx'

describe('SectionTitle', () => {
	it('renders as a legend by default with the tier-1 style', () => {
		render(<SectionTitle>Home Information</SectionTitle>)
		const el = screen.getByText('Home Information')
		expect(el.tagName).toBe('LEGEND')
		expect(el.className).toContain('text-4xl')
		expect(el.className).toContain('font-bold')
	})

	it('renders as an h2 when as="h2" is passed', () => {
		render(<SectionTitle as="h2">Heat Load Analysis</SectionTitle>)
		expect(screen.getByText('Heat Load Analysis').tagName).toBe('H2')
	})
})

describe('SubsectionTitle', () => {
	it('renders as an h3 by default with the tier-2 style', () => {
		render(<SubsectionTitle>Thermostat Settings</SubsectionTitle>)
		const el = screen.getByText('Thermostat Settings')
		expect(el.tagName).toBe('H3')
		expect(el.className).toContain('text-2xl')
	})

	it('renders as a legend when as="legend" is passed', () => {
		render(<SubsectionTitle as="legend">Address Information</SubsectionTitle>)
		expect(screen.getByText('Address Information').tagName).toBe('LEGEND')
	})

	it('renders as a label with htmlFor when as="label" is passed', () => {
		render(
			<SubsectionTitle as="label" htmlFor="living_area">
				Living Area (sf)
			</SubsectionTitle>,
		)
		const el = screen.getByText('Living Area (sf)')
		expect(el.tagName).toBe('LABEL')
		expect(el.getAttribute('for')).toBe('living_area')
	})

	it('renders a centered help button alongside the title when help is passed', () => {
		render(
			<SubsectionTitle help={{ keyName: 'living_area.help' }}>
				Living Area
			</SubsectionTitle>,
		)
		const wrapper = screen.getByText('Living Area').parentElement
		expect(wrapper?.className).toContain('items-center')
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('does not render a help button when help is omitted', () => {
		render(<SubsectionTitle>Address Information</SubsectionTitle>)
		expect(screen.queryByRole('button')).toBeNull()
	})
})

describe('Field help and description', () => {
	it('wraps the label and help button in a centered row when help is passed', () => {
		render(
			<Field
				labelProps={{ children: 'Design Temperature Override (℉)' }}
				inputProps={{ name: 'design_temperature_override' }}
				help={{ keyName: 'design_temperature_override.help' }}
			/>,
		)
		const label = screen.getByText('Design Temperature Override (℉)')
		expect(label.parentElement?.className).toContain('items-center')
		expect(screen.getByRole('button')).toBeInTheDocument()
	})

	it('renders description text between the input and the error area', () => {
		render(
			<Field
				labelProps={{ children: 'Design Temperature Override (℉)' }}
				inputProps={{ name: 'design_temperature_override' }}
				description="Leave blank or enter a value in the range -10 to 32"
			/>,
		)
		expect(
			screen.getByText('Leave blank or enter a value in the range -10 to 32'),
		).toBeInTheDocument()
	})

	it('omits the help button and description when not passed (backward compatible)', () => {
		render(<Field labelProps={{ children: 'Name' }} inputProps={{ name: 'name' }} />)
		expect(screen.queryByRole('button')).toBeNull()
	})
})
