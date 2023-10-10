import { StudySponsorOrganisationRoleRTSIdentifier } from '../constants'
import { Prisma, prismaClient } from './prisma'

export const getStudyById = (studyId: number, organisationIds?: number[]) => {
  return prismaClient.study.findFirst({
    where: {
      id: studyId,
      ...(organisationIds && {
        organisations: {
          some: {
            organisationId: {
              in: organisationIds,
            },
          },
        },
      }),
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
          createdBy: true,
          furtherInformation: true,
        },
      },
      funders: {
        include: {
          organisation: true,
        },
      },
    },
  })
}

export const getStudiesForOrgs = async (organisationIds: number[], currentPage: number, pageSize: number) => {
  const query = {
    skip: currentPage * pageSize - pageSize,
    take: pageSize,
    where: {
      organisations: {
        some: {
          organisationId: { in: organisationIds },
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
