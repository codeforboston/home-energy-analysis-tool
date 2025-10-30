import { describe, expect, it, beforeEach } from 'vitest'

import { insertProcessedBills, deleteBillsForAnalysis } from '#app/utils/db/bill.db.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { createTestUser, createTestCase, createGasBillData } from '#tests/test-utils.ts'

describe('bill.db.server', () => {
	let testUser: Awaited<ReturnType<typeof createTestUser>>
	let testCase: Awaited<ReturnType<typeof createTestCase>>

	beforeEach(async () => {
		testUser = await createTestUser()
		testCase = await createTestCase(testUser.id)
	})

	describe('insertProcessedBills', () => {
		it('should insert processed energy bills', async () => {
			const gasBillData = createGasBillData()
			const analysisInputId = testCase.heatingInput.id

			const insertedCount = await insertProcessedBills(analysisInputId, gasBillData)

			expect(insertedCount).toBe(gasBillData.processed_energy_bills.length)

			// Verify bills were inserted
			const bills = await prisma.processedEnergyBill.findMany({
				where: { analysisInputId },
			})

			expect(bills).toHaveLength(gasBillData.processed_energy_bills.length)

			// Verify first bill data
			const firstBill = bills[0]
			const expectedFirstBill = gasBillData.processed_energy_bills[0]
			
			expect(firstBill?.analysisInputId).toBe(analysisInputId)
			expect(firstBill?.usageQuantity).toBe(expectedFirstBill?.usage)
			expect(firstBill?.wholeHomeHeatLossRate).toBe(expectedFirstBill?.whole_home_heat_loss_rate)
			expect(firstBill?.analysisType).toBe(expectedFirstBill?.analysis_type)
			expect(firstBill?.defaultInclusion).toBe(expectedFirstBill?.default_inclusion)
			expect(firstBill?.invertDefaultInclusion).toBe(expectedFirstBill?.inclusion_override)
		})

		it('should return 0 when no processed energy bills exist', async () => {
			const gasBillData = { processed_energy_bills: [] }
			const analysisInputId = testCase.heatingInput.id

			const insertedCount = await insertProcessedBills(analysisInputId, gasBillData)

			expect(insertedCount).toBe(0)

			// Verify no bills were inserted
			const bills = await prisma.processedEnergyBill.findMany({
				where: { analysisInputId },
			})

			expect(bills).toHaveLength(0)
		})

		it('should return 0 when gasBillDataFromTextFile is null', async () => {
			const analysisInputId = testCase.heatingInput.id

			const insertedCount = await insertProcessedBills(analysisInputId, null)

			expect(insertedCount).toBe(0)
		})

		it('should handle date parsing correctly', async () => {
			const gasBillData = {
				processed_energy_bills: [{
					period_start_date: '2024-01-01T00:00:00.000Z',
					period_end_date: '2024-01-31T23:59:59.999Z',
					usage: 100.5,
					whole_home_heat_loss_rate: 2.5,
					analysis_type: 1,
					default_inclusion: true,
					inclusion_override: false,
				}]
			}
			const analysisInputId = testCase.heatingInput.id

			await insertProcessedBills(analysisInputId, gasBillData)

			const bill = await prisma.processedEnergyBill.findFirst({
				where: { analysisInputId },
			})

			expect(bill?.periodStartDate).toEqual(new Date('2024-01-01T00:00:00.000Z'))
			expect(bill?.periodEndDate).toEqual(new Date('2024-01-31T23:59:59.999Z'))
		})
	})

	describe('deleteBillsForAnalysis', () => {
		it('should delete all bills for an analysis', async () => {
			const gasBillData = createGasBillData()
			const analysisInputId = testCase.heatingInput.id

			// Insert some bills first
			await insertProcessedBills(analysisInputId, gasBillData)

			// Verify bills were inserted
			const billsBeforeDelete = await prisma.processedEnergyBill.findMany({
				where: { analysisInputId },
			})
			expect(billsBeforeDelete.length).toBeGreaterThan(0)

			// Delete bills
			const deletedCount = await deleteBillsForAnalysis(analysisInputId)

			expect(deletedCount).toBe(billsBeforeDelete.length)

			// Verify bills were deleted
			const billsAfterDelete = await prisma.processedEnergyBill.findMany({
				where: { analysisInputId },
			})
			expect(billsAfterDelete).toHaveLength(0)
		})

		it('should return 0 when no bills exist for analysis', async () => {
			const analysisInputId = testCase.heatingInput.id

			const deletedCount = await deleteBillsForAnalysis(analysisInputId)

			expect(deletedCount).toBe(0)
		})

		it('should only delete bills for the specified analysis', async () => {
			// Create another test case
			const anotherTestCase = await createTestCase(testUser.id)
			
			const gasBillData1 = createGasBillData()
			const gasBillData2 = createGasBillData()

			// Insert bills for both analyses
			await insertProcessedBills(testCase.heatingInput.id, gasBillData1)
			await insertProcessedBills(anotherTestCase.heatingInput.id, gasBillData2)

			// Delete bills for first analysis only
			const deletedCount = await deleteBillsForAnalysis(testCase.heatingInput.id)

			expect(deletedCount).toBe(gasBillData1.processed_energy_bills.length)

			// Verify first analysis bills are deleted
			const bills1 = await prisma.processedEnergyBill.findMany({
				where: { analysisInputId: testCase.heatingInput.id },
			})
			expect(bills1).toHaveLength(0)

			// Verify second analysis bills still exist
			const bills2 = await prisma.processedEnergyBill.findMany({
				where: { analysisInputId: anotherTestCase.heatingInput.id },
			})
			expect(bills2).toHaveLength(gasBillData2.processed_energy_bills.length)
		})
	})
})