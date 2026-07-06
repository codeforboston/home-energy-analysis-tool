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
			city: true,
			state: true,
			suspended: true,
			roles: { select: { name: true } },
		},
	})
	// Debug log: print user count and IDs

	return { users }
}

export async function action({ request }: { request: Request }) {
	// Require admin role for all user modifications and deletions
	const { requireUserWithRole } = await import(
		'#app/utils/permissions.server.ts'
	)
	await requireUserWithRole(request, 'admin')

	const formData = await (request as Request).formData()
	const id = formData.get('id') as string
	const email = formData.get('email') as string
	const username = formData.get('username') as string
	const name = formData.get('name') as string
	const city = formData.get('city') as string
	const state = formData.get('state') as string
	const adminChecked = formData.get('admin') === 'on'
	const intent = formData.get('intent')

	if (intent === 'suspend' || intent === 'unsuspend') {
		await prisma.user.update({
			where: { id },
			data: {
				suspended: intent === 'suspend',
			},
		})

		return null
	}

	// Update admin role with a single update statement
	await prisma.user.update({
		where: { id },
		data: {
			roles: adminChecked
				? { connect: { name: 'admin' } }
				: { disconnect: { name: 'admin' } },
		},
	})

	// Update other fields
	await prisma.user.update({
		where: { id },
		data: { email, username, name, city, state },
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
			city: string | null
			state: string | null
			suspended: boolean
			roles?: { name: string }[]
		}>
	}
	const [searchTerm, setSearchTerm] = useState('')
	const filteredUsers = users.filter((user) =>
		[user.name, user.email, user.username, user.city, user.state]
			.filter(Boolean)
			.some((value) => value!.toLowerCase().includes(searchTerm.toLowerCase())),
	)
	const loggedInUser = useOptionalUser()

	const [editingId, setEditingId] = useState<string | null>(null)
	if (!loggedInUser || !hasAdminRole(loggedInUser)) {
		return (
			<div className="container mb-48 mt-36 flex flex-col items-center justify-center gap-6">
				<h1 className="text-h1">HEAT Users</h1>
				<p className="text-error">{ACCESS_DENIED_MESSAGE}</p>
			</div>
		)
	}
	return (
		<div className="container mt-10" id="users-page">
			<div className="mb-4 flex flex-col gap-4 md:mb-6 md:flex-row md:items-center md:justify-between">
				<h2 className="text-3xl font-bold">Edit Users (Admin Only)</h2>

				<div className="flex flex-1 justify-end">
					<div className="relative w-full max-w-sm">
						<div className="absolute left-4 top-1/2 -translate-y-1/2">
							<Icon
								name="magnifying-glass"
								className="h-5 w-5 text-emerald-600"
							/>
						</div>

						<input
							type="search"
							name="search"
							placeholder="Search users..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full rounded-full border-2 border-emerald-500 bg-white py-2.5 pl-12 pr-4 text-sm shadow-md transition-all focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
						/>
					</div>
				</div>
			</div>

			{/* <div className="mb-2 flex w-full items-center gap-4 text-lg font-bold">
				<div className="min-w-[200px] max-w-[400px] flex-1 px-2">Name</div>
				<div className="min-w-[200px] max-w-[400px] flex-1 px-2">Email</div>
				<div className="min-w-[200px] max-w-[400px] flex-1 px-2">Username</div>
				<div className="min-w-[200px] max-w-[400px] flex-1 px-2">City</div>
				<div className="min-w-[200px] max-w-[400px] flex-1 px-2">State</div>
				<div className="flex min-w-[120px] items-center gap-2 px-2">Admin</div>
				<div className="flex min-w-[120px] items-center gap-2 px-2">Status</div>
				<div className="ml-2 px-2">Edit</div>
			</div>
			<ul className="divide-y divide-muted">
				{filteredUsers.map((u) => {
					const isEditing = editingId === u.id
					return (
						<li key={u.id} className="flex items-center gap-6 py-4 text-base">
							{!isEditing ? (
								<div className="flex w-full items-center gap-4">
									<div
										className="min-w-[200px] max-w-[400px] flex-1 break-words rounded border px-2 py-1 text-lg"
										id={`name_${u.username}_display`}
									>
										{u.name ?? ''}
									</div>
									<div
										className="min-w-[200px] max-w-[400px] flex-1 break-words rounded border px-2 py-1 text-lg"
										id={`email_${u.username}_display`}
									>
										{u.email}
									</div>
									<div
										className="min-w-[200px] max-w-[400px] flex-1 break-words rounded border px-2 py-1 text-lg"
										id={`username_${u.username}_display`}
									>
										{u.username}
									</div>
									<div
										className="min-w-[200px] max-w-[400px] flex-1 break-words rounded border px-2 py-1 text-lg"
										id={`city_${u.username}_display`}
									>
										{u.city??''}
									</div>
									<div
										className="min-w-[200px] max-w-[400px] flex-1 break-words rounded border px-2 py-1 text-lg"
										id={`state_${u.username}_display`}
									>
										{u.state??''}
									</div>
									<div className="flex min-w-[120px] items-center px-2">
										<input
											type="checkbox"
											checked={hasAdminRole(u)}
											readOnly
											aria-label="Admin Role"
										/>
									</div>
									<button
										type="submit"
										name="intent"
										value={u.suspended ? 'unsuspend' : 'suspend'}
										disabled={!isEditing}
										className={`rounded-md px-4 py-2 font-semibold transition-colors duration-200
											${
												!isEditing
													? 'cursor-not-allowed bg-gray-300 text-gray-500'
													: u.suspended
														? 'bg-emerald-600 text-white hover:bg-emerald-700'
														: 'bg-red-600 text-white hover:bg-red-700'
											}`}
									>
										{u.suspended ? 'Unsuspend' : 'Suspend'}
									</button>

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
										Name
										<input
											name="name"
											id={`name_${u.username}`}
											defaultValue={u.name ?? ''}
											className="input rounded border px-3 py-2 text-xs font-mono text-lg focus:outline-accent"
											style={{ width: '100%' }}
											onBlur={(e) => e.target.form?.requestSubmit()}
										/>
									</label>
									<label className="flex min-w-[200px] max-w-[400px] flex-1 flex-col text-xs">
										Email
										<input
											name="email"
											id={`email_${u.username}`}
											defaultValue={u.email}
											className="input rounded border px-3 py-2 text-xs font-mono text-lg focus:outline-accent"
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
											className="input rounded border px-3 py-2 text-xs font-mono text-lg focus:outline-accent"
											style={{ width: '100%' }}
											onBlur={(e) => e.target.form?.requestSubmit()}
										/>
									</label>
									<label className="flex min-w-[200px] max-w-[400px] flex-1 flex-col text-xs">
										City
										<input
											name="city"
											id={`city_${u.username}`}
											defaultValue={u.city ? u.city: ""}
											className="input rounded border px-3 py-2 text-xs font-mono text-lg focus:outline-accent"
											style={{ width: '100%' }}
											onBlur={(e) => e.target.form?.requestSubmit()}
										/>
									</label>
									<label className="flex min-w-[200px] max-w-[400px] flex-1 flex-col text-xs">
										State
										<input
											name="state"
											id={`state_${u.username}`}
											defaultValue={u.state? u.state : ""}
											className="input rounded border px-3 py-2 text-xs font-mono text-lg focus:outline-accent"
											style={{ width: '100%' }}
											onBlur={(e) => e.target.form?.requestSubmit()}
										/>
									</label>
									
									<div className="flex min-w-[120px] items-center px-2">
										<input
											type="checkbox"
											name="admin"
											defaultChecked={hasAdminRole(u)}
											aria-label="Admin Role"
											onChange={(e) => e.target.form?.requestSubmit()}
										/>
									</div>
									<button
										type="submit"
										name="intent"
										value={u.suspended ? 'unsuspend' : 'suspend'}
										disabled={!isEditing}
										className={`rounded-md px-4 py-2 font-semibold transition-colors duration-200
											${
												!isEditing
													? 'cursor-not-allowed bg-gray-300 text-gray-500'
													: u.suspended
														? 'bg-emerald-600 text-white hover:bg-emerald-700'
														: 'bg-red-600 text-white hover:bg-red-700'
											}`}
									>
										{u.suspended ? 'Unsuspend' : 'Suspend'}
									</button>
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
			</ul> */}

			<div className="overflow-x-auto rounded-xl border bg-background shadow-sm">
				<div className="border/90 sticky top-0 z-20 flex min-w-[1500px] items-center gap-4 border-b px-6 py-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur">
					<div className="flex-[1.3]">Name</div>
					<div className="flex-[1.6]">Email</div>
					<div className="flex-1">Username</div>
					<div className="flex-1">City</div>
					<div className="flex-1">State</div>

					<div className="w-24 text-center">Admin</div>
					<div className="w-32 text-center">Status</div>
					<div className="w-24 text-center">Edit</div>
				</div>

				<ul className="max-h-[1000px] min-w-[1500px]">
					{filteredUsers.map((u) => {
						const isEditing = editingId === u.id

						return (
							<li
								key={u.id}
								className="m-4 rounded-xl border bg-card shadow-sm transition-all hover:border-emerald-300 hover:shadow-md"
							>
								{!isEditing ? (
									<div className="flex items-center gap-4 px-2 py-2">
										<div
											className="flex-[1.3] rounded-lg border px-3 py-2 font-mono text-xs"
											id={`name_${u.username}_display`}
										>
											{u.name ?? '-'}
										</div>

										<div
											className="flex-[1.6] rounded-lg border px-3 py-2 font-mono text-xs"
											id={`email_${u.username}_display`}
										>
											{u.email}
										</div>

										<div
											className="flex-1 rounded-lg border px-3 py-2 font-mono text-xs"
											id={`username_${u.username}_display`}
										>
											{u.username}
										</div>

										<div
											className="flex-1 rounded-lg border px-3 py-2 font-mono text-xs"
											id={`city_${u.username}_display`}
										>
											{u.city ?? '-'}
										</div>

										<div
											className="flex-1 rounded-lg border px-3 py-2 font-mono text-xs"
											id={`state_${u.username}_display`}
										>
											{u.state ?? '-'}
										</div>

										<div className="flex w-24 justify-center">
											<input
												type="checkbox"
												checked={hasAdminRole(u)}
												readOnly
												aria-label="Admin Role"
												className="h-4 w-4 accent-emerald-600"
											/>
										</div>

										<div className="flex w-32 justify-center">
											<span
												className={`rounded-full px-3 py-1 text-xs font-semibold ${
													u.suspended
														? 'bg-red-100 text-red-700'
														: 'bg-emerald-100 text-emerald-700'
												}`}
											>
												{u.suspended ? 'Suspended' : 'Active'}
											</span>
										</div>

										<div className="flex w-24 justify-center">
											<button
												type="button"
												id={`edit_btn_${u.username}`}
												onClick={() => setEditingId(u.id)}
												className="rounded-lg border p-2 transition hover:bg-accent"
											>
												<Icon name="pencil-2" size="md" />
											</button>
										</div>
									</div>
								) : (
									<Form
										method="post"
										className="border/30 flex items-center gap-4 rounded-xl px-6 py-5"
										onBlur={(e) => {
											if (e.relatedTarget === null) setEditingId(null)
										}}
									>
										<input type="hidden" name="id" value={u.id} />

										<label className="flex flex-[1.3] flex-col gap-1 font-mono text-xs">
											Name
											<input
												name="name"
												id={`name_${u.username}`}
												defaultValue={u.name ?? ''}
												className="rounded-lg border bg-background px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary"
												onBlur={(e) => e.target.form?.requestSubmit()}
											/>
										</label>

										<label className="flex flex-[1.6] flex-col gap-1 font-mono text-xs">
											Email
											<input
												name="email"
												id={`email_${u.username}`}
												defaultValue={u.email}
												className="rounded-lg border bg-background px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary"
												onBlur={(e) => e.target.form?.requestSubmit()}
											/>
										</label>

										<label className="flex flex-1 flex-col gap-1 font-mono text-xs">
											Username
											<input
												name="username"
												id={`username_${u.username}`}
												defaultValue={u.username}
												className="rounded-lg border bg-background px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary"
												onBlur={(e) => e.target.form?.requestSubmit()}
											/>
										</label>

										<label className="flex flex-1 flex-col gap-1 font-mono text-xs">
											City
											<input
												name="city"
												id={`city_${u.username}`}
												defaultValue={u.city ?? ''}
												className="rounded-lg border bg-background px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary"
												onBlur={(e) => e.target.form?.requestSubmit()}
											/>
										</label>

										<label className="flex flex-1 flex-col gap-1 font-mono text-xs">
											State
											<input
												name="state"
												id={`state_${u.username}`}
												defaultValue={u.state ?? ''}
												className="rounded-lg border bg-background px-3 py-2 shadow-sm focus:ring-2 focus:ring-primary"
												onBlur={(e) => e.target.form?.requestSubmit()}
											/>
										</label>

										<div className="flex w-24 justify-center pt-5">
											<input
												type="checkbox"
												name="admin"
												defaultChecked={hasAdminRole(u)}
												aria-label="Admin Role"
												className="h-4 w-4 accent-emerald-600"
												onChange={(e) => e.target.form?.requestSubmit()}
											/>
										</div>

										<div className="flex w-32 justify-center pt-5">
											<button
												type="submit"
												name="intent"
												value={u.suspended ? 'unsuspend' : 'suspend'}
												className={`h-10 w-28 rounded-lg text-sm font-semibold text-white transition ${
													u.suspended
														? 'bg-emerald-600 hover:bg-emerald-700'
														: 'bg-red-600 hover:bg-red-700'
												}`}
											>
												{u.suspended ? 'Unsuspend' : 'Suspend'}
											</button>
										</div>

										<div className="flex w-24 justify-center pt-5">
											<button
												type="button"
												id={`cancel_edit_btn_${u.username}`}
												onClick={() => setEditingId(null)}
												className="rounded-lg border p-2 transition hover:bg-accent"
											>
												<Icon name="cross-1" size="md" />
											</button>
										</div>
									</Form>
								)}
							</li>
						)
					})}
				</ul>
			</div>
		</div>
	)
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary />
}
