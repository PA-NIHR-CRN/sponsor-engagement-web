import type { Prisma } from 'database'
import { prismaClient } from './prisma'

export type StudyOrganisationWithRelations = Prisma.StudyOrganisationGetPayload<{
  include: { organisation: true; organisationRole: true }
}>

export const getUserOrganisations = async (userId: number) => {
  return prismaClient.userOrganisation.findMany({
    where: {
      userId,
    },
  })
}

export const isClinicalResearchSponsor = (studyOrg: StudyOrganisationWithRelations) =>
  studyOrg.organisationRole.name === 'Clinical Research Sponsor'
