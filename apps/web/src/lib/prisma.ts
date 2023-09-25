import { PrismaClient } from '@prisma/client'

export const prismaClient = new PrismaClient()

// Getting the above via the database package is erroring with "PrismaClient is not a constructor"

// import { PrismaClient } from 'database'

// export const prismaClient = new PrismaClient()
