/**
 * @vitest-environment jsdom
 */
import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { HelpButton } from './HelpButton.tsx'

// Simulates the modal chunk failing to load (e.g. a stale chunk hash after a
// deploy, or a dropped connection).
vi.mock('#app/components/ui/ModalFromMarkdown', () => {
	throw new Error('Failed to fetch dynamically imported module')
})

describe('HelpButton', () => {
	it('keeps the page rendered when the help modal fails to load', async () => {
		render(
			<main>
				<p>Case form</p>
				<HelpButton keyName="living_area.help" />
			</main>,
		)
		fireEvent.click(screen.getByRole('button'))
		// Let the lazy import settle and React commit the result.
		await act(() => new Promise((resolve) => setTimeout(resolve, 50)))
		expect(screen.getByText('Case form')).toBeInTheDocument()
		expect(screen.getByRole('button')).toBeInTheDocument()
	})
})
