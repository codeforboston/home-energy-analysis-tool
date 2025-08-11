import {
	type UsageDataSchema,
	type BillingRecordsSchema,
	type BalancePointGraphSchema,
	type SummaryOutputSchema,
} from '#/types/types.ts'
import { type RecalculateFunction } from '#app/utils/hooks/use-rules-engine.ts'
import { Checkbox } from '../../../../components/ui/checkbox.tsx'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../../../components/ui/table.tsx'

import HeatingUsage from './assets/HeatingUsage.svg'
import NonHeatingUsage from './assets/NonHeatingUsage.svg'
import NotAllowedInCalculations from './assets/NotAllowedInCalculations.svg'

// type NaturalGasBillRecord = z.infer<typeof NaturalGasBillRecordZod>
// const naturalGasBillRecord01: NaturalGasBillRecord = {
// 	periodStartDate: new Date('12/08/2017'),
// 	periodEndDate: new Date('01/07/2018'),
// 	usageQuantity: 197,
// 	inclusionOverride: 'Include',
// }

// const naturalGasBillRecord02: NaturalGasBillRecord = {
// 	periodStartDate: new Date('01/08/2018'),
// 	periodEndDate: new Date('02/07/2018'),
// 	usageQuantity: 205,
// 	inclusionOverride: 'Include',
// }

// const naturalGasBillRecord03: NaturalGasBillRecord = {
// 	periodStartDate: new Date('02/08/2018'),
// 	periodEndDate: new Date('03/07/2018'),
// 	usageQuantity: 220,
// 	inclusionOverride: 'Include',
// }

// const naturalGasBillRecord04: NaturalGasBillRecord = {
// 	periodStartDate: new Date('03/08/2018'),
// 	periodEndDate: new Date('04/07/2018'),
// 	usageQuantity: 196,
// 	inclusionOverride: 'Include',
// }

// const naturalGasBill = [
// 	naturalGasBillRecord01,
// 	naturalGasBillRecord02,
// 	naturalGasBillRecord03,
// 	naturalGasBillRecord04,
// ]

interface EnergyUseHistoryChartProps {
	lastActionData: any
	usageData: UsageDataSchema
	onClick: (index: number) => void
}

export function EnergyUseHistoryChart({
	lastActionData: lastActionData,
	usageData,
	onClick,
}: EnergyUseHistoryChartProps) {
	console.log('Energy: reneder>', {
		lastActionData,
		usageData,
	})

	return (
		<Table
			id="EnergyUseHistoryChart"
			data-testid="EnergyUseHistoryChart"
			className="rounded-md border border-neutral-300 text-center"
		>
			<TableHeader>
				<TableRow className="bg-neutral-50 text-xs text-muted-foreground">
					<TableHead className="text-center">#</TableHead>
					<TableHead className="text-center">
						<div className="flex flex-row">
							<div className="text-right">Allowed Usage</div>
							{/* TODO: add help text */}
							{/* <img src={HelpCircle} alt='help text' className='pl-2'/> */}
						</div>
					</TableHead>

					<TableHead className="text-center">Start Date</TableHead>
					<TableHead className="text-center">End Date</TableHead>
					<TableHead className="text-center">Days in Period</TableHead>
					<TableHead className="text-center">Gas Usage (therms)</TableHead>
					<TableHead className="text-center">
						Whole-home UA (BTU/h-°F)
					</TableHead>
					<TableHead className="text-center">
						<div className="flex flex-row">
							<div className="text-right">Override Default</div>
							{/* TODO: add help text */}
							{/* <img src={HelpCircle} alt='help text' className='pl-2'/> */}
						</div>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{usageData.processed_energy_bills.map((period, index) => {
					const startDate = new Date(period.period_start_date)
					const endDate = new Date(period.period_end_date)

					// Calculate days in period
					const timeInPeriod = endDate.getTime() - startDate.getTime()
					const daysInPeriod = Math.round(timeInPeriod / (1000 * 3600 * 24))

					// Set Analysis Type image and checkbox setting
					const analysisType = period.analysis_type
					let analysisType_Image = undefined
					let overrideCheckboxDisabled = false

					/* switch case for 1, -1, 0 */
					switch (analysisType) {
						case 1:
							analysisType_Image = HeatingUsage
							break
						case -1:
							analysisType_Image = NonHeatingUsage
							break
						case 0:
							analysisType_Image = NotAllowedInCalculations
							overrideCheckboxDisabled = true
							break
					}

					// Adjust inclusion for user input
					let calculatedInclusion = period.default_inclusion
					if (period.inclusion_override) {
						calculatedInclusion = !calculatedInclusion
					}

					const variant = calculatedInclusion ? 'included' : 'excluded'

					return (
						<TableRow key={index} variant={variant}>
							<TableCell className="font-medium">{index + 1}</TableCell>
							<TableCell className="justify-items-center">
								<img src={analysisType_Image} alt="Analysis Type" />
							</TableCell>
							<TableCell>{startDate.toLocaleDateString()}</TableCell>
							<TableCell>{endDate.toLocaleDateString()}</TableCell>
							<TableCell>{daysInPeriod}</TableCell>
							<TableCell>{period.usage}</TableCell>
							<TableCell>
								{period.whole_home_heat_loss_rate
									? period.whole_home_heat_loss_rate.toFixed(0)
									: '-'}
							</TableCell>
							<TableCell>
								<Checkbox
									checked={period.inclusion_override}
									disabled={overrideCheckboxDisabled}
									onClick={() => onClick(index)}
								/>
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	)
}
