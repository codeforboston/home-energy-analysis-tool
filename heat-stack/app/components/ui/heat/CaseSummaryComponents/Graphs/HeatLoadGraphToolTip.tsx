import React from 'react'

/**
 * CustomTooltip renders a tooltip for the heat load chart.
 * @param {object} props - The props containing data for the tooltip.
 * @returns {JSX.Element} - The rendered tooltip element.
 */
export const HeatLoadGraphToolTip = (props: any): JSX.Element => {
	const { payload } = props
	const temperature = payload ? payload?.temperature : null
	const value = payload ? payload?.value : null
	const name = payload ? payload?.name : ''

	if (temperature !== null) {
		// Return formatted output, ensuring the temperature is shown in color below the heat load value
		return (
			<div className="tooltip-content">
				<div>{`${Number(value).toLocaleString()} BTU/h`}</div>
				<div>{`${temperature}°F ${name.replace('Line', ' Heat Load').replace('Point', ' at Design Temperature')}`}</div>
			</div>
		)
	}

	// Fallback in case the temperature is not available
	return (
		<div className="tooltip-content">
			<div>{`${Number(value).toLocaleString()} BTU/h`}</div>
			<div>
				{name
					.replace('Line', ' Heat Load')
					.replace('Point', ' at Design Temperature')}
			</div>
		</div>
	)
}
