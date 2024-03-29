import type { OrderType } from '../@types/filters'
import { StudySponsorOrganisationRoleRTSIdentifier } from '../constants'
import { type OrganisationRoleShortName, organisationRoleShortName } from './organisations'
import { Prisma, prismaClient } from './prisma'

const sortMap = {
  'due-assessment': { isDueAssessment: Prisma.SortOrder.desc },
  'last-assessment-asc': {
    lastAssessment: {
      createdAt: Prisma.SortOrder.asc,
    },
  },
  'last-assessment-desc': {
    lastAssessment: {
      createdAt: Prisma.SortOrder.desc,
    },
  },
}

export const getStudyById = async (studyId: number, organisationIds?: number[]) => {
  const query = {
    where: {
      id: studyId,
      isDeleted: false,
      ...(organisationIds && {
        organisations: {
          some: {
            organisationId: {
              in: organisationIds,
            },
            isDeleted: false,
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
        where: {
          isDeleted: false,
        },
        include: {
          organisation: true,
          organisationRole: true,
        },
      },
      evaluationCategories: {
        where: {
          isDeleted: false,
        },
      },
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
      return [organisationRoleShortName[organisation.organisationRole.name], organisation.organisation.name]
    })
  ) as Partial<Record<OrganisationRoleShortName, string>>

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
  sortOrder,
}: {
  organisationIds: number[]
  currentPage: number
  pageSize: number
  searchTerm: string | null
  sortOrder: OrderType
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
          ...(Number(searchTerm) ? [{ cpmsId: Number(searchTerm) }] : []),
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
          isDeleted: false,
        },
      },
    },
    select: {
      id: true,
      title: true,
      shortTitle: true,
      isDueAssessment: true,
      lastAssessment: {
        include: {
          status: true,
        },
      },
      organisations: {
        where: {
          isDeleted: false,
        },
        include: {
          organisation: true,
          organisationRole: true,
        },
      },
      evaluationCategories: {
        where: {
          isDeleted: false,
        },
      },
    },
    orderBy: [sortMap[sortOrder], { id: Prisma.SortOrder.asc }],
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

const studiesForExportFields = {
  include: {
    lastAssessment: {
      include: {
        status: true,
        furtherInformation: {
          include: { furtherInformation: true },
        },
      },
    },
    organisations: {
      where: {
        isDeleted: false,
      },
      include: {
        organisation: true,
        organisationRole: true,
      },
    },
    evaluationCategories: {
      where: {
        isDeleted: false,
      },
    },
  },
}

export type StudyForExport = Prisma.StudyGetPayload<typeof studiesForExportFields>

export const getStudiesForExport = async (organisationIds: number[]) => {
  const query = {
    where: {
      isDeleted: false,
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
          isDeleted: false,
        },
      },
    },
    ...studiesForExportFields,
    orderBy: [{ isDueAssessment: Prisma.SortOrder.desc }, { id: Prisma.SortOrder.asc }],
  }

  return prismaClient.study.findMany(query)
}
