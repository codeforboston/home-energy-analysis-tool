import React from 'react'

type DiamondShapeProps = {
	cx: number
	cy: number
	fillColor?: string
}

export const DiamondShape: React.FC<DiamondShapeProps> = ({
	cx,
	cy,
	fillColor = 'black',
}: DiamondShapeProps) => {
	return (
		<path
			d={`
                M ${cx} ${cy - 8} 
                L ${cx + 5} ${cy} 
                L ${cx} ${cy + 8} 
                L ${cx - 5} ${cy} 
                Z
            `}
			fill={fillColor}
		/>
	)
}
