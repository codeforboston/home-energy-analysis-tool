import { logout } from '#app/utils/auth.server.ts'
import { type Route } from './+types/logout.ts'

export const loader = async ({ request }: Route.LoaderArgs) => {
	return logout({ request })
}

// Optional: remove action if you're not using a POST logout anywhere
export const action = async ({ request }: Route.ActionArgs) => {
	return logout({ request })
}
