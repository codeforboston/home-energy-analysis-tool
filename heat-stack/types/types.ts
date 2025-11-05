import { type z } from 'zod'
import {
	type balancePointGraphRecordSchema,
	type balancePointGraphSchema,
	type summaryOutputSchema,
	type oneProcessedEnergyBillSchema,
	type allProcessedEnergyBillsSchema,
	type usageDataSchema,
	type naturalGasUsageSchema,
} from './index.ts'

export type NaturalGasUsageDataSchema = z.infer<typeof naturalGasUsageSchema>
export type BalancePoointGraphRecordSchema = z.infer<
	typeof balancePointGraphRecordSchema
>
export type BalancePointGraphSchema = z.infer<typeof balancePointGraphSchema>
export type SummaryOutputSchema = z.infer<typeof summaryOutputSchema>
export type BillingRecordSchema = z.infer<typeof oneProcessedEnergyBillSchema>
export type BillingRecordsSchema = z.infer<typeof allProcessedEnergyBillsSchema>
export type UsageDataSchema = z.infer<typeof usageDataSchema>
