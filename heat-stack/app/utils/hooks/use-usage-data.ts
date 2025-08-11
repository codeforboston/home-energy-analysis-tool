import { useState, useEffect } from 'react'
import { buildCurrentUsageData, hasDataProperty } from '#app/utils/index.ts'
import { type EnergyUsageSubmitActionData } from '#types/single-form.ts'
import { type UsageDataSchema } from '../../../types/types.ts'
import { reviver } from '../data-parser.ts'

const useUsageData = (
	actionData: EnergyUsageSubmitActionData | undefined,
	recalculateFromBillingRecordsChange: any,
) => {
	const [usageData, setUsageData] = useState<UsageDataSchema | undefined>()

	const toggleBillingPeriod = (index: number) => {
		if (!usageData) {
			// TODO: How do we handle unexpected state?
			// if this function was called and there is no usage data, something went wrong
			throw new Error('usageData was not found')
		}

		const newRecords = structuredClone(usageData.processed_energy_bills)
		const period = newRecords[index]

		if (!period) {
			// TODO: How do we handle unexpected state?
			// if this function was called and there is no usage data, something went wrong
			throw new Error(`No period with row index ${index} was found`)
		}

		const currentOverride = period.inclusion_override

		// Toggle 'inclusion_override'
		period.inclusion_override = !currentOverride

		newRecords[index] = { ...period }

		// update state to show the rows toggled state in the UI

		setUsageData({
			...usageData,
			processed_energy_bills: newRecords,
		})

		// TODO: recalculateUsageData will call setUsageData with updated table values. Why do we call setState twice instead of doing all calculations at once?
		recalculateUsageData(newRecords)
	}
	const recalculateUsageData = (
		newRecords: UsageDataSchema['processed_energy_bills'],
	) => {
		if (!actionData) {
			// TODO: How do we handle unexpected state?
			// if this function was called and there is no usage data, something went wrong
			throw new Error('actionData was not found')
		}
		if (!recalculateFromBillingRecordsChange) {
			// TODO: How do we handle unexpected state?
			// if this function was called and there is no usage data, something went wrong
			throw new Error('recalculateFromBillingRecordsChange was not found')
		}

		//  recalculateFromBillingRecordsChange will call setUsageData

		recalculateFromBillingRecordsChange(
			// TODO: I think we should be passing usageDataAsMap BUT there will be an error thrown because
			// usageDataAsMap.get('balance_point_graph') changes from a map to a map of proxies resulting
			// in an error thrown by structuredClone inside of buildCurrentMapOfUsageData
			// Previous implementation passed actionData.data to buildCurrentMapOfUsageData which feels wrong but seems to work
			JSON.parse(actionData.data, reviver),
			newRecords,
			actionData.parsedAndValidatedFormSchema,
			actionData.convertedDatesTIWD,
			actionData.state_id,
			actionData.county_id,
			setUsageData,
		)
	}

	// FIX: only update usageData when form submitted
	// actionData was updated which means that the user submitted a new bill and usageData must be reset
	useEffect(() => {
		if (actionData !== undefined && hasDataProperty(actionData)) {
			const usageDataAsMap = JSON.parse(actionData.data, reviver) as Map<
				any,
				any
			>
			const newUsageData = buildCurrentUsageData(usageDataAsMap)
			setUsageData(newUsageData)
		}
	}, [actionData])

	return {
		usageData,
		toggleBillingPeriod,
	}
}

export default useUsageData
