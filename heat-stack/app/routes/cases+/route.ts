import { requireUserId } from '#app/utils/auth.server.ts'

export async function loader({ request }: { request: Request }) {
	await requireUserId(request)
	return null
}
