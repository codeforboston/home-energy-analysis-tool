import { type z } from 'zod'
import {
	type balancePointGraphRecordSchema,
	type balancePointGraphSchema,
	type summaryOutputSchema,
	type oneProcessedEnergyBillSchema,
	type allProcessedEnergyBillsSchema,
	type usageDataSchema,
	type naturalGasUsageSchema,
	heatLoadGraphRecordSchema
} from './index.ts'


export type NaturalGasUsageDataSchema = z.infer<typeof naturalGasUsageSchema>;
export type BalancePoointGraphRecordSchema = z.infer<typeof balancePointGraphRecordSchema>;
export type BalancePintGraphSchema = z.infer<typeof balancePointGraphSchema>;
export type SummaryOutputSchema = z.infer<typeof summaryOutputSchema>;
export type BillingRecordSchema = z.infer<typeof oneProcessedEnergyBillSchema>;
export type BillingRecordsSchema = z.infer<typeof allProcessedEnergyBillsSchema>;
export type UsageDataSchema = z.infer<typeof usageDataSchema>;
export type HeatLoadGraphRecordSchema = z.infer<typeof heatLoadGraphRecordSchema>;