import { Form } from '@remix-run/react'
function MockNotesButton({ route }: { route: string }): JSX.Element {
	return (
		<Form method="POST" action={route}>
			<button className="rounded-lg border px-4 py-2" type="submit">
				Click Me
			</button>
		</Form>
	)
}

export default MockNotesButton
