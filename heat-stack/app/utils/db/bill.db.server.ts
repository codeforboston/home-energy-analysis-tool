import { prisma } from '#app/utils/db.server.ts'

export async function insertProcessedBills(
	analysisId: number,
	gasBillDataFromTextFile: any,
) {
	if (!gasBillDataFromTextFile?.processed_energy_bills?.length) return 0

	const bills = gasBillDataFromTextFile.processed_energy_bills.map(
		(bill: any) => ({
			analysisInputId: analysisId,
			periodStartDate: new Date(bill.period_start_date),
			periodEndDate: new Date(bill.period_end_date),
			usageQuantity: bill.usage,
			wholeHomeHeatLossRate: bill.whole_home_heat_loss_rate,
			analysisType: bill.analysis_type,
			defaultInclusion: bill.default_inclusion,
			invertDefaultInclusion: bill.inclusion_override,
		}),
	)

	await prisma.processedEnergyBill.createMany({ data: bills })

	console.log(`✅ Inserted ${bills.length} ProcessedEnergyBill records`)
	return bills.length
}

export async function deleteBillsForAnalysis(analysisInputId: number) {
	const deleted = await prisma.processedEnergyBill.deleteMany({
		where: { analysisInputId },
	})
	console.log(`🗑️ Deleted ${deleted.count} ProcessedEnergyBill records`)
	return deleted.count
}
