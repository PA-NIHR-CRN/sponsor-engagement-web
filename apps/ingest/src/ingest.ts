import assert from 'assert'
import axios from 'axios'
import { Organisation as OrganisationEntity, SysRefOrganisationRole as SysRefOrganisationRoleEntity } from 'database'
import { logger } from 'logger'
import dayjs from 'dayjs'

import { prismaClient } from './lib/prisma'
import { Study, StudyRecordStatus, StudySponsor, StudyStatus, StudyWithRelationships } from './types'
import { getOrganisationName, getOrgsUniqueByName, getOrgsUniqueByNameRole, getOrgsUniqueByRole } from './utils'

// Entities related to the current batch of studies
let studyEntities: StudyWithRelationships[] = []
let organisationEnitities: OrganisationEntity[] = []
let organisationRoleRefEntities: SysRefOrganisationRoleEntity[] = []

let studies: Study[]

const createStudies = async () => {
  const studyQueries = studies.map((study) => {
    const studyData = {
      cpmsId: study.Id,
      title: study.Title,
      shortTitle: study.ShortName,
      studyStatus: study.StudyStatus,
      recordStatus: study.StudyRecordStatus,
      route: study.StudyRoute,
      irasId: study.IrasId,
      protocolReferenceNumber: study.ProtocolReferenceNumber,
      sampleSize: study.SampleSize,
      chiefInvestigatorFirstName: study.ChiefInvestigatorFirstName,
      chiefInvestigatorLastName: study.ChiefInvestigatorLastName,
      managingSpeciality: study.ManagingSpecialty ?? '',
      totalRecruitmentToDate: study.TotalRecruitmentToDate,
      plannedOpeningDate: study.PlannedRecruitmentStartDate ? new Date(study.PlannedRecruitmentStartDate) : undefined,
      plannedClosureDate: study.PlannedRecruitmentEndDate ? new Date(study.PlannedRecruitmentEndDate) : undefined,
      actualOpeningDate: study.ActualOpeningDate ? new Date(study.ActualOpeningDate) : undefined,
      actualClosureDate: study.ActualClosureDate ? new Date(study.ActualClosureDate) : undefined,
      isDueAssessment: false,
      isDeleted: false,
      isTempDeleted: false,
    }

    return prismaClient.study.upsert({
      where: { cpmsId: study.Id },
      create: studyData,
      update: studyData,
      include: {
        organisations: {
          include: {
            organisation: true,
            organisationRole: true,
          },
        },
      },
    })
  })

  studyEntities = await Promise.all(studyQueries)

  logger.info(`Finished adding/updating studies`)
}

const createOrganisations = async () => {
  const relatedOrgs = getOrgsUniqueByName(studies)

  logger.info(`Found ${relatedOrgs.length} related organisations`)

  const organisationQueries = relatedOrgs.map((org) => {
    const name = getOrganisationName(org)
    const rtsIdentifier = org.OrganisationRTSIdentifier

    const organisationData = {
      name,
      rtsIdentifier,
      isDeleted: false,
      isTempDeleted: false,
    }

    return prismaClient.organisation.upsert({
      where: { rtsIdentifier },
      create: organisationData,
      update: organisationData,
    })
  })

  organisationEnitities = await Promise.all(organisationQueries)

  logger.info(`Finished adding/updating organisations`)

  const relatedOrgRoles = getOrgsUniqueByRole(studies)

  logger.info(`Found ${relatedOrgRoles.length} related organisation roles`)

  const organisationRoleRefQueries = relatedOrgRoles.map((org) => {
    const name = org.OrganisationRole
    const rtsIdentifier = org.OrganisationRoleRTSIdentifier

    const organisationRoleData = {
      name,
      description: '',
      rtsIdentifier,
    }

    return prismaClient.sysRefOrganisationRole.upsert({
      where: { rtsIdentifier },
      create: organisationRoleData,
      update: organisationRoleData,
    })
  })

  organisationRoleRefEntities = await Promise.all(organisationRoleRefQueries)

  logger.info(`Finished adding/updating organisation role refs`)
}

const createOrganisationRelationships = async () => {
  const relatedOrgs = getOrgsUniqueByNameRole(studies)

  // OrganisationRole

  const organisationRoleInputs = relatedOrgs.map((relatedOrg) => {
    const organisationId = organisationEnitities.find((org) => org.name === getOrganisationName(relatedOrg))
      ?.id as number
    const roleId = organisationRoleRefEntities.find((ref) => ref.name === relatedOrg.OrganisationRole)?.id as number

    const organisationRoleData = {
      organisationId,
      roleId,
      isDeleted: false,
      isTempDeleted: false,
    }

    return prismaClient.organisationRole.upsert({
      where: {
        organisationId_roleId: {
          organisationId,
          roleId,
        },
      },
      create: organisationRoleData,
      update: organisationRoleData,
    })
  })

  await Promise.all(organisationRoleInputs)

  logger.info(`Added organisation roles`)
}

