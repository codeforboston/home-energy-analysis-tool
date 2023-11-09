import {
	ScatterChart,
	Scatter,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from 'recharts'

const data = [
	{ x: 2702, y: 1092 },
	{ x: 4000, y: 1155 },
	{ x: 1851, y: 464 },
	{ x: 1112, y: 218 },
	{ x: 3000, y: 733 },
	{ x: 2100, y: 798 },
	{ x: 2454, y: 475 },
	{ x: 1229, y: 341 },
	{ x: 2000, y: 720 },
	{ x: 3946, y: 648 },
	{ x: 1960, y: 477 },
	{ x: 1800, y: 551 },
	{ x: 2992, y: 751 },
	{ x: 2342, y: 698 },
	{ x: 1728, y: 290 },
	{ x: 2440, y: 977 },
	{ x: 3891, y: 1300 },
	{ x: 1906, y: 958 },
	{ x: 2835, y: 967 },
	{ x: 3459, y: 975 },
	{ x: 3459, y: 809 },
	{ x: 4230, y: 1684 },
	{ x: 4250, y: 1265 },
	{ x: 3604, y: 1422 },
	{ x: 2033, y: 715 },
	{ x: 4000, y: 1124 },
	{ x: 3028, y: 1519 },
	{ x: 3254.6, y: 872 },
	{ x: 3514, y: 743 },
	{ x: 1896, y: 728 },
	{ x: 3878, y: 1011 },
	{ x: 2760, y: 792 },
	{ x: 3262, y: 1066 },
	{ x: 3850, y: 1128 },
	{ x: 1559, y: 528 },
	{ x: 2133, y: 709 },
	{ x: 2400, y: 994 },
	{ x: 3370, y: 1072 },
	{ x: 1662, y: 775 },
	{ x: 1533, y: 645 },
	{ x: 2600, y: 587 },
	{ x: 2155, y: 654 },
	{ x: 2200, y: 567 },
	{ x: 1999, y: 716 },
	{ x: 2400, y: 758 },
	{ x: 2492, y: 858 },
	{ x: 3120, y: 857 },
	{ x: 3398, y: 1147 },
	{ x: 4857, y: 1085 },
	{ x: 3254, y: 723 },
	{ x: 2584, y: 872 },
	{ x: 2688, y: 670 },
	{ x: 864, y: 479 },
	{ x: 2110, y: 609 },
	{ x: 1500, y: 767 },
	{ x: 2803, y: 648 },
	{ x: 1157, y: 340 },
	{ x: 5000, y: 1485 },
	{ x: 2228, y: 627 },
	{ x: 1258, y: 417 },
	{ x: 2500, y: 951 },
	{ x: 1700, y: 721 },
	{ x: 3066, y: 1622 },
	{ x: 2485, y: 735 },
	{ x: 1300, y: 435 },
	{ x: 1600, y: 356 },
	{ x: 2716, y: 820 },
	{ x: 3000, y: 1207 },
	{ x: 2000, y: 599 },
	{ x: 1980, y: 513 },
	{ x: 2500, y: 901 },
	{ x: 2940, y: 1020 },
	{ x: 2078, y: 699 },
	{ x: 2824, y: 849 },
	{ x: 2140, y: 913 },
	{ x: 2765, y: 900 },
	{ x: 3378, y: 944 },
	{ x: 3111, y: 823 },
	{ x: 2200, y: 680 },
	{ x: 3800, y: 1057 },
	{ x: 1638, y: 849 },
	{ x: 2076, y: 992 },
	{ x: 3740, y: 1207 },
	{ x: 1566, y: 398 },
	{ x: 2508, y: 867 },
	{ x: 1518, y: 480 },
	{ x: 1361, y: 565 },
	{ x: 3886, y: 985 },
	{ x: 2263, y: 1042 },
	{ x: 1970, y: 479 },
	{ x: 2133, y: 564 },
	{ x: 1624, y: 571 },
	{ x: 2093, y: 418 },
	{ x: 2028, y: 651 },
	{ x: 2849, y: 799 },
]

export function WholeHomeUAComparison() {
	return (
		<div>
			<div className="item-title">Whole Home UA Comparison</div>

			<ResponsiveContainer width="100%" height={400}>
				<ScatterChart
					margin={{
						top: 20,
						right: 20,
						bottom: 20,
						left: 100,
					}}
				>
					<CartesianGrid />
					<XAxis type="number" dataKey="x" name="Living Area" unit=" sf" />
					<YAxis
						type="number"
						dataKey="y"
						name="Whole-home UA"
						unit="BTU/h-°F"
					/>
					<Tooltip cursor={{ strokeDasharray: '3 3' }} />
					<Scatter name="Whole Home UA Comparison" data={data} fill="#8884d8" />
				</ScatterChart>
			</ResponsiveContainer>
		</div>
	)
}
