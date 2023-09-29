import { StudySponsorOrganisationRoleRTSIdentifier } from '../constants'
import { prismaClient } from './prisma'

export const getUserStudies = async (userId: number, currentPage: number, pageSize: number) => {
  const userOrgs = await prismaClient.userOrganisation.findMany({
    where: {
      userId,
    },
  })

  const query = {
    skip: currentPage * pageSize - pageSize,
    take: pageSize,
    where: {
      organisations: {
        some: {
          id: {
            in: userOrgs.map((org) => org.organisationId),
          },
          organisationRole: {
            rtsIdentifier: {
              in: [
                StudySponsorOrganisationRoleRTSIdentifier.ClinicalResearchSponsor,
                StudySponsorOrganisationRoleRTSIdentifier.ClinicalTrialsUnit,
                StudySponsorOrganisationRoleRTSIdentifier.ContractResearchOrganisation,
              ],
            },
          },
        },
      },
    },
    include: {
      organisations: {
        include: {
          organisation: true,
          organisationRole: true,
        },
      },
    },
  }

  const [studies, count] = await prismaClient.$transaction([
    prismaClient.study.findMany(query),
    prismaClient.study.count({ where: query.where }),
  ])

  return {
    pagination: {
      total: count,
    },
    data: studies,
  }
}
