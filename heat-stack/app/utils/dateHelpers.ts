// dateHelpers.ts
// Utility functions for date formatting and parsing

export const formatDateString = (date: Date): string => {
	return date.toISOString().split('T')[0] || date.toISOString().slice(0, 10)
}

export function parseOrDefaultDates(
	startDateString: string,
	endDateString: string,
): { start_date: Date; end_date: Date } {
	if (
		typeof startDateString !== 'string' ||
		typeof endDateString !== 'string'
	) {
		throw new Error('Start date or end date is missing or invalid')
	}

	const today = new Date()
	const twoYearsAgo = new Date(today)
	twoYearsAgo.setFullYear(today.getFullYear() - 2)

	let start_date = new Date(startDateString)
	let end_date = new Date(endDateString)

	if (isNaN(start_date.getTime())) {
		console.warn('Invalid start date, using date from 2 years ago')
		start_date = twoYearsAgo
	}
	if (isNaN(end_date.getTime())) {
		console.warn("Invalid end date, using today's date")
		end_date = today
	}

	return { start_date, end_date }
}
