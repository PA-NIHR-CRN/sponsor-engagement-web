import { prismaClient } from './prisma'

export const getUserOrganisations = async (userId: number) => {
  return prismaClient.userOrganisation.findMany({
    where: {
      userId,
    },
  })
}
