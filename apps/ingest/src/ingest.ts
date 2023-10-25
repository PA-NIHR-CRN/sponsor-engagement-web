import assert from 'assert'
import axios from 'axios'
import { Organisation as OrganisationEntity, SysRefOrganisationRole as SysRefOrganisationRoleEntity } from 'database'
import { logger } from 'logger'
import dayjs from 'dayjs'

import { prismaClient } from './lib/prisma'
import { Study, StudyRecordStatus, StudyStatus, StudyWithRelationships } from './types'
import { getOrganisationName, getOrgsUniqueByName, getOrgsUniqueByNameRole, getOrgsUniqueByRole } from './utils'

// Entities related to the current batch of studies
let studyEntities: StudyWithRelationships[] = []
let organisationEnitities: OrganisationEntity[] = []
let organisationRoleEntities: SysRefOrganisationRoleEntity[] = []

// Running cache of all entity IDs
const allStudyIds: number[] = []
const allOrganisationIds: number[] = []

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
    }

    return prismaClient.study.upsert({
      where: { cpmsId: study.Id },
      create: studyData,
      update: studyData,
      include: {
        organisations: {
          include: {
            organisation: true,
          },
        },
        funders: {
          include: {
            organisation: true,
          },
        },
      },
    })
  })

  studyEntities = await Promise.all(studyQueries)

  allStudyIds.push(...studyEntities.map((study) => study.id))

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
    }

    return prismaClient.organisation.upsert({
      where: { rtsIdentifier },
      create: organisationData,
      update: organisationData,
    })
  })

  organisationEnitities = await Promise.all(organisationQueries)

  allOrganisationIds.push(...organisationEnitities.map((org) => org.id))

  logger.info(`Finished adding/updating organisations`)

  const relatedOrgRoles = getOrgsUniqueByRole(studies)

  logger.info(`Found ${relatedOrgRoles.length} related organisation roles`)

  const organisationRoleRefQueries = relatedOrgRoles.map((org) => {
    const name = org.OrganisationRole.trim()
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

  organisationRoleEntities = await Promise.all(organisationRoleRefQueries)

  logger.info(`Finished adding/updating organisation role refs`)
}

const createOrganisationRelationships = async () => {
  const relatedOrgs = getOrgsUniqueByNameRole(studies)

  // Create the array of organisation roles for this batch of studies
  const organisationRoleInputs = relatedOrgs.map((relatedOrg) => {
    const organisationId = organisationEnitities.find((org) => org.name === getOrganisationName(relatedOrg))
      ?.id as number
    const roleId = organisationRoleEntities.find((ref) => ref.name === relatedOrg.OrganisationRole)?.id as number
    return {
      organisationId,
      roleId,
    }
  })

  const organisationRolesResult = await prismaClient.organisationRole.createMany({
    data: organisationRoleInputs,
    skipDuplicates: true,
  })

  logger.info(`Added ${organisationRolesResult.count} organisation roles`)

  // Create the array of study organisations for this batch of studies
  const studyOrganisationInputs = studies
    .map((study) =>
      study.StudySponsors.map((sponsor) => {
        const studyId = studyEntities.find((studyEntity) => studyEntity.cpmsId === study.Id)?.id as number
        const organisationId = organisationEnitities.find((org) => org.name === sponsor.OrganisationName)?.id as number
        const organisationRoleId = organisationRoleEntities.find((ref) => ref.name === sponsor.OrganisationRole)
          ?.id as number
        return {
          studyId,
          organisationId,
          organisationRoleId,
        }
      })
    )
    .flat()

  const studyOrganisationsResult = await prismaClient.studyOrganisation.createMany({
    data: studyOrganisationInputs,
    skipDuplicates: true,
  })

  logger.info(`Added ${studyOrganisationsResult.count} study organisations`)

  // Create the array of study funders for this batch of studies
  const studyFunderInputs = studies
    .map((study) =>
      study.StudyFunders.map((funder) => {
        const studyId = studyEntities.find((studyEntity) => studyEntity.cpmsId === study.Id)?.id as number
        const organisationId = organisationEnitities.find((org) => org.name === funder.FunderName)?.id as number
        return {
          studyId,
          organisationId,
          grantCode: funder.GrantCode,
          fundingStreamName: funder.FundingStreamName || '',
        }
      })
    )
    .flat()

  const studyFundersResult = await prismaClient.studyFunder.createMany({
    data: studyFunderInputs,
    skipDuplicates: true,
  })

  logger.info(`Added ${studyFundersResult.count} study funders`)

  // Create the array of evaluation categories for this batch of studies
  const evaluationCategoryInputs = studies
    .map((study) =>
      study.StudyEvaluationCategories.map((category) => {
        const studyId = studyEntities.find((studyEntity) => studyEntity.cpmsId === study.Id)?.id as number
        return {
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
        }
      })
    )
    .flat()

  const evaluationCategoriesResult = await prismaClient.studyEvaluationCategory.createMany({
    data: evaluationCategoryInputs,
    skipDuplicates: true,
  })

  logger.info(`Added ${evaluationCategoriesResult.count} study evaluation categories`)
}

const setAssessmentDue = async () => {
  const threeMonthsAgo = dayjs().subtract(3, 'month').toDate()
  const assessmentDueResult = await prismaClient.study.updateMany({
    data: {
      isDueAssessment: true,
    },
    where: {
      id: { in: studyEntities.map((study) => study.id) },
      actualOpeningDate: { lte: threeMonthsAgo },
      evaluationCategories: {
        some: {},
      },
      assessments: {
        every: {
          updatedAt: {
            lte: threeMonthsAgo,
          },
        },
      },
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

  for await (const studyRecords of fetchStudies(API_URL, API_USERNAME, API_PASSWORD)) {
    studies = studyRecords.filter((study) => !!study.QualificationDate)

    await createStudies()
    await createOrganisations()
    await createOrganisationRelationships()
    await setAssessmentDue()
  }
}
