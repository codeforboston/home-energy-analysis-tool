import { HelpCircle } from 'lucide-react'
import { useState } from 'react'
import { ModalFromMarkDown } from './ModalFromMarkdown'

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
				{...rest}
			>
				<HelpCircle size={size} /> {/* 18px icon size */}
			</button>
			<ModalFromMarkDown
				keyName={keyName}
				open={modalOpen}
				onClose={() => setModalOpen(false)}
			/>
		</>
	)
}