const createStudyRelationships = async () => {
  const studyEntityIds = studyEntities.map((study) => study.id)

  // StudyOrganisation

  await prismaClient.studyOrganisation.updateMany({
    where: { studyId: { in: studyEntityIds } },
    data: { isTempDeleted: true },
  })

  const studyOrganisationInputs = studies
    .map((study) =>
      study.StudySponsors.map((sponsor) => {
        const studyId = studyEntities.find((studyEntity) => studyEntity.cpmsId === study.Id)?.id as number
        const organisationId = organisationEnitities.find((org) => org.name === sponsor.OrganisationName)?.id as number
        const organisationRoleId = organisationRoleRefEntities.find((ref) => ref.name === sponsor.OrganisationRole)
          ?.id as number

        const studyOrganisationData = {
          studyId,
          organisationId,
          organisationRoleId,
          isDeleted: false,
          isTempDeleted: false,
        }

        return prismaClient.studyOrganisation.upsert({
          where: {
            studyId_organisationId: {
              studyId,
              organisationId,
            },
          },
          create: studyOrganisationData,
          update: studyOrganisationData,
        })
      })
    )
    .flat()

  await Promise.all(studyOrganisationInputs)

  logger.info(`Added study organisations`)

  const { count: deletedStudyOrgsCount } = await prismaClient.studyOrganisation.updateMany({
    where: { isTempDeleted: true },
    data: { isDeleted: true, isTempDeleted: false },
  })

  if (deletedStudyOrgsCount > 0) {
    logger.info('Flagged %s study organisations as deleted', deletedStudyOrgsCount)
  }

  // StudyEvaluationCategory

  await prismaClient.studyEvaluationCategory.updateMany({
    where: { studyId: { in: studyEntityIds } },
    data: { isTempDeleted: true },
  })

  const evaluationCategoryInputs = studies
    .map((study) =>
      study.StudyEvaluationCategories.map((category) => {
        const studyId = studyEntities.find((studyEntity) => studyEntity.cpmsId === study.Id)?.id as number

        const evaluationCategoryData = {
          studyId,
          indicatorType: category.EvaluationCategoryType,
          indicatorValue: category.EvaluationCategoryValue,
          sampleSize: category.SampleSize,
          totalRecruitmentToDate: category.TotalRecruitmentToDate,
          plannedOpeningDate: category.PlannedRecruitmentStartDate
            ? new Date(category.PlannedRecruitmentStartDate)
            : undefined,
          plannedClosureDate: category.PlannedRecruitmentEndDate
            ? new Date(category.PlannedRecruitmentEndDate)
            : undefined,
          actualOpeningDate: category.ActualOpeningDate ? new Date(category.ActualOpeningDate) : undefined,
          actualClosureDate: category.ActualClosureDate ? new Date(category.ActualClosureDate) : undefined,
          expectedReopenDate: category.ExpectedReopenDate ? new Date(category.ExpectedReopenDate) : undefined,
          isDeleted: false,
          isTempDeleted: false,
        }

        return prismaClient.studyEvaluationCategory.upsert({
          where: {
            studyId_indicatorValue: {
              studyId,
              indicatorValue: evaluationCategoryData.indicatorValue,
            },
          },
          create: evaluationCategoryData,
          update: evaluationCategoryData,
        })
      })
    )
    .flat()

  await Promise.all(evaluationCategoryInputs)

  logger.info(`Added study evaluation categories`)

  const { count: deletedEvalCategoriesCount } = await prismaClient.studyEvaluationCategory.updateMany({
    where: { isTempDeleted: true },
    data: { isDeleted: true, isTempDeleted: false },
  })

  if (deletedEvalCategoriesCount > 0) {
    logger.info('Flagged %s study evaluation categories as deleted', deletedEvalCategoriesCount)
  }
}

const setAssessmentDue = async () => {
  const threeMonthsAgo = dayjs().subtract(3, 'month').toDate()
  const assessmentDueResult = await prismaClient.study.updateMany({
    data: {
      isDueAssessment: true,
    },
    where: {
      id: { in: studyEntities.map((study) => study.id) },
      evaluationCategories: {
        some: {},
      },
      assessments: {
        every: {
          createdAt: {
            lte: threeMonthsAgo,
          },
        },
      },
      OR: [{ actualOpeningDate: null }, { actualOpeningDate: { lte: threeMonthsAgo } }],
    },
  })

  logger.info(`Flagged ${assessmentDueResult.count} studies as being due assessment`)
}

