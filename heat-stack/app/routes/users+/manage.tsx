import { useState } from 'react'
import { Form, useLoaderData } from 'react-router'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { Icon } from '#app/components/ui/icon.tsx'
import { ACCESS_DENIED_MESSAGE } from '#app/constants/error-messages.ts'
import { prisma } from '#app/utils/db.server.ts'
import { useOptionalUser, hasAdminRole } from '#app/utils/user.ts'
export async function loader() {
	// Only admins can access
	// This should be enforced in the route config or loader
	// For now, just fetch all users
	const users = await prisma.user.findMany({
		select: {
			id: true,
			email: true,
			username: true,
			name: true,
			roles: { select: { name: true } },
		},
	})
	// Debug log: print user count and IDs

	return { users }
}

export async function action({ request }: { request: Request }) {
	const formData = await (request as Request).formData()
	const id = formData.get('id') as string
	const email = formData.get('email') as string
	const username = formData.get('username') as string
	const name = formData.get('name') as string
	const adminChecked = formData.get('admin') === 'on'

	// Update admin role
	if (adminChecked) {
		await prisma.user.update({
			where: { id },
			data: {
				roles: {
					connect: { name: 'admin' },
				},
			},
		})
	} else {
		await prisma.user.update({
			where: { id },
			data: {
				roles: {
					disconnect: { name: 'admin' },
				},
			},
		})
	}

	// Update other fields
	await prisma.user.update({
		where: { id },
		data: { email, username, name },
	})
	return null
}

export default function AdminEditUsers() {
	const { users } = useLoaderData() as {
		users: Array<{
			id: string
			email: string
			username: string
			name: string | null
			roles?: { name: string }[]
		}>
	}
	const user = useOptionalUser() as (typeof users)[number] | undefined

	const [editingId, setEditingId] = useState<string | null>(null)
	if (!user || !hasAdminRole(user)) {
		return (
			<div
				id="users-page"
				className="container mb-48 mt-36 flex flex-col items-center justify-center gap-6"
			>
				<h1 className="text-h1">HEAT Users</h1>
				<p className="text-error">{ACCESS_DENIED_MESSAGE}</p>
			</div>
		)
	}
	return (
		<div className="container mt-10">
			<h2 className="mb-6 text-h2">Edit Users (Admin Only)</h2>
			<div className="mb-2 flex w-full items-center gap-4 text-lg font-bold">
				<div className="min-w-[200px] max-w-[400px] flex-1 px-2">Email</div>
				<div className="min-w-[200px] max-w-[400px] flex-1 px-2">Username</div>
				<div className="min-w-[200px] max-w-[400px] flex-1 px-2">Name</div>
				<div className="min-w-[120px] flex items-center gap-2 px-2">Admin</div>
				<div className="ml-2 px-2">Edit</div>
			</div>
			<ul className="divide-y divide-muted">
				{users.map((u) => {
					const isEditing = editingId === u.id
					return (
						<li key={u.id} className="flex items-center gap-6 py-4 text-base">
							{!isEditing ? (
								<div className="flex w-full items-center gap-4">
									<div
										className="min-w-[200px] max-w-[400px] flex-1 break-words rounded bg-muted px-2 py-1 text-lg"
										id={`email_${u.username}_display`}
									>
										{u.email}
									</div>
									<div
										className="min-w-[200px] max-w-[400px] flex-1 break-words rounded bg-muted px-2 py-1 text-lg"
										id={`username_${u.username}_display`}
									>
										{u.username}
									</div>
									<div
										className="min-w-[200px] max-w-[400px] flex-1 break-words rounded bg-muted px-2 py-1 text-lg"
										id={`name_${u.username}_display`}
									>
										{u.name ?? ''}
									</div>
									<div className="min-w-[120px] flex items-center px-2">
										<input
											type="checkbox"
											checked={hasAdminRole(u)}
											readOnly
											aria-label="Admin Role"
										/>
									</div>

									<button
										type="button"
										className="ml-2 rounded p-2 hover:bg-accent"
										id={`edit_btn_${u.username}`}
										onClick={() => setEditingId(u.id)}
									>
										<Icon name="pencil-2" size="md" />
									</button>
								</div>
							) : (
								<Form
									method="post"
									className="flex w-full items-center gap-4 text-lg"
									onBlur={(e) => {
										if (e.relatedTarget === null) setEditingId(null)
									}}
								>
									<input type="hidden" name="id" value={u.id} />
									<label className="flex min-w-[200px] max-w-[400px] flex-1 flex-col text-xs">
										Email
										<input
											name="email"
											id={`email_${u.username}`}
											defaultValue={u.email}
											className="input rounded border px-3 py-2 text-lg focus:outline-accent"
											style={{ width: '100%' }}
											onBlur={(e) => e.target.form?.requestSubmit()}
										/>
									</label>
									<label className="flex min-w-[200px] max-w-[400px] flex-1 flex-col text-xs">
										Username
										<input
											name="username"
											id={`username_${u.username}`}
											defaultValue={u.username}
											className="input rounded border px-3 py-2 text-lg focus:outline-accent"
											style={{ width: '100%' }}
											onBlur={(e) => e.target.form?.requestSubmit()}
										/>
									</label>
									<label className="flex min-w-[200px] max-w-[400px] flex-1 flex-col text-xs">
										Name
										<input
											name="name"
											id={`name_${u.username}`}
											defaultValue={u.name ?? ''}
											className="input rounded border px-3 py-2 text-lg focus:outline-accent"
											style={{ width: '100%' }}
											onBlur={(e) => e.target.form?.requestSubmit()}
										/>
									</label>
									<div className="min-w-[120px] flex items-center px-2">
										<input
											type="checkbox"
											name="admin"
											defaultChecked={hasAdminRole(u)}
											aria-label="Admin Role"
											onChange={e => e.target.form?.requestSubmit()}
										/>
									</div>
									<button
										type="button"
										className="ml-2 rounded p-2 hover:bg-accent"
										id={`cancel_edit_btn_${u.username}`}
										onClick={() => setEditingId(null)}
									>
										<Icon name="cross-1" size="md" />
									</button>
								</Form>
							)}
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
