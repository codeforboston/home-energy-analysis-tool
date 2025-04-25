import * as React from 'react'
import { cn } from '#app/utils/misc.tsx'

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				ref={ref}
				className={cn(
					'w-full rounded-lg border border-gray-400 bg-white px-4 py-2 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid]:border-red-500',
					className,
				)}
				{...props}
			/>
		)
	},
)

Input.displayName = 'Input'

export { Input }
