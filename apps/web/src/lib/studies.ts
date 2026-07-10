import { logger } from '@nihr-ui/logger'
import dayjs from 'dayjs'
import { setStudyAssessmentDue, setStudyAssessmentNotDue as setStudyAssessmentNotDueUtil } from 'shared-utilities'

import type { ActionKey, Study, StudyEvaluationCategory } from '@/@types/studies'
import { INDICATOR_TO_ACTION, Status as CPMSStatus, Status } from '@/@types/studies'
import type { TagProps } from '@/components/atoms/Tag/Tag'
import { FormStudyStatus } from '@/constants/editStudyForm'
import { getErrorMessage } from '@/utils/error'

import type { OrderType, StatusFilter } from '../@types/filters'
import { StudySponsorOrganisationRoleRTSIdentifier } from '../constants'
import { type OrganisationRoleShortName, organisationRoleShortName } from './organisations'
import { Prisma, prismaClient } from './prisma'

export type StudyEvalsWithoutGeneratedValues = Prisma.StudyEvaluationCategoryGetPayload<{
  select: {
    indicatorType: true
    indicatorValue: true
    sampleSize: true
    totalRecruitmentToDate: true
    plannedOpeningDate: true
    plannedClosureDate: true
    actualOpeningDate: true
    actualClosureDate: true
    expectedReopenDate: true
  }
}>

