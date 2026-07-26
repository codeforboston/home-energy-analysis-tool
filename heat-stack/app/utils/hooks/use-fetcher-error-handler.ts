import { useEffect } from 'react'
import { type Fetcher } from 'react-router'

/**
 * Format error message by extracting stack trace up to /app/ line or first 500 chars
 */
const USER_FACING_ERROR_MAP: Array<{ pattern: RegExp; message: string }> = [
	{
		pattern: /Could not determine natural gas company\./i,
		message:
			'Could not detect your bill format. Please upload a supported Eversource or National Grid gas bill CSV.',
	},
	{
		pattern: /time data '' does not match format '%m\/%d\/%Y'/i,
		message:
			'A billing row contains an empty start or end date. Check your CSV for blank date fields and upload a valid Eversource or National Grid file.',
	},
	{
		pattern: /time data .* does not match format/i,
		message:
			'A billing row contains a malformed date. Make sure the dates in your CSV use a supported format like MM/DD/YYYY or YYYY/MM/DD.',
	},
	{
		pattern: /mean requires at least one data point/i,
		message:
			'No valid billing records were found in your CSV. Please upload a file with at least three completed usage rows.',
	},
	{
		pattern: /header row not found in the csv data/i,
		message:
			'Could not find the expected billing header row in your CSV. Upload a valid National Grid or Eversource energy usage file.',
	},
	{
		pattern: /could not convert string to float: ''/i,
		message:
			'One or more numeric fields in your CSV are empty. Please fill in the missing values and try again.',
	},
]

export function formatErrorMessage(error: any): string {
	let errorMessage =
		typeof error === 'string' ? error : String(error?.message ?? error)

	for (const { pattern, message } of USER_FACING_ERROR_MAP) {
		if (pattern.test(errorMessage)) {
			return message
		}
	}

	const lines = errorMessage
		.split('\n')
		.map((line: string) => line.trim())
		.filter((line: string | any[]) => line.length > 0)

	const pythonErrorLine = lines.find((line: string) =>
		/^(ImportError|TypeError|ValueError|AttributeError|ZeroDivisionError|KeyError|IndexError|RuntimeError|PythonError):/.test(
			line,
		),
	)

	if (pythonErrorLine) {
		return pythonErrorLine.replace(/^PythonError:\s*/i, '')
	}

	const firstUsefulLine = lines.find(
		(line: string) =>
			!line.startsWith('Traceback') && !line.startsWith('File "/'),
	)

	if (firstUsefulLine) {
		errorMessage = firstUsefulLine
	}

	if (errorMessage.length > 500) {
		errorMessage = `${errorMessage.substring(0, 500)}...`
	}

	return errorMessage
}

/**
 * Custom hook to handle fetcher errors globally
 *
 * @param fetcher - React Router fetcher instance
 * @param onError - Callback to handle the error (e.g., show modal, toast, etc.)
 * @param onSuccess - Optional callback to handle successful responses
 *
 * @example
 * ```tsx
 * const fetcher = useFetcher()
 *
 * useFetcherErrorHandler(fetcher, (errorMessage) => {
 *   setErrorModal({
 *     isOpen: true,
 *     title: 'Server Error',
 *     message: errorMessage
 *   })
 * })
 * ```
 */
export function useFetcherErrorHandler(
	fetcher: Fetcher,
	onError: (errorMessage: string) => void,
	onSuccess?: () => void,
) {
	useEffect(() => {
		// Only process when fetcher has completed and returned data
		if (fetcher.state === 'idle' && fetcher.data) {
			const result = fetcher.data as any

			// Check if there's an error in the response
			if (result.error) {
				console.error('🔴 Error from server:', result.error)
				const errorMessage = formatErrorMessage(result.error)
				onError(errorMessage)
			} else if (onSuccess) {
				console.log('✅ Server action completed successfully')
				onSuccess()
			}
		}
	}, [fetcher.state, fetcher.data, onError, onSuccess])
}
