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

type NaturalGasBillRecord = z.infer<typeof NaturalGasBillRecordZod>
const naturalGasBillRecord01: NaturalGasBillRecord = {
	periodStartDate: new Date('12/08/2017'),
	periodEndDate: new Date('01/07/2018'),
	usageTherms: 197,
	inclusionOverride: 'Include',
}

const naturalGasBillRecord02: NaturalGasBillRecord = {
	periodStartDate: new Date('01/08/2018'),
	periodEndDate: new Date('02/07/2018'),
	usageTherms: 205,
	inclusionOverride: 'Include',
}

const naturalGasBillRecord03: NaturalGasBillRecord = {
	periodStartDate: new Date('02/08/2018'),
	periodEndDate: new Date('03/07/2018'),
	usageTherms: 220,
	inclusionOverride: 'Include',
}

const naturalGasBillRecord04: NaturalGasBillRecord = {
	periodStartDate: new Date('03/08/2018'),
	periodEndDate: new Date('04/07/2018'),
	usageTherms: 196,
	inclusionOverride: 'Include',
}

const naturalGasBill = [
	naturalGasBillRecord01,
	naturalGasBillRecord02,
	naturalGasBillRecord03,
	naturalGasBillRecord04,
]

export function EnergyUseHistoryChart(props: z.infer<typeof NaturalGasUsageData>) {
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
				{props.usage_data.get("records").get("billing_records").map((period, index) => {
					console.log(period);
					period.get("usage");
					return <div>Placeholder</div>;
					// const timeInPeriod =
					// 	period.periodEndDate.getTime() - period.periodStartDate.getTime()
					// const daysInPeriod = Math.round(timeInPeriod / (1000 * 3600 * 24))

					// return (
					// 	<TableRow key={index}>
					// 		<TableCell className="font-medium">{index + 1}</TableCell>
					// 		<TableCell>
					// 			{period.usage}
					// 		</TableCell>
					// 		<TableCell>
					// 			{period.periodStartDate.toLocaleDateString()}
					// 		</TableCell>
					// 		<TableCell>{period.periodEndDate.toLocaleDateString()}</TableCell>
					// 		<TableCell>{daysInPeriod}</TableCell>
					// 		<TableCell>{period.usageTherms}</TableCell>
					// 		<TableCell>0</TableCell>
					// 		<TableCell>
					// 			<Checkbox checked={period.inclusionOverride == 'Include'} />
					// 		</TableCell>
					// 	</TableRow>
					// )
				})}
			</TableBody>
		</Table>
	)
}
