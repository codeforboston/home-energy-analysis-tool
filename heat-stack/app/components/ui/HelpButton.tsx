import { HelpCircle } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'

// Loaded on first open so the markdown/dialog stack stays out of the bundle of
// every route that renders a form field.
const ModalFromMarkDown = lazy(() =>
	import('./ModalFromMarkdown').then((m) => ({ default: m.ModalFromMarkDown })),
)

type HelpButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	keyName: string
	className?: string
	size?: number
}

export function HelpButton({
	keyName,
	className,
	size = 18,
	...rest
}: HelpButtonProps) {
	const [modalOpen, setModalOpen] = useState(false)

	return (
		<>
			<button
				onClick={() => setModalOpen(true)}
				className={`text-sm ${className ?? ''}`}
				type="button"
				{...rest}
			>
				<HelpCircle size={size} /> {/* 18px icon size */}
			</button>
			{modalOpen ? (
				<Suspense fallback={null}>
					<ModalFromMarkDown
						keyName={keyName}
						open
						onClose={() => setModalOpen(false)}
					/>
				</Suspense>
			) : null}
		</>
	)
}
