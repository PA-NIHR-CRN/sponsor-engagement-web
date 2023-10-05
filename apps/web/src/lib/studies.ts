import { StudySponsorOrganisationRoleRTSIdentifier } from '../constants'
import { Prisma, prismaClient } from './prisma'

export const getStudyById = async (studyId: number) => {
  return prismaClient.study.findFirst({
    where: {
      id: studyId,
    },
    include: {
      organisations: {
        include: {
          organisation: true,
          organisationRole: true,
        },
      },
      evaluationCategories: true,
      assessments: {
        include: {
          status: true,
        },
      },
    },
  })
}

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
          organisationId: {
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
    select: {
      id: true,
      name: true,
      isDueAssessment: true,
      organisations: {
        include: {
          organisation: true,
          organisationRole: true,
        },
      },
      evaluationCategories: true,
      assessments: {
        include: {
          status: true,
        },
        orderBy: {
          createdAt: Prisma.SortOrder.desc,
        },
        take: 1,
      },
    },
    orderBy: [{ isDueAssessment: Prisma.SortOrder.desc }, { id: Prisma.SortOrder.asc }],
  }

  const [studies, count, countDue] = await prismaClient.$transaction([
    prismaClient.study.findMany(query),
    prismaClient.study.count({ where: query.where }),
    prismaClient.study.count({
      where: {
        ...query.where,
        isDueAssessment: true,
      },
    }),
  ])

  return {
    pagination: {
      total: count,
      totalDue: countDue,
    },
    data: studies,
  }
}
