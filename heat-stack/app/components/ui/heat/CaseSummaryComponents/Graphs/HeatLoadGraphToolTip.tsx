type HeatLoadGraphToolTipProps = {
    payload?: Array<{ payload: { temperature?: number }; value?: number; name?: string }>
}

/**
 * CustomTooltip renders a tooltip for the heat load chart.
 * @param {object} props - The props containing data for the tooltip.
 * @returns {React.ReactElement} - The rendered tooltip element.
 */
export const HeatLoadGraphToolTip = (
    props: HeatLoadGraphToolTipProps,
): React.ReactElement  => {
    const { payload } = props
    const temperature = payload?.[0]?.payload?.temperature ?? null
    const value = payload?.[0]?.value ?? null
    const name = payload?.[0]?.name ?? ''

    if (temperature !== null) {
        return (
            <div className="tooltip-content rounded border border-gray-300 bg-white p-2">
                <div>{`${Number(value).toLocaleString()} BTU/h`}</div>
                <div>{`${temperature}°F ${name.replace('Line', ' Heat Load').replace('Point', ' at Design Temperature')}`}</div>
            </div>
        )
    }

    return (
        <div className="tooltip-content rounded border border-gray-300 bg-white p-2">
            <div>{`${Number(value).toLocaleString()} BTU/h`}</div>
            <div>
                {name.replace('Line', ' Heat Load').replace('Point', ' at Design Temperature')}
            </div>
        </div>
    )
}
