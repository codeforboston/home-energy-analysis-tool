import type { TooltipProps } from 'recharts'
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent'

interface CustomTooltipProps extends TooltipProps<ValueType, string> {
	active?: boolean
	payload?: {
		dataKey: string
		value: string | number
		name: string
		x?: string | number
		y?: number
		color?: string
	}[]
}

/**
 * Custom Tooltip component for rendering the content of the tooltip in Recharts.
 * The tooltip dynamically displays information based on the chart's hovered data point(s).
 *
 * @param {CustomTooltipProps} props - The properties for the CustomTooltip component.
 * @param {boolean} props.active - Indicates whether the tooltip is active or not.
 * @param {Array} props.payload - The array of data points for the tooltip, each with `dataKey`, `value`, `name`, etc.
 *
 * @returns {JSX.Element | null} The JSX element representing the tooltip content, or null if the tooltip is not active.
 */
export const CustomTooltip = ({
	active,
	payload,
}: CustomTooltipProps): JSX.Element | null => {
	if (active && payload && payload.length) {
		return (
			<div className="tooltip-content rounded border border-gray-300 bg-white p-2">
				{payload.map((item, index) => {
					const { dataKey, value, name } = item

					const formattedName = name || dataKey // Fallback to dataKey if no 'name' is available

					return (
						<div key={index}>
							{value !== undefined && ` ${formattedName}: ${value}`}
						</div>
					)
				})}
			</div>
		)
	}

	return null
}
