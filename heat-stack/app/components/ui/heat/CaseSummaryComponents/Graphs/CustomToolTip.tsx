import React from 'react'
import { TooltipProps } from 'recharts'

// Define a more specific type for the payload item
interface TooltipPayloadItem {
	dataKey: string
	value: number | string
	color?: string
	name?: string // The 'name' field will provide a more descriptive label
	[key: string]: any // Allow other properties in the payload item
}

// Define the complete type for CustomTooltipProps
interface CustomTooltipProps
	extends TooltipProps<{
		x: number | string
		y?: number
		color?: string
		[key: string]: any // To allow for other custom data in the payload
	}> {
	active?: boolean // Type for 'active' property
	payload?: TooltipPayloadItem[] // Type for 'payload', an array of TooltipPayloadItems
	label?: string // The label for the hovered data point (e.g., X-axis label)
	xLabel?: string // Label for the X-axis value
	yLabel?: string // Label for the Y-axis value
	unitX?: string // Unit for X values
	unitY?: string // Unit for Y values
}

export const CustomTooltip = ({
	active,
	payload,
	xLabel = 'X',
	yLabel = 'Y',
	unitX = '',
	unitY = '',
}: CustomTooltipProps) => {
	if (active && payload && payload.length) {
		return (
			<div className="tooltip-content rounded border border-gray-300 bg-white p-2">
				{/* Iterate over each payload item to render its data dynamically */}
				{payload.map((item, index) => {
					const { dataKey, value, name } = item
					const xValue = item.x !== undefined ? item.x : undefined
					const yValue = item.y !== undefined ? item.y : undefined

					// Use the 'name' property to display more descriptive labels
					const formattedName = name || dataKey // Fallback to dataKey if no 'name' is available

					return (
						<div key={index}>
							{xValue !== undefined && `${xLabel}: ${xValue}${unitX}`}
							{yValue !== undefined && ` ${yLabel}: ${yValue}${unitY}`}
							{value !== undefined && ` ${formattedName}: ${value}`}
						</div>
					)
				})}
			</div>
		)
	}

	return null
}
