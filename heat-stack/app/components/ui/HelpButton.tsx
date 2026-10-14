import { HelpCircle } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { type ModalFromMarkDown as ModalComponent } from './ModalFromMarkdown'

// Loaded on first open so the markdown/dialog stack stays out of the bundle of
// every route that renders a form field. If the chunk fails to load (stale
// deploy, dropped connection) render nothing rather than letting the error
// reach the route boundary and wipe out the form the user is filling in.
const ModalFromMarkDown = lazy<
	React.ComponentType<React.ComponentProps<typeof ModalComponent>>
>(() =>
	import('./ModalFromMarkdown')
		.then((m) => ({ default: m.ModalFromMarkDown }))
		.catch(() => ({ default: () => null })),
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
