/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import SingleCaseForm from '#app/components/ui/heat/CaseSummaryComponents/SingleCaseForm.tsx'

// Mock the child components to simplify testing
vi.mock(
	'#app/components/ui/heat/CaseSummaryComponents/HomeInformation.tsx',
	() => ({
		HomeInformation: () => (
			<div data-testid="home-information">Home Information</div>
		),
	}),
)

vi.mock(
	'#app/components/ui/heat/CaseSummaryComponents/CurrentHeatingSystem.tsx',
	() => ({
		CurrentHeatingSystem: () => (
			<div data-testid="current-heating-system">Current Heating System</div>
		),
	}),
)

vi.mock(
	'#app/components/ui/heat/CaseSummaryComponents/EnergyUseUpload.tsx',
	() => ({
		EnergyUseUpload: ({ isEditMode }: { isEditMode?: boolean }) => (
			<div data-testid="energy-use-upload">
				<button type="submit">
					{isEditMode ? 'Save Changes' : 'Calculate'}
				</button>
			</div>
		),
	}),
)

vi.mock(
	'#app/components/ui/heat/CaseSummaryComponents/AnalysisHeader.tsx',
	() => ({
		AnalysisHeader: () => (
			<div data-testid="analysis-header">Analysis Header</div>
		),
	}),
)

vi.mock(
	'#app/components/ui/heat/CaseSummaryComponents/EnergyUseHistoryChart.tsx',
	() => ({
		EnergyUseHistoryChart: () => (
			<div data-testid="energy-use-history-chart">Energy Use History Chart</div>
		),
	}),
)

vi.mock(
	'#app/components/ui/heat/CaseSummaryComponents/HeatLoadAnalysis.tsx',
	() => ({
		HeatLoadAnalysis: () => (
			<div data-testid="heat-load-analysis">Heat Load Analysis</div>
		),
	}),
)

// Helper function to render components with router context
function renderWithRouter(component: React.ReactElement) {
	const router = createMemoryRouter(
		[
			{
				path: '/',
				element: component,
			},
		],
		{
			initialEntries: ['/'],
			initialIndex: 0,
		},
	)

	return render(<RouterProvider router={router} />)
}

describe('SingleCaseForm', () => {
	const defaultProps = {
		beforeSubmit: vi.fn(),
		lastResult: null,
		defaultFormValues: { fuel_type: 'GAS' as const },
		showSavedCaseIdMsg: false,
		caseInfo: undefined,
		usageData: undefined,
		showUsageData: false,
		onClickBillingRow: vi.fn(),
		parsedAndValidatedFormSchema: undefined,
	}

	it('should render form components', () => {
		renderWithRouter(<SingleCaseForm {...defaultProps} />)

		expect(screen.getByTestId('home-information')).toBeInTheDocument()
		expect(screen.getByTestId('current-heating-system')).toBeInTheDocument()
		expect(screen.getByTestId('energy-use-upload')).toBeInTheDocument()
	})

	it('should show Calculate button when not in edit mode', () => {
		renderWithRouter(<SingleCaseForm {...defaultProps} isEditMode={false} />)

		expect(
			screen.getByRole('button', { name: /calculate/i }),
		).toBeInTheDocument()
	})

	it('should show Save Changes button when in edit mode', () => {
		renderWithRouter(<SingleCaseForm {...defaultProps} isEditMode={true} />)

		expect(
			screen.getByRole('button', { name: /save changes/i }),
		).toBeInTheDocument()
	})

	it('should display case ID when caseInfo is provided', () => {
		const caseInfo = { caseId: 123, analysisId: 456 }
		renderWithRouter(<SingleCaseForm {...defaultProps} caseInfo={caseInfo} />)

		expect(screen.getByText('Case 123')).toBeInTheDocument()
	})

	it('should show usage data components when showUsageData is true', () => {
		const usageData = {
			processed_energy_bills: [],
			heat_load_output: {
				estimated_balance_point: 45,
				other_fuel_usage: 0,
				average_indoor_temperature: 68,
				difference_between_ti_and_tbp: 23,
				design_temperature: 10,
				whole_home_heat_loss_rate: 2.5,
				standard_deviation_of_heat_loss_rate: 0.5,
				average_heat_load: 50,
				maximum_heat_load: 100,
			},
			balance_point_graph: {
				records: [
					{
						balance_point: 45,
						heat_loss_rate: 2.5,
						change_in_heat_loss_rate: 0.1,
						percent_change_in_heat_loss_rate: 4.0,
						standard_deviation: 0.5,
					},
				],
			},
		}

		const parsedSchema = {
			living_area: 2000,
			name: 'Test User',
			street_address: '123 Test St',
			town: 'Test City',
			state: 'MA',
			fuel_type: 'GAS' as const,
			heating_system_efficiency: 0.85,
			thermostat_set_point: 68,
			setback_temperature: 65,
			setback_hours_per_day: 8,
			design_temperature_override: 0,
			energy_use_upload: { name: 'test.csv', type: 'text/csv', size: 1024 },
		}

		renderWithRouter(
			<SingleCaseForm
				{...defaultProps}
				usageData={usageData as any}
				showUsageData={true}
				parsedAndValidatedFormSchema={parsedSchema}
			/>,
		)

		expect(screen.getByTestId('analysis-header')).toBeInTheDocument()
		expect(screen.getByTestId('energy-use-history-chart')).toBeInTheDocument()
		expect(screen.getByTestId('heat-load-analysis')).toBeInTheDocument()
	})

	it('should show error when heat load analysis data is missing', () => {
		const usageData = {
			processed_energy_bills: [],
			heat_load_output: undefined,
			balance_point_graph: {
				records: [],
			},
		}

		renderWithRouter(
			<SingleCaseForm
				{...defaultProps}
				usageData={usageData as any}
				showUsageData={true}
				parsedAndValidatedFormSchema={undefined}
			/>,
		)

		expect(screen.getByText('Not rendering Heat Load')).toBeInTheDocument()
		expect(
			screen.getByText('usageData is undefined or missing key values'),
		).toBeInTheDocument()
	})

	it('should show success message when case is saved', () => {
		const caseInfo = { caseId: 123, analysisId: 456 }
		renderWithRouter(
			<SingleCaseForm
				{...defaultProps}
				showSavedCaseIdMsg={true}
				caseInfo={caseInfo}
			/>,
		)

		expect(screen.getByText('Case Saved Successfully!')).toBeInTheDocument()
		expect(
			screen.getByText('Your case data has been saved to the database.'),
		).toBeInTheDocument()
		expect(
			screen.getByRole('link', { name: 'View Case Details' }),
		).toHaveAttribute('href', '/cases/123')
	})

	it('should not show success message when case is not saved', () => {
		renderWithRouter(
			<SingleCaseForm {...defaultProps} showSavedCaseIdMsg={false} />,
		)

		expect(
			screen.queryByText('Case Saved Successfully!'),
		).not.toBeInTheDocument()
	})

	it('should not show success message when caseId is undefined', () => {
		const caseInfo = { caseId: undefined, analysisId: 456 }
		renderWithRouter(
			<SingleCaseForm
				{...defaultProps}
				showSavedCaseIdMsg={true}
				caseInfo={caseInfo}
			/>,
		)

		expect(
			screen.queryByText('Case Saved Successfully!'),
		).not.toBeInTheDocument()
	})
})
