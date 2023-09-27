import { PrismaClient } from '@prisma/client'
import { logger } from 'logger'

const prisma = new PrismaClient()

async function main() {
  logger.info('Database seed start')

  const roles = await prisma.sysRefRole.createMany({
    data: [
      {
        id: 1,
        name: 'SponsorContact',
        description: 'Sponsor contact role',
      },
      {
        id: 2,
        name: 'ContactManager',
        description: 'Contact manager role',
      },
    ],
    skipDuplicates: true,
  })

  logger.trace('Roles created', roles)

  logger.info('Database seed end')
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    logger.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
