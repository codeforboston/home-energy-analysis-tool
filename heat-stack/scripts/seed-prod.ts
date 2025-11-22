import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminUsername = process.env.admin_username
  const adminPassword = process.env.admin_password
  const userUsername = process.env.user_username
  const userPassword = process.env.user_password

  if (!adminUsername || !adminPassword || !userUsername || !userPassword) {
    throw new Error('Missing required environment variables for seeding users')
  }

  // Hash passwords
  const adminHash = await bcrypt.hash(adminPassword, 10)
  const userHash = await bcrypt.hash(userPassword, 10)

  // Seed admin user
  await prisma.user.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      password: { create: { hash: adminHash } },
      is_admin: true,
      email: `${adminUsername}@example.com`,
      name: 'Admin User',
      roles: { connect: { name: 'admin' } },
    },
  })

  // Seed regular user
  await prisma.user.upsert({
    where: { username: userUsername },
    update: {},
    create: {
      username: userUsername,
      password: { create: { hash: userHash } },
      is_admin: false,
      email: `${userUsername}@example.com`,
      name: 'Regular User',
      roles: { connect: { name: 'user' } },
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
