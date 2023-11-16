import { StudySponsorOrganisationRoleRTSIdentifier } from '../constants'
import { Prisma, prismaClient } from './prisma'

export const getStudyById = async (studyId: number, organisationIds?: number[]) => {
  const query = {
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
    orderBy: [
      {
        createdAt: Prisma.SortOrder.desc,
      },
    ],
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
          furtherInformation: {
            include: {
              furtherInformation: true,
            },
            orderBy: {
              furtherInformationId: Prisma.SortOrder.asc,
            },
          },
        },
        orderBy: [
          {
            createdAt: Prisma.SortOrder.desc,
          },
        ],
      },
    },
  }

  const [study] = await prismaClient.$transaction([prismaClient.study.findFirst(query)])

  if (!study) {
    return {
      data: study,
    }
  }

  // Map organisation roles along with the name of the organisation to quickly check for a CTU / CRO if applicable
  const organisationsByRole = Object.fromEntries(
    study.organisations.map((organisation) => {
      return [organisation.organisationRole.name, organisation.organisation.name]
    })
  )

  return {
    data: {
      ...study,
      organisationsByRole,
    },
  }
}

export const getStudiesForOrgs = async ({
  organisationIds,
  currentPage,
  pageSize,
  searchTerm,
}: {
  organisationIds: number[]
  currentPage: number
  pageSize: number
  searchTerm: string | null
}) => {
  const query = {
    skip: currentPage * pageSize - pageSize,
    take: pageSize,
    where: {
      isDeleted: false,
      ...(searchTerm && {
        OR: [
          {
            title: {
              contains: searchTerm,
            },
          },
          {
            shortTitle: {
              contains: searchTerm,
            },
          },
          {
            irasId: {
              contains: searchTerm,
            },
          },
          {
            protocolReferenceNumber: {
              contains: searchTerm,
            },
          },
        ],
      }),
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
      title: true,
      shortTitle: true,
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
