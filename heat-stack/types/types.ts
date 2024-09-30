import { type z } from 'zod'
import {
	type balancePointGraphRecordSchema,
	type balancePointGraphSchema,
	type summaryOutputSchema,
	type billingRecordSchema,
	type billingRecordsSchema,
	type usageDataSchema,
} from './index.ts'

export type BalancePointGraphRecordSchema = z.infer<typeof balancePointGraphRecordSchema>;
export type BalancePointGraphSchema = z.infer<typeof balancePointGraphSchema>;
export type SummaryOutputSchema = z.infer<typeof summaryOutputSchema>;
export type BillingRecordSchema = z.infer<typeof billingRecordSchema>;
export type BillingRecordsSchema = z.infer<typeof billingRecordsSchema>;
export type usageDataSchema = z.infer<typeof usageDataSchema>;