const fetchStudies = async function* (url: string, username: string, password: string) {
  const pageSize = 1000
  let pageNumber = 1
  let totalStudies = 0
  while (totalStudies === 0 || pageNumber * pageSize < totalStudies + pageSize) {
    try {
      logger.info(`Request studies page: ${pageNumber} (total ${totalStudies})`)
      const { data } = await axios.get(url, {
        headers: {
          username: username,
          password: password,
        },
        params: {
          pageSize: 1000,
          pageNumber,
          studyStatus: [
            StudyStatus.InSetup,
            StudyStatus.InSetupPendingApproval,
            StudyStatus.InSetupApprovalReceived,
            StudyStatus.OpenToRecruitment,
            StudyStatus.OpenActivelyRecruiting,
            StudyStatus.ClosedInFollowUp,
            StudyStatus.SuspendedOpenRecruitment,
            StudyStatus.SuspendedActivelyRecruiting,
          ],
          studyRecordStatus: [StudyRecordStatus.Live, StudyRecordStatus.LiveChangesPendingApproval],
        },
      })
      totalStudies = data.Result.TotalRecords
      ++pageNumber
      yield data.Result.Studies as Study[]
    } catch (error) {
      logger.error(error, 'Error fetching studies data')
      if (axios.isAxiosError(error)) {
        logger.error(error.response?.data, 'Error response')
      }
      return
    }
  }
}

export const ingest = async () => {
  const { API_URL, API_USERNAME, API_PASSWORD } = process.env

  assert(API_URL)
  assert(API_USERNAME)
  assert(API_PASSWORD)

  await prismaClient.study.updateMany({ data: { isTempDeleted: true } })
  await prismaClient.organisation.updateMany({ data: { isTempDeleted: true } })
  await prismaClient.organisationRole.updateMany({ data: { isTempDeleted: true } })

  for await (const studyRecords of fetchStudies(API_URL, API_USERNAME, API_PASSWORD)) {
    studies = studyRecords
      .filter((study) => !!study.QualificationDate)
      .map((study) => ({
        ...study,
        StudySponsors: study.StudySponsors.map(
          (sponsor) =>
            ({
              ...sponsor,
              // Trim OrganisationRole to remove whitespace in reference data
              OrganisationRole: sponsor.OrganisationRole.trim(),
            } as StudySponsor)
        ),
      }))

    await createStudies()
    await createOrganisations()
    await createOrganisationRelationships()
    await createStudyRelationships()
    await setAssessmentDue()
  }

  const { count: deletedStudiesCount } = await prismaClient.study.updateMany({
    where: { isTempDeleted: true },
    data: { isDeleted: true, isTempDeleted: false },
  })

  const { count: deletedOrgsCount } = await prismaClient.organisation.updateMany({
    where: { isTempDeleted: true },
    data: { isDeleted: true, isTempDeleted: false },
  })

  const { count: deletedOrgRolesCount } = await prismaClient.organisationRole.updateMany({
    where: { OR: [{ isTempDeleted: true }, { organisation: { isDeleted: true } }] },
    data: { isDeleted: true, isTempDeleted: false },
  })

  const { count: deletedStudyOrgsCount } = await prismaClient.studyOrganisation.updateMany({
    where: { study: { isDeleted: true } },
    data: { isDeleted: true, isTempDeleted: false },
  })

  const { count: deletedEvalCategoriesCount } = await prismaClient.studyEvaluationCategory.updateMany({
    where: { study: { isDeleted: true } },
    data: { isDeleted: true, isTempDeleted: false },
  })

  if (deletedStudiesCount > 0) {
    logger.info('Flagged %s studies as deleted', deletedStudiesCount)
  }

  if (deletedOrgsCount > 0) {
    logger.info('Flagged %s organisations as deleted', deletedOrgsCount)
  }

  if (deletedOrgRolesCount > 0) {
    logger.info('Flagged %s organisation roles as deleted', deletedOrgRolesCount)
  }

  if (deletedStudyOrgsCount > 0) {
    logger.info('Flagged %s study organisations as deleted', deletedStudyOrgsCount)
  }

  if (deletedEvalCategoriesCount > 0) {
    logger.info('Flagged %s study evaluation categories as deleted', deletedEvalCategoriesCount)
  }
}
