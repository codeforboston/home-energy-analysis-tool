import React, { useState, useEffect, useRef } from 'react'
import { Search, MapPin, X } from 'lucide-react'

// Client-side GeocodeUtil that uses our API route
interface GeocodeResult {
  coordinates?: {
    x: number
    y: number
  }
  state_id?: string
  county_id?: string
  addressComponents?: {
    street: string
    city: string
    state: string
    zip: string
    formattedAddress: string
  } | null
}

interface ErrorData {
  error?: string;
}

function isErrorData(data: unknown): data is ErrorData {
  return typeof data === 'object' && data !== null && 'error' in data;
}

class GeocodeUtilClient {
  async getLL(address: string): Promise<GeocodeResult> {
    try {
      const params = new URLSearchParams({ address })
      const response = await fetch(`/api/geocode?${params.toString()}`)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        if (isErrorData(errorData)) {
            throw new Error(errorData.error || `HTTP ${response.status}`);
        } else {
            throw new Error(`HTTP ${response.status}`);
        }
      }

      const result = await response.json() as GeocodeResult
      return result
    } catch (error) {
      console.error('Geocoding error:', error)
      return {
        coordinates: undefined,
        state_id: undefined,
        county_id: undefined,
        addressComponents: null
      }
    }
  }
}
// Main component
interface AddressAutofillProps {
	onAddressSelect?: (address: any) => void
	placeholder?: string
	className?: string
	disabled?: boolean
}
export const AddressAutofill: React.FC<AddressAutofillProps> = ({
	onAddressSelect,
	placeholder = 'Enter address...',
	className = '',
	disabled = false,
}) => {
	const [inputValue, setInputValue] = useState('')
	const [suggestions, setSuggestions] = useState<any[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [isOpen, setIsOpen] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(-1)

	const inputRef = useRef<HTMLInputElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const geocoder = useRef(new GeocodeUtilClient())
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const searchAddresses = async (query: string) => {
		if (query.length < 3) {
			setSuggestions([])
			setIsOpen(false)
			return
		}
		setIsLoading(true)
		try {
			// For demo purposes, we'll search common address variations
			const searchQueries = [
				query,
				`${query}, USA`,
				query.includes(',') ? query : `${query}, United States`,
			]
            console.log("address-geocode-lookup:144 searchQueries:", searchQueries)
			const results = []
            console.log("address-geocode-lookup:146 searchQueries.slice(0, 1):", searchQueries.slice(0, 1))
			for (const searchQuery of searchQueries.slice(0, 1)) {
                console.log("searchQuery", searchQuery);
				// Only search first to avoid rate limiting
				try {
					const result = await geocoder.current.getLL(searchQuery)
                    console.log("address-geocode-lookup:150 result:", result)
					if (result.addressComponents) {
						results.push(result)
					}
				} catch (error) {
					console.warn('Geocoding error:', error)
				}
			}
            console.log("address-geocode-lookup:144 results:", results)
			setSuggestions(results)
			setIsOpen(results.length > 0)
			setSelectedIndex(-1)
		} catch (error) {
			console.error('Address search error:', error)
			setSuggestions([])
			setIsOpen(false)
		} finally {
			setIsLoading(false)
		}
	}
	const debouncedSearch = (query: string) => {
		if (debounceRef.current) {
			clearTimeout(debounceRef.current)
		}
		debounceRef.current = setTimeout(async () => {
			try {
				const result = await searchAddresses(query);
                console.log("address-geocode-lookup:177 result of searchAddresses(query)", result);
                return result;
			} catch (error) {
				console.error('Error in debounced search:', error)
			}
		}, 300)
	}
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setInputValue(value)
		debouncedSearch(value)
	}
	const handleSuggestionClick = (suggestion: any) => {
		const formattedAddress =
			suggestion.addressComponents?.formattedAddress || inputValue
		setInputValue(formattedAddress)
		setIsOpen(false)
		setSuggestions([])
		onAddressSelect?.(suggestion)
	}
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!isOpen) return
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault()
				setSelectedIndex((prev) =>
					prev < suggestions.length - 1 ? prev + 1 : prev,
				)
				break
			case 'ArrowUp':
				e.preventDefault()
				setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
				break
			case 'Enter':
				e.preventDefault()
				if (selectedIndex >= 0 && suggestions[selectedIndex]) {
					handleSuggestionClick(suggestions[selectedIndex])
				}
				break
			case 'Escape':
				setIsOpen(false)
				setSelectedIndex(-1)
				break
		}
	}
	const clearInput = () => {
		setInputValue('')
		setSuggestions([])
		setIsOpen(false)
		inputRef.current?.focus()
	}

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	return (
		<div className={`relative w-full ${className}`} ref={dropdownRef}>
			<div className="relative">
				<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					{isLoading ? (
						<div className="h-4 w-4 animate-spin rounded-full border-b-2 border-gray-500"></div>
					) : (
						<Search className="h-4 w-4 text-gray-400" />
					)}
				</div>

				<input
					ref={inputRef}
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					disabled={disabled}
					className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 pr-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
				/>

				{inputValue && (
					<button
						onClick={clearInput}
						className="absolute inset-y-0 right-0 flex items-center pr-3 hover:text-gray-600"
						type="button"
					>
						<X className="h-4 w-4 text-gray-400" />
					</button>
				)}
			</div>
			{isOpen && suggestions.length > 0 && (
				<div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-border bg-popover shadow-md">
					{suggestions.map((suggestion, index) => {
						const address = suggestion.addressComponents
						return (
							<div
								key={index}
								onClick={() => handleSuggestionClick(suggestion)}
								className={`flex cursor-pointer items-start gap-2 px-3 py-2 hover:bg-accent hover:text-accent-foreground ${
									index === selectedIndex
										? 'bg-accent text-accent-foreground'
										: ''
								}`}
							>
								<MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
								<div className="min-w-0 flex-1">
									<div className="truncate text-sm font-medium">
										{address?.formattedAddress || 'Unknown Address'}
									</div>
									<div className="text-xs text-muted-foreground">
										{address?.city &&
											address?.state &&
											`${address.city}, ${address.state}${address.zip ? ` ${address.zip}` : ''}`}
									</div>
								</div>
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}
