import type { Study, StudyEvaluationCategory } from '@/@types/studies'
import { getErrorMessage } from '@/utils/error'

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

export type UpdateStudyInput = Prisma.StudyUpdateInput

export const mapCPMSStatusToSEStatus = (cpmsStatus: string): string => {
  const statusMap: { [key: string]: string } = {
    'Pre-Setup': 'In setup',
    'In Setup': 'In setup',
    'In Setup, Pending NHS Permission': 'In setup',
    'In Setup, Approval Received': 'In setup',
    'In Setup, Pending Approval': 'In setup',
    'Open to Recruitment': 'Open to recruitment',
    'Open, With Recruitment': 'Open to recruitment',
    'Closed to Recruitment': 'Closed',
    'Closed to Recruitment, In Follow Up': 'Closed, in follow up',
    'Closed to Recruitment, Follow Up Complete': 'Closed',
    Suspended: 'Suspended',
    'Withdrawn in Pre-Setup': 'Withdrawn',
    'Withdrawn During Setup': 'Withdrawn',
  }

  return statusMap[cpmsStatus] || cpmsStatus
}

export const mapCPMSStudyToPrismaStudy = (study: Study): UpdateStudyInput => ({
  cpmsId: study.StudyId,
  shortTitle: study.StudyShortName,
  studyStatus: mapCPMSStatusToSEStatus(study.StudyStatus),
  route: study.StudyRoute,
  sampleSize: study.TotalRecruitmentToDate,
  totalRecruitmentToDate: study.UkRecruitmentTargetToDate,
  plannedOpeningDate: study.PlannedOpeningDate ? new Date(study.PlannedOpeningDate) : null,
  plannedClosureDate: study.PlannedClosureToRecruitmentDate ? new Date(study.PlannedClosureToRecruitmentDate) : null,
  actualOpeningDate: study.ActualOpeningDate ? new Date(study.ActualOpeningDate) : null,
  actualClosureDate: study.ActualClosureToRecruitmentDate ? new Date(study.ActualClosureToRecruitmentDate) : null,
})

export const updateStudy = async (cpmsId: number, studyData: UpdateStudyInput) => {
  try {
    const study = await prismaClient.study.update({
      where: {
        cpmsId,
      },
      data: { ...studyData },
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
          select: { id: true, indicatorValue: true },
        },
      },
    })

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
  } catch (error) {
    const errorMessage = getErrorMessage(error)
    return {
      data: null,
      error: errorMessage,
    }
  }
}

export const mapCPMSStudyEvalToPrismaEval = (studyEvaluation: StudyEvaluationCategory) => ({
  indicatorType: studyEvaluation.EvaluationCategoryType,
  indicatorValue: studyEvaluation.EvaluationCategoryValue,
  sampleSize: studyEvaluation.SampleSize,
  totalRecruitmentToDate: studyEvaluation.TotalRecruitmentToDate,
  plannedOpeningDate: studyEvaluation.PlannedRecruitmentStartDate
    ? new Date(studyEvaluation.PlannedRecruitmentStartDate)
    : null,
  plannedClosureDate: studyEvaluation.PlannedRecruitmentEndDate
    ? new Date(studyEvaluation.PlannedRecruitmentEndDate)
    : null,
  actualOpeningDate: studyEvaluation.ActualOpeningDate ? new Date(studyEvaluation.ActualOpeningDate) : null,
  actualClosureDate: studyEvaluation.ActualClosureDate ? new Date(studyEvaluation.ActualClosureDate) : null,
  expectedReopenDate: studyEvaluation.ExpectedReopenDate ? new Date(studyEvaluation.ExpectedReopenDate) : null,
  isDeleted: false,
})

export const updateEvaluationCategories = async (
  studyId: number,
  studyEvaluationsToUpsert: Prisma.StudyEvaluationCategoryCreateWithoutStudyInput[],
  studyEvaluationIdsToDelete: number[]
) => {
  try {
    // Add evaluation categories
    const evaluationCategoryInputs = studyEvaluationsToUpsert.map((category) => {
      return prismaClient.studyEvaluationCategory.upsert({
        where: {
          studyId_indicatorValue: {
            studyId,
            indicatorValue: category.indicatorValue,
          },
        },
        update: category,
        create: { studyId, ...category },
      })
    })

    const evaluationCategories = await Promise.all(evaluationCategoryInputs)

    // Delete evaluation categories
    if (studyEvaluationIdsToDelete.length > 0) {
      await prismaClient.studyEvaluationCategory.updateMany({
        where: { id: { in: studyEvaluationIdsToDelete }, isDeleted: false },
        data: { isDeleted: true },
      })
    }

    return { data: evaluationCategories, error: null }
  } catch (error) {
    const errorMessage = getErrorMessage(error)

    return {
      data: null,
      error: errorMessage,
    }
  }
}
