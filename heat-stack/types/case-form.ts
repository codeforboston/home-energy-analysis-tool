// app/types/case-form.ts
import  { type SubmissionResult } from '@conform-to/react'
import { type z } from 'zod'
import { type  GetConvertedDatesTIWDResponse } from '#app/utils/date-temp-util.ts'
import {
	CaseSchema,
	HomeSchema,
	LocationSchema,
	UploadEnergyUseFileSchema,
} from '.'

/** TODO: Use url param "dev" to set defaults */
/** Modeled off the conform example at
 *     https://github.com/epicweb-dev/web-forms/blob/b69e441f5577b91e7df116eba415d4714daacb9d/exercises/03.schema-validation/03.solution.conform-form/app/routes/users%2B/%24username_%2B/notes.%24noteId_.edit.tsx#L48 */

const HomeFormSchema = HomeSchema.pick({ living_area: true })
	.and(LocationSchema.pick({ street_address: true, town: true, state: true }))
	.and(CaseSchema.pick({ name: true }))

const CurrentHeatingSystemSchema = HomeSchema.pick({
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

export interface CaseInfo {
	caseId?: number
	analysisId?: number
	heatingInputId?: number
}

export interface LoaderData {
	isDevMode: boolean
}

export interface ActionData {
	submitResult: SubmissionResult<string[]>
	data?: string
	parsedAndValidatedFormSchema?: SchemaZodFromFormType
	convertedDatesTIWD?: GetConvertedDatesTIWDResponse
	state_id?: string
	county_id?: string | number
	caseInfo?: CaseInfo
}
