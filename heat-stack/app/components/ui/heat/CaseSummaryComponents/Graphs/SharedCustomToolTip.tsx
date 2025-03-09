import  { type TooltipProps } from 'recharts'
import  { type ValueType } from 'recharts/types/component/DefaultTooltipContent'

interface SharedCustomTooltipProps extends TooltipProps<ValueType, string> {
	active?: boolean
	payload?: {
		dataKey: string
		value: string | number
		name?: string
		payload?: {
			x: number
			y: number
			color: string
			label?: string
			name?: string
		}
		x?: string | number
		y?: number
		color?: string
	}[]
}

/**
 * Custom Tooltip component for rendering the content of the tooltip in Recharts.
 * The tooltip dynamically displays information based on the chart's hovered data point(s),
 * with special styling for "This Home" data points.
 *
 * @param {SharedCustomTooltipProps} props - The properties for the CustomTooltip component.
 * @param {boolean} props.active - Indicates whether the tooltip is active or not.
 * @param {Array} props.payload - The array of data points for the tooltip, each with `dataKey`, `value`, `name`, etc.
 *
 * @returns {JSX.Element | null} The JSX element representing the tooltip content, or null if the tooltip is not active.
 */
export const SharedCustomTooltip = ({
	active,
	payload,
}: SharedCustomTooltipProps): React.ReactElement | null => {
	if (active && payload && payload.length) {
		// Check if this is "This Home" data point
		const isThisHome = payload[0]?.payload?.name === 'This Home' || 
		                  payload[0]?.payload?.label === 'This Home';
		
		return (
			<div className={`tooltip-content rounded border ${isThisHome ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-white'} p-2 shadow-md`}>
				{isThisHome && (
					<div className="font-bold text-orange-600 mb-1">This Home</div>
				)}
				
				<div className="grid grid-cols-2 gap-x-2">
					<div className="text-gray-600">Living Area:</div>
					<div className="text-right font-medium">{payload[0]?.payload?.x || 0} sf</div>
					
					<div className="text-gray-600">Heat Loss Rate:</div>
					<div className="text-right font-medium">{payload[0]?.payload?.y || 0} BTU/h-°F</div>
				</div>
			</div>
		)
	}

	return null
}