const sortMap = {
  'due-assessment': { dueAssessmentAt: { sort: Prisma.SortOrder.asc, nulls: Prisma.NullsOrder.last } },
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
  status,
}: {
  organisationIds: number[]
  currentPage: number
  pageSize: number
  searchTerm: string | null
  sortOrder: OrderType
  status?: Status[]
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
      ...(status?.length && {
        studyStatus: { in: status },
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
      dueAssessmentAt: true,
      irasId: true,
      regulatoryApprovalDate: true,
      studyStatus: true,
      willRecruitWithinTimeline: true,
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
      StudyFirst: {},
    },
    orderBy: [sortMap[sortOrder], { id: Prisma.SortOrder.asc }],
  }

  const [studies, count, countDue] = await prismaClient.$transaction([
    prismaClient.study.findMany(query),
    prismaClient.study.count({ where: query.where }),
    prismaClient.study.count({
      where: {
        ...query.where,
        dueAssessmentAt: { not: null },
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

export const getStudyTitlesForOrgs = async ({
  organisationIds
}: {
  organisationIds: number[]
}) => {
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
    select: {
      id: true,
      shortTitle: true,
      irasId: true,
    },
    orderBy: [{ shortTitle: Prisma.SortOrder.asc }],
  }

  const [studies] = await prismaClient.$transaction([
    prismaClient.study.findMany(query)
  ])

  return {
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
    orderBy: [
      { dueAssessmentAt: { sort: Prisma.SortOrder.asc, nulls: Prisma.NullsOrder.last } },
      { id: Prisma.SortOrder.asc },
    ],
  }

  return prismaClient.study.findMany(query)
}

export type UpdateStudyInput = Prisma.StudyUpdateInput

export const mapCPMSStatusToFormStatus = (cpmsStatus: string): string => {
  const statusMap: Record<string, string> = {
    [CPMSStatus.PreSetup]: FormStudyStatus.InSetup,
    [CPMSStatus.InSetup]: FormStudyStatus.InSetup,
    [CPMSStatus.InSetupPendingNHSPermission]: FormStudyStatus.InSetup,
    [CPMSStatus.InSetupApprovalReceived]: FormStudyStatus.InSetup,
    [CPMSStatus.InSetupPendingApproval]: FormStudyStatus.InSetup,
    [CPMSStatus.InSetupNHSPermissionReceived]: FormStudyStatus.InSetup,
    [CPMSStatus.OpenToRecruitment]: FormStudyStatus.OpenToRecruitment,
    [CPMSStatus.OpenWithRecruitment]: FormStudyStatus.OpenToRecruitment,
    [CPMSStatus.ClosedToRecruitment]: FormStudyStatus.Closed,
    [CPMSStatus.ClosedToRecruitmentNoFollowUp]: FormStudyStatus.Closed,
    [CPMSStatus.ClosedToRecruitmentFollowUpComplete]: FormStudyStatus.Closed,
    [CPMSStatus.SuspendedFromOpenWithRecruitment]: FormStudyStatus.Suspended,
    [CPMSStatus.SuspendedFromOpenToRecruitment]: FormStudyStatus.Suspended,
    [CPMSStatus.WithdrawnInPreSetup]: FormStudyStatus.Withdrawn,
    [CPMSStatus.WithdrawnDuringSetup]: FormStudyStatus.Withdrawn,
  }

  return statusMap[cpmsStatus] || cpmsStatus
}

export const mapFormStatusToCPMSStatus = (newStatus: string, currentStatus: string): string => {
  const isCurrentStatusOpenWithRecruitment = currentStatus === (CPMSStatus.OpenWithRecruitment as string)
  const isCurrentStatusSuspendedFromOpenWithRecruitment =
    currentStatus === (CPMSStatus.SuspendedFromOpenWithRecruitment as string)

  const statusMap = {
    [FormStudyStatus.InSetup]: CPMSStatus.InSetup,
    [FormStudyStatus.Closed]: CPMSStatus.ClosedToRecruitmentNoFollowUp,
    [FormStudyStatus.OpenToRecruitment]: isCurrentStatusSuspendedFromOpenWithRecruitment
      ? CPMSStatus.OpenWithRecruitment
      : CPMSStatus.OpenToRecruitment,
    [FormStudyStatus.Suspended]: isCurrentStatusOpenWithRecruitment
      ? CPMSStatus.SuspendedFromOpenWithRecruitment
      : CPMSStatus.SuspendedFromOpenToRecruitment,
    [FormStudyStatus.Withdrawn]: CPMSStatus.WithdrawnDuringSetup,
  }

  return statusMap[newStatus] || newStatus
}

export const mapFilterStatusesToStatuses = (
  filterStatuses: StatusFilter[] | undefined
): Status[] | undefined => {
  const filterStatusMap: Record<StatusFilter, Status[]> = {
    'in-setup': [
      Status.InSetup,
      Status.InSetupPendingNHSPermission,
      Status.InSetupApprovalReceived,
      Status.InSetupPendingApproval,
      Status.InSetupNHSPermissionReceived],
    open: [
      Status.OpenToRecruitment,
      Status.OpenWithRecruitment,
    ],
    suspended: [
      Status.Suspended,
      Status.SuspendedFromOpenWithRecruitment,
      Status.SuspendedFromOpenToRecruitment,
    ],
  }

  if (!filterStatuses?.length) {
    return undefined
  }

  const mapped = filterStatuses.flatMap((s) => filterStatusMap[s] ?? [])
  const unique = Array.from(new Set(mapped))

  return unique.length ? unique : undefined
}


export const mapCPMSStudyToSEStudy = (study: Study): UpdateStudyInput => ({
  cpmsId: study.StudyId,
  shortTitle: study.StudyShortName,
  studyStatus: study.StudyStatus,
  route: study.StudyRoute,
  sampleSize: study.SampleSize,
  totalRecruitmentToDate: study.TotalRecruitmentToDate,
  plannedOpeningDate: study.PlannedOpeningDate ? new Date(study.PlannedOpeningDate) : null,
  plannedClosureDate: study.PlannedClosureToRecruitmentDate ? new Date(study.PlannedClosureToRecruitmentDate) : null,
  actualOpeningDate: study.ActualOpeningDate ? new Date(study.ActualOpeningDate) : null,
  actualClosureDate: study.ActualClosureToRecruitmentDate ? new Date(study.ActualClosureToRecruitmentDate) : null,
  estimatedReopeningDate: study.EstimatedReopeningDate ? new Date(study.EstimatedReopeningDate) : null,
  leadAdministrationId: study.LeadAdministrationId,
  regulatoryApprovalDate: study.RegulatoryApprovalDate ? new Date(study.RegulatoryApprovalDate) : null
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

    logger.info(`Successfully updated study in SE with cpmsId: %s`, cpmsId)
    return {
      data: {
        ...study,
        organisationsByRole,
      },
    }
  } catch (error) {
    const errorMessage = getErrorMessage(error)

    logger.error(`Failed to update study in SE with cpmsId: %s, error: %s`, cpmsId, errorMessage)

    return {
      data: null,
      error: errorMessage,
    }
  }
}

export const mapCPMSStudyEvalToSEEval = (studyEvaluation: StudyEvaluationCategory) => ({
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

    logger.info('Successfully updated study evaluations in SE with studyId: %s', studyId)

    return { data: evaluationCategories, error: null }
  } catch (error) {
    const errorMessage = getErrorMessage(error)

    logger.error('Failed to update study evaluations in SE with studyId: %s', studyId)

    return {
      data: null,
      error: errorMessage,
    }
  }
}

export const setStudyAssessmentDueDate = async (studyIds: number[]) => {
  try {
    const assessmentDueResult = await setStudyAssessmentDue(studyIds)

    logger.info('Successfully checked if assessment is due for studys with Ids: %s', JSON.stringify(studyIds))

    return { data: assessmentDueResult.count }
  } catch (error) {
    const errorMessage = getErrorMessage(error)

    logger.error(
      'Failed to set study assessment due date for studys with Ids: %s, error: %s',
      JSON.stringify(studyIds),
      errorMessage
    )

    return {
      data: null,
      error: errorMessage,
    }
  }
}

export const setStudyAssessmentNotDue = async (studyIds: number[]) => {
  try {
    const assessmentNotDueResult = await setStudyAssessmentNotDueUtil(studyIds)

    logger.info('Successfully checked if assessment is not due for studys with Ids: %s', JSON.stringify(studyIds))

    return { data: assessmentNotDueResult.count }
  } catch (error) {
    const errorMessage = getErrorMessage(error)

    logger.error(
      'Failed to set study assessment as not due for studys with Ids: %s, error: %s',
      JSON.stringify(studyIds),
      errorMessage
    )

    return {
      data: null,
      error: errorMessage,
    }
  }
}

export function getDaysSinceAssessmentDue(dueAssessmentAt: Date | null): number | null {
  const today = dayjs();

  return dueAssessmentAt
    ? Math.round(today.diff(dueAssessmentAt, 'day', true))
    : null
}

const isAssessmentDueIndicator = (indicator: string | undefined) => indicator?.startsWith('Assessment due for')

export function getAssessmentDueIndicator(
  hasAssessmentDue: boolean,
  daysSinceAssessmentDue: number | null
): string | null {

  if (!hasAssessmentDue || daysSinceAssessmentDue === null) {
    return null
  };

  const days = daysSinceAssessmentDue;

  return `Assessment due for ${days} day${days > 1 ? 's' : ''}`;
}

function getActionKeyForIndicator(indicator: string): ActionKey | null {
  if (isAssessmentDueIndicator(indicator)) {
    return 'ASSESS_STUDY';
  }

  return INDICATOR_TO_ACTION[indicator];
}

export const ACTION_CONFIG = {
  ASSESS_STUDY: {
    path: 'assess',
    actionText: 'Assess study',
  },
  REVIEW_PLANNED_OPENING: {
    path: 'edit',
    actionText: 'Review planned opening date and study status',
  },
  REVIEW_PLANNED_CLOSING: {
    path: 'edit',
    actionText: 'Review planned closure date and study status',
  },
  REVIEW_EXPECTED_REOPENING: {
    path: 'edit',
    actionText: 'Review expected re-opening date and study status',
  },
  REVIEW_RECRUITMENT_TARGET: {
    path: 'edit',
    actionText: 'Review UK Recruitment target',
  },
  REVIEW_ACTUAL_OPENING: {
    path: 'edit',
    actionText: 'Review actual opening date and study status',
  },
};

export function buildSummaryRows(indicators: string[], basePath: string) {
  const grouped = new Map<ActionKey, TagProps[]>();

  indicators.forEach((indicator) => {
    const actionKey = getActionKeyForIndicator(indicator);
    if (!actionKey) return;

    if (!grouped.has(actionKey)) {
      grouped.set(actionKey, []);
    }

    grouped.get(actionKey)?.push({ text: indicator });
  });

  // Remove ASSESS_STUDY if an assessment is not due regardless of other indicators
  const assessTags = grouped.get('ASSESS_STUDY')
  if (assessTags) {
    const hasAssessmentDueIndicators = assessTags.some((t) => isAssessmentDueIndicator(t.text))
    logger.info(hasAssessmentDueIndicators)
    if (!hasAssessmentDueIndicators) {
      grouped.delete('ASSESS_STUDY')
    }
  }

  return Array.from(grouped.entries()).map(([actionKey, tags]) => {
    const { path, actionText } = ACTION_CONFIG[actionKey]

    return {
      href: `${basePath}/${path}`,
      actionText,
      tags,
    }
  })
}
