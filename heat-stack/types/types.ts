import { type z } from 'zod'
import {
	type balancePointGraphRecordSchema,
	type balancePointGraphSchema,
	type summaryOutputSchema,
	type oneBillingRecordSchema,
	type allBillingRecordsSchema,
	type usageDataSchema,
	type naturalGasUsageSchema
} from './index.ts'


export type NaturalGasUsageDataSchema = z.infer<typeof naturalGasUsageSchema>;
export type BalancePoointGraphRecordSchema = z.infer<typeof balancePointGraphRecordSchema>;
export type BalancePintGraphSchema = z.infer<typeof balancePointGraphSchema>;
export type SummaryOutputSchema = z.infer<typeof summaryOutputSchema>;
export type BillingRecordSchema = z.infer<typeof oneBillingRecordSchema>;
export type BillingRecordsSchema = z.infer<typeof allBillingRecordsSchema>;
export type UsageDataSchema = z.infer<typeof usageDataSchema>;