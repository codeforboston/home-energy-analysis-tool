import { describe, expect, it, beforeEach } from 'vitest'

import { createCaseRecord, updateCaseRecord } from '#app/utils/db/case.db.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { createTestUser, createFormData, createLocationData, createTestCase } from '#tests/test-utils.ts'

describe('case.db.server', () => {
	let testUser: Awaited<ReturnType<typeof createTestUser>>

	beforeEach(async () => {
		testUser = await createTestUser()
	})

	describe('createCaseRecord', () => {
		it('should create a new case with all related records', async () => {
			const formValues = createFormData()
			const locationData = createLocationData()

			const result = await createCaseRecord(formValues, locationData, testUser.id)

			expect(result).toBeDefined()
			expect(result.id).toBeDefined()
			expect(result.analysis).toBeDefined()
			expect(result.analysis.id).toBeDefined()

			// Verify HomeOwner was created
			const homeOwner = await prisma.homeOwner.findFirst({
				where: { id: result.homeOwnerId },
			})
			expect(homeOwner).toBeDefined()
			expect(homeOwner?.firstName1).toBe(formValues.name)

			// Verify Location was created
			const location = await prisma.location.findFirst({
				where: { id: result.locationId },
			})
			expect(location).toBeDefined()
			expect(location?.address).toBe(formValues.street_address)
			expect(location?.city).toBe(formValues.town)
			expect(location?.state).toBe(formValues.state)
			expect(location?.livingAreaSquareFeet).toBe(formValues.living_area)

			// Verify Analysis was created
			const analysis = await prisma.analysis.findFirst({
				where: { caseId: result.id },
				include: { heatingInput: true },
			})
			expect(analysis).toBeDefined()
			expect(analysis?.rules_engine_version).toBe('1.0.0')

			// Verify HeatingInput was created
			expect(analysis?.heatingInput).toHaveLength(1)
			const heatingInput = analysis?.heatingInput[0]
			expect(heatingInput?.fuelType).toBe(formValues.fuel_type)
			expect(heatingInput?.heatingSystemEfficiency).toBe(
				Math.round(formValues.heating_system_efficiency * 100)
			)
			expect(heatingInput?.thermostatSetPoint).toBe(formValues.thermostat_set_point)
			expect(heatingInput?.setbackTemperature).toBe(formValues.setback_temperature)
			expect(heatingInput?.setbackHoursPerDay).toBe(formValues.setback_hours_per_day)
			expect(heatingInput?.livingArea).toBe(formValues.living_area)
		})

		it('should connect the case to the user', async () => {
			const formValues = createFormData()
			const locationData = createLocationData()

			const result = await createCaseRecord(formValues, locationData, testUser.id)

			// Verify case is connected to user
			const caseWithUsers = await prisma.case.findUnique({
				where: { id: result.id },
				include: { users: true },
			})

			expect(caseWithUsers?.users).toHaveLength(1)
			expect(caseWithUsers?.users[0]?.id).toBe(testUser.id)
		})
	})

	describe('updateCaseRecord', () => {
		it('should update an existing case and related records', async () => {
			const { caseRecord } = await createTestCase(testUser.id)
			const updatedFormValues = createFormData()
			const locationData = createLocationData()

			const result = await updateCaseRecord(
				caseRecord.id,
				updatedFormValues,
				locationData,
				testUser.id
			)

			expect(result).toBeDefined()
			expect(result?.id).toBe(caseRecord.id)

			// Verify HomeOwner was updated
			const homeOwner = await prisma.homeOwner.findFirst({
				where: { id: caseRecord.homeOwnerId },
			})
			expect(homeOwner?.firstName1).toBe(updatedFormValues.name)

			// Verify Location was updated
			const location = await prisma.location.findFirst({
				where: { id: caseRecord.locationId },
			})
			expect(location?.address).toBe(updatedFormValues.street_address)
			expect(location?.city).toBe(updatedFormValues.town)
			expect(location?.state).toBe(updatedFormValues.state)
			expect(location?.livingAreaSquareFeet).toBe(updatedFormValues.living_area)
		})

		it('should update HeatingInput when it exists', async () => {
			const { caseRecord, heatingInput } = await createTestCase(testUser.id)
			const updatedFormValues = createFormData()
			const locationData = createLocationData()

			await updateCaseRecord(
				caseRecord.id,
				updatedFormValues,
				locationData,
				testUser.id
			)

			// Verify HeatingInput was updated
			const updatedHeatingInput = await prisma.heatingInput.findUnique({
				where: { id: heatingInput.id },
			})

			expect(updatedHeatingInput?.fuelType).toBe(updatedFormValues.fuel_type)
			expect(updatedHeatingInput?.heatingSystemEfficiency).toBe(
				Math.round(updatedFormValues.heating_system_efficiency * 100)
			)
			expect(updatedHeatingInput?.thermostatSetPoint).toBe(updatedFormValues.thermostat_set_point)
			expect(updatedHeatingInput?.setbackTemperature).toBe(updatedFormValues.setback_temperature)
			expect(updatedHeatingInput?.setbackHoursPerDay).toBe(updatedFormValues.setback_hours_per_day)
			expect(updatedHeatingInput?.livingArea).toBe(updatedFormValues.living_area)
		})

		it('should throw error when case is not found', async () => {
			const nonExistentCaseId = 99999
			const formValues = createFormData()
			const locationData = createLocationData()

			await expect(
				updateCaseRecord(nonExistentCaseId, formValues, locationData, testUser.id)
			).rejects.toThrow('Case with id 99999 not found')
		})
	})
})