import { useEffect } from 'react'
import { type Fetcher } from 'react-router'

/**
 * Format error message by extracting stack trace up to /app/ line or first 500 chars
 */
export function formatErrorMessage(error: any): string {
	let errorMessage = typeof error === 'string' ? error : error?.message || String(error)
	
	// If error has a stack trace, extract up to /app/ line or first 500 chars
	if (typeof errorMessage === 'string') {
		const lines = errorMessage.split('\n')
		
		// For Python errors, extract the main error message and relevant parts
		if (errorMessage.includes('PythonError:') || errorMessage.includes('ImportError:') || errorMessage.includes('Traceback')) {
			// Find the actual Python exception (last non-empty line before JS stack)
			const pythonErrorLine = lines.find(line => 
				line.match(/^(ImportError|TypeError|ValueError|AttributeError|ZeroDivisionError|KeyError|IndexError|RuntimeError|PythonError):/))
			
			if (pythonErrorLine) {
				// Also include the file/line info if available
				const fileLineIndex = lines.findIndex(line => line.includes('File "/'))
				if (fileLineIndex !== -1) {
					const fileInfo = lines.slice(fileLineIndex, fileLineIndex + 2).join('\n')
					return `${pythonErrorLine}\n\n${fileInfo}`
				}
				return pythonErrorLine
			}
		}
		
		// Look for /app/ line in stack trace
		const appLineIndex = lines.findIndex(line => line.includes('/app/'))
		
		if (appLineIndex !== -1) {
			// Include up to and including the line with "/app/"
			errorMessage = lines.slice(0, appLineIndex + 1).join('\n')
		} else if (errorMessage.length > 500) {
			// Take first 500 characters if no /app/ line found
			errorMessage = errorMessage.substring(0, 500) + '...'
		}
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
	onSuccess?: () => void
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
