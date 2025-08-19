import { type z } from 'zod'
import { type TemperatureInputDataConverted } from '#app/utils/WeatherUtil.ts'
import { type UsageDataSchema } from './types'
import {
	HomeSchema,
	LocationSchema,
	CaseSchema /* validateNaturalGasUsageData, HeatLoadAnalysisZod */,
	UploadEnergyUseFileSchema,
} from '.'

/** Modeled off the conform example at
 *     https://github.com/epicweb-dev/web-forms/blob/b69e441f5577b91e7df116eba415d4714daacb9d/exercises/03.schema-validation/03.solution.conform-form/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L48 */

export const HomeFormSchema = HomeSchema.pick({ living_area: true })
	.and(LocationSchema.pick({ street_address: true, town: true, state: true }))
	.and(CaseSchema.pick({ name: true }))

export const CurrentHeatingSystemSchema = HomeSchema.pick({
	fuel_type: true,
	heating_system_efficiency: true,
	design_temperature_override: true,
	thermostat_set_point: true,
	setback_temperature: true,
	setback_hours_per_day: true,
})

export const Schema = UploadEnergyUseFileSchema.and(
	HomeFormSchema.and(CurrentHeatingSystemSchema),
) /* .and(HeatLoadAnalysisZod.pick({design_temperature: true})) */

export type SchemaZodFromFormType = z.infer<typeof Schema>

export type EnergyUsageSubmitActionData = {
	data: string
	parsedAndValidatedFormSchema: SchemaZodFromFormType
	convertedDatesTIWD: TemperatureInputDataConverted
	state_id: string | undefined
	county_id: string | number | undefined
	// Return case information for linking to case details
	caseInfo: {
		caseId: number | undefined
		analysisId: number | undefined
		heatingInputId: number | undefined
	}
}

// TypedMap is a utility that takes an object and create a new "Map" type
// that also preverses the return type for 'get' calls and input types for 'set' calls
export class TypedMap<T> extends Map<keyof T, T[keyof T]> {
	override get<K extends keyof T>(key: K): T[K] | undefined {
		return super.get(key) as T[K] | undefined
	}

	override set<K extends keyof T>(key: K, value: T[K]): this {
		return super.set(key, value)
	}
}

export type EnergyUsageSubmitActionDataAsMap =
	TypedMap<EnergyUsageSubmitActionData>

export type UsageDataAsMap = TypedMap<UsageDataSchema>
