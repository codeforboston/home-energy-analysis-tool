import { Checkbox } from '../../../../components/ui/checkbox.tsx'

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../../../../components/ui/table.tsx'

const months = [
	{
		includeData: true,
		startDate: '02/02/2018',
		endDate: '02/28/2018',
		daysInBill: '27',
		usage: 'Yes',
		fUA: '10',
	},
	{
		includeData: true,
		startDate: '03/01/2018',
		endDate: '03/31/2018',
		daysInBill: '31',
		usage: 'Modest',
		fUA: '30',
	},
]

export function EnergyUseHistoryChart() {
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead className="w-[100px]">#</TableHead>
					<TableHead>Include Data</TableHead>
					<TableHead>Start Date</TableHead>
					<TableHead>End Date</TableHead>
					<TableHead>Days in Bill</TableHead>
					<TableHead>Usage (therms)</TableHead>
					<TableHead>60.5 °F UA (BTU/h-F)</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{months.map((month, index) => (
					<TableRow key={index}>
						<TableCell className="font-medium">{index + 1}</TableCell>
						<TableCell>
							<Checkbox checked={month.includeData} />
						</TableCell>
						<TableCell>{month.startDate}</TableCell>
						<TableCell>{month.endDate}</TableCell>
						<TableCell>{month.daysInBill}</TableCell>
						<TableCell>{month.usage}</TableCell>
						<TableCell>{month.fUA}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
