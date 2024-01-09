import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { email: 'seed.tenant@test.com' },
    update: {},
    create: {
      email: 'seed.tenant@test.com',
      plan: 'enterprise',
      company: 'SeedCo'
    },
  })
  await prisma.user.upsert({
    where: {email: process.env.SEED_USER_EMAIL},
    update: {},
    create: {
        name: 'User',
        email: process.env.SEED_USER_EMAIL!,
        role: 'tenant',
        tenantId: tenant.id
    }
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
