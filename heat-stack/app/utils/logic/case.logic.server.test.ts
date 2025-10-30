import { describe, expect, it, beforeEach, vi } from 'vitest'

import { processCaseSubmission, processCaseUpdate } from '#app/utils/logic/case.logic.server.ts'
import { createTestUser, createFormData, createGasBillData, createMockFormData, createTestCase } from '#tests/test-utils.ts'

// Mock external dependencies
const mockPyodideProxy = {
	toJs: vi.fn().mockReturnValue({
		processed_bills: [
			{
				analysis_type: 'electric',
				period_start_date: '2024-01-01',
				period_end_date: '2024-01-31',
				usage_therms: 100,
				inclusion_flag: true,
			},
		],
	}),
	destroy: vi.fn(),
}

vi.mock('#app/utils/pyodide.server.ts', () => ({
	executeParsedBills: vi.fn().mockResolvedValue(mockPyodideProxy),
}))

vi.mock('#app/utils/file-handlers.server.ts', () => ({
	parseUploadedFile: vi.fn().mockResolvedValue('mocked file content'),
}))

vi.mock('#app/utils/date-temp-util.ts', () => ({
	default: vi.fn().mockResolvedValue({
		convertedDatesTIWD: {
			dates: ['2024-01-01', '2024-02-01'],
			temperatures: [20, 25],
		},
		state_id: 'test-state-id',
		county_id: 'test-county-id',
	}),
}))

describe('case.logic.server', () => {
	let testUser: Awaited<ReturnType<typeof createTestUser>>

	beforeEach(() => {
		vi.clearAllMocks()
	})

	beforeEach(async () => {
		testUser = await createTestUser()
	})

	describe('processCaseSubmission', () => {
		it('should process a complete case submission', async () => {
			const formValues = createFormData()
			const submission = {
				status: 'success' as const,
				value: formValues,
			}
			const formData = createMockFormData(formValues)

			const result = await processCaseSubmission(submission, testUser.id, formData)

			expect(result).toBeDefined()
			expect(result.newCase).toBeDefined()
			expect(result.newCase.id).toBeDefined()
			expect(result.gasBillData).toBeDefined()
			expect(result.insertedCount).toBe(1)
			expect(result.state_id).toBe('test-state-id')
			expect(result.county_id).toBe('test-county-id')
			expect(result.convertedDatesTIWD).toBeDefined()
		})

		it('should throw error when state_id is missing', async () => {
			// Mock getConvertedDatesTIWD to return missing state_id
			const { default: getConvertedDatesTIWD } = await import('#app/utils/date-temp-util.ts')
			vi.mocked(getConvertedDatesTIWD).mockResolvedValueOnce({
				convertedDatesTIWD: { dates: [], temperatures: [] },
				state_id: undefined,
				county_id: 'test-county-id',
				coordinates: null,
				addressComponents: null,
			})

			const formValues = createFormData()
			const submission = {
				status: 'success' as const,
				value: formValues,
			}
			const formData = createMockFormData(formValues)

			await expect(
				processCaseSubmission(submission, testUser.id, formData)
			).rejects.toThrow('Missing state_id')
		})

		it('should throw error when county_id is missing', async () => {
			// Mock getConvertedDatesTIWD to return missing county_id
			const { default: getConvertedDatesTIWD } = await import('#app/utils/date-temp-util.ts')
			vi.mocked(getConvertedDatesTIWD).mockResolvedValueOnce({
				convertedDatesTIWD: { dates: [], temperatures: [] },
				state_id: 'test-state-id',
				county_id: undefined,
				coordinates: null,
				addressComponents: null,
			})

			const formValues = createFormData()
			const submission = {
				status: 'success' as const,
				value: formValues,
			}
			const formData = createMockFormData(formValues)

			await expect(
				processCaseSubmission(submission, testUser.id, formData)
			).rejects.toThrow('Missing county_id')
		})

		it('should call all external dependencies correctly', async () => {
			const formValues = createFormData()
			const submission = {
				status: 'success' as const,
				value: formValues,
			}
			const formData = createMockFormData(formValues)

			await processCaseSubmission(submission, testUser.id, formData)

			// Verify external functions were called
			const { fileUploadHandler } = await import('#app/utils/file-upload-handler.ts')
			const { executeParseGasBillPy, executeGetAnalyticsFromFormJs } = await import('#app/utils/rules-engine.ts')
			const getConvertedDatesTIWD = (await import('#app/utils/date-temp-util.ts')).default

			expect(fileUploadHandler).toHaveBeenCalledWith(formData)
			expect(executeParseGasBillPy).toHaveBeenCalledWith('mock-csv-content')
			expect(getConvertedDatesTIWD).toHaveBeenCalledWith(
				{ mock: 'pyodide-results' },
				formValues.street_address,
				formValues.town,
				formValues.state
			)
			expect(executeGetAnalyticsFromFormJs).toHaveBeenCalledWith(
				formValues,
				{
					dates: ['2024-01-01', '2024-02-01'],
					temperatures: [20, 25],
				},
				'mock-csv-content',
				'test-state-id',
				'test-county-id'
			)
		})
	})

	describe('processCaseUpdate', () => {
		it('should process a case update', async () => {
			const { caseRecord } = await createTestCase(testUser.id)
			const formValues = createFormData()
			const submission = {
				status: 'success' as const,
				value: formValues,
			}
			const formData = createMockFormData(formValues)

			const result = await processCaseUpdate(caseRecord.id, submission, testUser.id, formData)

			expect(result).toBeDefined()
			expect(result.updatedCase).toBeDefined()
			expect(result.updatedCase?.id).toBe(caseRecord.id)
			expect(result.gasBillData).toBeDefined()
			expect(result.insertedCount).toBe(1)
			expect(result.state_id).toBe('test-state-id')
			expect(result.county_id).toBe('test-county-id')
			expect(result.convertedDatesTIWD).toBeDefined()
		})

		it('should throw error when HeatingInput is not found', async () => {
			// Create a case without HeatingInput
			const { caseRecord } = await createTestCase(testUser.id)
			
			// Mock updateCaseRecord to return a case without heatingInput
			vi.doMock('#app/utils/db/case.db.server.ts', () => ({
				updateCaseRecord: vi.fn().mockResolvedValue({
					id: caseRecord.id,
					analysis: [{ heatingInput: [] }]
				})
			}))

			const formValues = createFormData()
			const submission = {
				status: 'success' as const,
				value: formValues,
			}
			const formData = createMockFormData(formValues)

			await expect(
				processCaseUpdate(caseRecord.id, submission, testUser.id, formData)
			).rejects.toThrow('Failed to find HeatingInput record for update')
		})

		it('should delete existing bills before inserting new ones', async () => {
			const { caseRecord, heatingInput } = await createTestCase(testUser.id)
			
			// Insert some existing bills
			const existingGasBillData = createGasBillData()
			const { insertProcessedBills } = await import('#app/utils/db/bill.db.server.ts')
			await insertProcessedBills(heatingInput.id, existingGasBillData)

			const formValues = createFormData()
			const submission = {
				status: 'success' as const,
				value: formValues,
			}
			const formData = createMockFormData(formValues)

			const result = await processCaseUpdate(caseRecord.id, submission, testUser.id, formData)

			expect(result.insertedCount).toBe(1) // Only new bills should be counted

			// Verify old bills were deleted and new ones inserted
			const { prisma } = await import('#app/utils/db.server.ts')
			const remainingBills = await prisma.processedEnergyBill.findMany({
				where: { analysisInputId: heatingInput.id },
			})
			expect(remainingBills).toHaveLength(1) // Only the new bill
		})
	})
})