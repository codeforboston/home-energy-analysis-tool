import { describe, expect, it, vi, beforeEach } from 'vitest'

// SingleCaseForm (rendered by the route's default export) transitively
// imports rules-engine.ts, which eagerly loads Pyodide at module-eval time.
// Mock it so importing this route module for the `action` test doesn't
// require the built Python wheel.
vi.mock('#app/utils/rules-engine.ts', () => ({
	executeParseGasBillPy: vi.fn(),
	executeGetNormalizedOutput: vi.fn(),
}))

vi.mock('#app/utils/auth.server.ts', () => ({
	requireUserId: vi.fn().mockResolvedValue('user-1'),
}))

vi.mock('#app/utils/db/case.server.ts', () => ({
	getLoggedInUserFromRequest: vi.fn().mockResolvedValue({ roles: [] }),
	getCaseForEditing: vi.fn(),
}))

vi.mock('#app/utils/logic/case.logic.server.ts', () => ({
	processCaseUpdate: vi.fn(),
}))

const { action } = await import('./$caseId.edit.tsx')
const { processCaseUpdate } = await import(
	'#app/utils/logic/case.logic.server.ts'
)

// Fields required by SaveOnlySchema (HomeFormSchema + CurrentHeatingSystemSchema).
// Deliberately omits `energy_use_upload`, which only the full `Schema` requires -
// the edit route should never need it, regardless of what `intent` (if anything)
// is sent.
function buildValidEditFormBody(extra: Record<string, string> = {}) {
	return new URLSearchParams({
		name: 'Test User',
		living_area: '2000',
		street_address: '123 Test St',
		town: 'Boston',
		state: 'MA',
		fuel_type: 'GAS',
		heating_system_efficiency: '0.9',
		thermostat_set_point: '68',
		...extra,
	})
}

function buildEditRequest(body: URLSearchParams) {
	return new Request('http://localhost/cases/1/edit', {
		method: 'POST',
		headers: { 'content-type': 'application/x-www-form-urlencoded' },
		body: body.toString(),
	})
}

describe('$caseId.edit action', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		vi.mocked(processCaseUpdate).mockResolvedValue({
			updatedCase: { id: 1, analysis: [{ id: 2 }] },
			gasBillData: undefined,
		} as any)
	})

	it('validates a save without requiring a file upload when no intent is sent', async () => {
		const request = buildEditRequest(buildValidEditFormBody())

		const result: any = await action({
			request,
			params: { caseId: '1' },
		} as any)

		expect(result.submitResult.status).toBe('success')
	})

	it('validates a save without requiring a file upload even if a stale intent value is sent', async () => {
		const request = buildEditRequest(
			buildValidEditFormBody({ intent: 'upload' }),
		)

		const result: any = await action({
			request,
			params: { caseId: '1' },
		} as any)

		expect(result.submitResult.status).toBe('success')
	})
})
