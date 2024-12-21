type HeatLoadGridProps = {
	setPoint: number
	averageHeatLoad: number
	maxHeatLoad: number
}

/**
 * HeatLoadGrid is a stateless functional component that displays key summary data
 * in a grid format. The grid includes the set point temperature, maximum heat load,
 * and average heat load values.
 *
 * @component
 * @param {HeatLoadGridProps} props - The props for the HeatLoadGrid component.
 * @param {number} props.setPoint - The set point temperature in degrees Fahrenheit.
 * @param {number} props.averageHeatLoad - The average heat load in BTU/h.
 * @param {number} props.maxHeatLoad - The maximum heat load in BTU/h.
 * @returns {JSX.Element} - A styled grid displaying the set point, max heat load, and average heat load.
 */
export const HeatLoadGrid = ({
	setPoint,
	averageHeatLoad,
	maxHeatLoad,
}: HeatLoadGridProps) => {
	return (
		<div className="container mx-auto p-4">
			<div className="grid grid-cols-3 gap-4">
				{/* Grid Item 1 */}
				<div className="flex items-center justify-center border-r-2 border-gray-300 p-6">
					<div className="flex flex-col items-center">
						<div className="text-gray-500">Set Point</div>
						<div className="font-semibold">{`${setPoint} °F`}</div>
					</div>
				</div>

				{/* Grid Item 2 */}
				<div className="flex items-center justify-center border-r-2 border-gray-300 p-6">
					<div className="flex flex-col items-center">
						<div className="text-gray-500">Max Heat Load</div>
						<div className="font-semibold">{`${maxHeatLoad} BTU/h`}</div>
					</div>
				</div>

				{/* Grid Item 3 */}
				<div className="flex items-center justify-center p-6">
					<div className="flex flex-col items-center">
						<div className="text-gray-500">Average Heat Load</div>
						<div className="font-semibold">{`${averageHeatLoad} BTU/h`}</div>
					</div>
				</div>
			</div>
		</div>
	)
}
