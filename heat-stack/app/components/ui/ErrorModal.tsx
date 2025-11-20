import { useState } from 'react'
import { Button } from '#app/components/ui/button.tsx'

interface ErrorModalProps {
	isOpen: boolean
	onClose: () => void
	title: string
	message: string
}

export function ErrorModal({
	isOpen,
	onClose,
	title,
	message,
}: ErrorModalProps) {
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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
				<div className="mb-4 flex items-center">
					<div className="flex-shrink-0">
						<div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
							<span className="text-xl text-yellow-600">⚠️</span>
						</div>
					</div>
					<div className="ml-3">
						<h3 className="text-lg font-medium text-gray-900">{title}</h3>
					</div>
				</div>

				<div className="mb-6">
					<p className="whitespace-pre-line text-sm text-gray-700">{message}</p>
				</div>

				<div className="flex justify-end gap-3">
					<Button variant="outline" onClick={handleCopy} className="text-sm">
						{copied ? '✓ Copied!' : '📋 Copy'}
					</Button>
					<Button onClick={onClose} className="text-sm">
						Close
					</Button>
				</div>
			</div>
		</div>
	)
}
