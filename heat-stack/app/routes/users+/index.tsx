export { action } from './users'
import { searchUsers } from '@prisma/client/sql'
import { redirect } from 'react-router'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { useDelayedIsPending } from '#app/utils/misc.tsx'
import { type Route } from './+types/index.ts'
import Users from './users.tsx'

export async function loader({ request }: Route.LoaderArgs) {
	const searchTerm = new URL(request.url).searchParams.get('search')
	if (searchTerm === '') {
		return redirect('/users')
	}

	const like = `%${searchTerm ?? ''}%`
	const users = await prisma.$queryRawTyped(searchUsers(like))
	return { status: 'idle', users } as const
}

export default function UsersRoute({ loaderData }: Route.ComponentProps) {
	const isPending = useDelayedIsPending({
		formMethod: 'GET',
		formAction: '/users',
	})

	// Render the users.tsx default export (AdminEditUsers)
	// ...existing code...
	return <Users />
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
