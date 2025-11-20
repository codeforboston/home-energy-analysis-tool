import { useState } from 'react'
import { Button } from '#app/components/ui/button.tsx'

interface ErrorModalProps {
	isOpen: boolean
	onClose: () => void
	title: string
	message: string
}

export function ErrorModal({ isOpen, onClose, title, message }: ErrorModalProps) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(message)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch (err) {
			console.error('Failed to copy text: ', err)
		}
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
				<div className="flex items-center mb-4">
					<div className="flex-shrink-0">
						<div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
							<span className="text-yellow-600 text-xl">⚠️</span>
						</div>
					</div>
					<div className="ml-3">
						<h3 className="text-lg font-medium text-gray-900">{title}</h3>
					</div>
				</div>
				
				<div className="mb-6">
					<p className="text-sm text-gray-700 whitespace-pre-line">{message}</p>
				</div>
				
				<div className="flex gap-3 justify-end">
					<Button
						variant="outline"
						onClick={handleCopy}
						className="text-sm"
					>
						{copied ? '✓ Copied!' : '📋 Copy'}
					</Button>
					<Button
						onClick={onClose}
						className="text-sm"
					>
						Close
					</Button>
				</div>
			</div>
		</div>
	)
}