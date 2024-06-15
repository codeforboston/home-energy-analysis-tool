import { PrismaClient } from '@prisma/client'
import { ActionFunction, redirect } from '@remix-run/node'

export const action: ActionFunction = async ({ request }) => {
	const body = new URLSearchParams(await request.text())

	const prisma = new PrismaClient()

	async function main() {
		await prisma.mockNote.create({
			data: {
				note: `Hello, World! at: ${new Date().toISOString()}`,
			},
		})
	}

	await main()
		.catch(e => {
			throw e
		})
		.finally(async () => {
			await prisma.$disconnect()
		})

	return await prisma.mockNote.findMany()
}
