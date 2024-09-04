import { type z } from 'zod'
import { NaturalGasUsageData, type NaturalGasBillRecord as NaturalGasBillRecordZod } from '#types/index'
import { Checkbox } from '../../../../components/ui/checkbox.tsx'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../../../components/ui/table.tsx'
import { tr } from '@faker-js/faker'

// type NaturalGasBillRecord = z.infer<typeof NaturalGasBillRecordZod>
// const naturalGasBillRecord01: NaturalGasBillRecord = {
// 	periodStartDate: new Date('12/08/2017'),
// 	periodEndDate: new Date('01/07/2018'),
// 	usageTherms: 197,
// 	inclusionOverride: 'Include',
// }

// const naturalGasBillRecord02: NaturalGasBillRecord = {
// 	periodStartDate: new Date('01/08/2018'),
// 	periodEndDate: new Date('02/07/2018'),
// 	usageTherms: 205,
// 	inclusionOverride: 'Include',
// }

// const naturalGasBillRecord03: NaturalGasBillRecord = {
// 	periodStartDate: new Date('02/08/2018'),
// 	periodEndDate: new Date('03/07/2018'),
// 	usageTherms: 220,
// 	inclusionOverride: 'Include',
// }

// const naturalGasBillRecord04: NaturalGasBillRecord = {
// 	periodStartDate: new Date('03/08/2018'),
// 	periodEndDate: new Date('04/07/2018'),
// 	usageTherms: 196,
// 	inclusionOverride: 'Include',
// }

// const naturalGasBill = [
// 	naturalGasBillRecord01,
// 	naturalGasBillRecord02,
// 	naturalGasBillRecord03,
// 	naturalGasBillRecord04,
// ]

export function EnergyUseHistoryChart(props: z.infer<typeof NaturalGasUsageData>) {
	console.log("EnergyUseHistoryChart Component:", props.usage_data?.get('billing_records'))

	const billingRecords = props.usage_data?.get('billing_records')

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">#</TableHead>
					<TableHead>Allowed Usage</TableHead>
					<TableHead>Start Date</TableHead>
					<TableHead>End Date</TableHead>
					<TableHead>Days in Period</TableHead>
					<TableHead>Gas Usage (therms)</TableHead>
					<TableHead>Whole-home UA</TableHead>
					<TableHead>Override Default</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{/* {naturalGasBill.map((period, index) => { */}
				{billingRecords.map((period, index) => {
					console.log(period);

					const startDate = new Date(period.get('period_start_date'))
					const endDate = new Date(period.get('period_end_date'))

					const timeInPeriod = endDate.getTime() - startDate.getTime()
					const daysInPeriod = Math.round(timeInPeriod / (1000 * 3600 * 24))

					const analysisType = period.get('analysis_type')
					let analysisType_Image = null
					/* switch case for 1, -1, 0 */
					switch (analysisType){
						case 1:
							analysisType_Image = "Heating"
							break
						case -1:
							analysisType_Image = "Non-Heating"
							break
						case 0:
							analysisType_Image = "Not Allowed in Calculations"
							break
						}

					return (
						<TableRow key={index}>
							<TableCell className="font-medium">{index + 1}</TableCell>
							<TableCell>{analysisType_Image}</TableCell>
							<TableCell>{startDate.toLocaleDateString()}</TableCell>
							<TableCell>{endDate.toLocaleDateString()}</TableCell>
							<TableCell>{daysInPeriod}</TableCell>
							<TableCell>{period.get('usage')}</TableCell>
							<TableCell>
								{period.get('whole_home_heat_loss_rate')?
									period.get('whole_home_heat_loss_rate').toFixed(0)
									:
									"-"
								}
								</TableCell>
							<TableCell>
								<Checkbox checked={period.get('inclusion_override')} />
							</TableCell>
						</TableRow>
					)
				})}
			</TableBody>
		</Table>
	)
}
