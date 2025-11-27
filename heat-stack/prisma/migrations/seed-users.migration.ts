import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const adminUsername = process.env.admin_username
  const adminPassword = process.env.admin_password
  
  if (!adminUsername || !adminPassword) {
    throw new Error('Missing required environment variables for seeding users')
  }

  // Hash passwords
  const adminHash = await bcrypt.hash(adminPassword, 10)

  // Seed admin user
  await prisma.user.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      password: { create: { hash: adminHash } },
      email: `${adminUsername}@example.com`,
      name: 'Admin User',
      roles: { connect: { name: 'admin' } },
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
