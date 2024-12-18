import React from 'react'
import { Graphs } from '../../components/ui/heat/CaseSummaryComponents/HeatLoadAnalysis.tsx'
import { HeatLoadGraphRecordSchema } from '../../../types/types.ts'

type HeatLoadRecord = Map<
	| 'balance_point'
	| 'heat_loss_rate'
	| 'change_in_heat_loss_rate'
	| 'percent_change_in_heat_loss_rate'
	| 'standard_deviation',
	number
>

interface HeatLoadAnalysisProps {
	heatLoadData: HeatLoadRecord[]
}

/**
 * Transforms raw heat load data into a schema-compliant format suitable for graphing.
 * Each record is mapped to an object adhering to the HeatLoadGraphRecordSchema.
 *
 * @param {HeatLoadRecord[]} data - Array of heat load records as Maps.
 * @returns {HeatLoadGraphRecordSchema[]} Transformed data with `balance_point` and `heat_loss_rate`.
 */
function transformHeatLoadData(
	data: HeatLoadRecord[],
): HeatLoadGraphRecordSchema[] {
	return data
		.map((record) => {
			const balancePoint = record.get('balance_point')
			const heatLossRate = record.get('heat_loss_rate')
			if (
				typeof balancePoint === 'number' &&
				typeof heatLossRate === 'number'
			) {
				return {
					balance_point: balancePoint,
					heat_loss_rate: heatLossRate,
				}
			}
			return null
		})
		.filter((item): item is HeatLoadGraphRecordSchema => item !== null)
}

export default function HeatLoadAnalysis({
	heatLoadData,
}: HeatLoadAnalysisProps) {
	return <Graphs heatLoadData={transformHeatLoadData(heatLoadData)} />
}
