type ShapeProps = {
	cx?: number
	cy?: number
	fill?: string
}

export function DiamondShape({ cx, cy, fill = '#000' }: ShapeProps) {
	if (cx == null || cy == null) {
		return null
	}
	const size = 10

	return (
		<polygon
			points={`
        ${cx},${cy - size}
        ${cx + size},${cy}
        ${cx},${cy + size}
        ${cx - size},${cy}
      `}
			fill={fill}
		/>
	)
}

export function SquareShape({ cx, cy, fill = '#000' }: ShapeProps) {
	if (cx == null || cy == null) {
		return null
	}

	const size = 8

	return (
		<rect
			x={cx - size}
			y={cy - size}
			width={size * 2}
			height={size * 2}
			fill={fill}
		/>
	)
}
