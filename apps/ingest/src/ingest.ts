import assert from 'assert'
import axios from 'axios'
import type {
  Organisation as OrganisationEntity,
  SysRefOrganisationRole as SysRefOrganisationRoleEntity,
} from 'database'
import { logger } from '@nihr-ui/logger'
import { config as dotEnvConfig } from 'dotenv'
import { setStudyAssessmentDue, setStudyAssessmentNotDue } from 'shared-utilities'
import { prismaClient } from './lib/prisma'
import type { Study, StudySponsor, StudyWithRelationships } from './types'
import { StudyRecordStatus, StudyStatus } from './types'
import { getOrganisationName, getOrgsUniqueByName, getOrgsUniqueByNameRole, getOrgsUniqueByRole } from './utils'

dotEnvConfig()

// Entities related to the current batch of studies
let studyEntities: StudyWithRelationships[] = []
let organisationEnitities: OrganisationEntity[] = []
let organisationRoleRefEntities: SysRefOrganisationRoleEntity[] = []

type OrgRoleTuple = [organisationId: number, roleId: number]

// Running cache of all entity IDs
let allStudyIds: number[]
let allOrganisationIds: number[]
let allOrganisationRoleIds: OrgRoleTuple[]

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
      managingSpeciality: study.ManagingSpecialty,
      totalRecruitmentToDate: study.TotalRecruitmentToDate,
      plannedOpeningDate: study.PlannedRecruitmentStartDate ? new Date(study.PlannedRecruitmentStartDate) : null,
      plannedClosureDate: study.PlannedRecruitmentEndDate ? new Date(study.PlannedRecruitmentEndDate) : null,
      actualOpeningDate: study.ActualOpeningDate ? new Date(study.ActualOpeningDate) : null,
      actualClosureDate: study.ActualClosureDate ? new Date(study.ActualClosureDate) : null,
      estimatedReopeningDate: study.EstimatedReopeningDate ? new Date(study.EstimatedReopeningDate) : null,
      isDeleted: false,
      leadAdministrationId: study.LeadAdministrationId,
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
        funders: {
          include: {
            organisation: true,
          },
        },
        evaluationCategories: {
          select: { id: true, indicatorValue: true },
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
      isDeleted: false,
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
    const name = org.OrganisationRole
    const rtsIdentifier = org.OrganisationRoleRTSIdentifier

    const organisationRoleData = {
      name,
      description: '',
      rtsIdentifier,
      isDeleted: false,
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

  const organisationRoleInputs = relatedOrgs.map((relatedOrg) => {
    const organisationId = organisationEnitities.find((org) => org.name === getOrganisationName(relatedOrg))!.id
    const roleId = organisationRoleRefEntities.find((ref) => ref.name === relatedOrg.OrganisationRole)!.id
    return {
      organisationId,
      roleId,
    }
  })

  const organisationRolesResult = await prismaClient.organisationRole.createMany({
    data: organisationRoleInputs,
    skipDuplicates: true,
  })

  allOrganisationRoleIds.push(
    ...organisationRoleInputs.map(({ organisationId, roleId }) => [organisationId, roleId] as OrgRoleTuple)
  )

  logger.info(`Added ${organisationRolesResult.count} organisation roles`)
}

const createStudyRelationships = async () => {
  const studyEntityIds = studyEntities.map((study) => study.id)

  // Add study organisations
  const studyOrganisationInputs = studies
    .map((study) =>
      study.StudySponsors.map((sponsor) => {
        const studyId = studyEntities.find((studyEntity) => studyEntity.cpmsId === study.Id)!.id
        const organisationId = organisationEnitities.find((org) => org.name === sponsor.OrganisationName)!.id
        const organisationRoleId = organisationRoleRefEntities.find((ref) => ref.name === sponsor.OrganisationRole)!.id
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

  // Delete study organisations
  const deletedStudyOrganisationIds = studyEntities
    .map((study) =>
      study.organisations
        .filter(
          (studyOrg) =>
            !studyOrganisationInputs.some(
              ({ studyId, organisationId, organisationRoleId }) =>
                studyId === study.id &&
                organisationId === studyOrg.organisationId &&
                organisationRoleId === studyOrg.organisationRoleId
            )
        )
        .map((studyOrg) => studyOrg.id)
    )
    .flat()

  const [, { count: deletedStudyOrgCount }] = await prismaClient.$transaction([
    prismaClient.studyOrganisation.updateMany({
      where: { studyId: { in: studyEntityIds }, NOT: { id: { in: deletedStudyOrganisationIds } } },
      data: { isDeleted: false },
    }),
    prismaClient.studyOrganisation.updateMany({
      where: { id: { in: deletedStudyOrganisationIds }, isDeleted: false },
      data: { isDeleted: true },
    }),
  ])

  if (deletedStudyOrgCount > 0) {
    logger.info('Flagged %s study organisations as deleted', deletedStudyOrgCount)
  }

  // Add study funders
  const studyFunderInputs = studies
    .map((study) =>
      study.StudyFunders.map((funder) => {
        const studyId = studyEntities.find((studyEntity) => studyEntity.cpmsId === study.Id)!.id
        const organisationId = organisationEnitities.find((org) => org.name === funder.FunderName)!.id
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

  // Add study evaluation categories
  const evaluationCategoryInputs = studies
    .map((study) =>
      study.StudyEvaluationCategories.map((category) => {
        const studyId = studyEntities.find((studyEntity) => studyEntity.cpmsId === study.Id)!.id

        const evaluationCategoryData = {
          studyId,
          indicatorType: category.EvaluationCategoryType,
          indicatorValue: category.EvaluationCategoryValue,
          sampleSize: category.SampleSize,
          totalRecruitmentToDate: category.TotalRecruitmentToDate,
          plannedOpeningDate: category.PlannedRecruitmentStartDate
            ? new Date(category.PlannedRecruitmentStartDate)
            : null,
          plannedClosureDate: category.PlannedRecruitmentEndDate ? new Date(category.PlannedRecruitmentEndDate) : null,
          actualOpeningDate: category.ActualOpeningDate ? new Date(category.ActualOpeningDate) : null,
          actualClosureDate: category.ActualClosureDate ? new Date(category.ActualClosureDate) : null,
          expectedReopenDate: category.ExpectedReopenDate ? new Date(category.ExpectedReopenDate) : null,
          isDeleted: false,
        }

        return prismaClient.studyEvaluationCategory.upsert({
          where: {
            studyId_indicatorValue: {
              studyId,
              indicatorValue: category.EvaluationCategoryValue,
            },
          },
          update: evaluationCategoryData,
          create: evaluationCategoryData,
        })
      })
    )
    .flat()

  const evaluationCategories = await Promise.all(evaluationCategoryInputs)

  logger.info(`Added or updated ${evaluationCategories.length} study evaluation categories`)

  // Delete study evaluation categories
  const deletedEvaluationCategoryIds = studyEntities
    .map((study) =>
      study.evaluationCategories
        .filter(
          (evalCategory) =>
            !evaluationCategories.some(
              ({ studyId, indicatorValue }) => studyId === study.id && indicatorValue === evalCategory.indicatorValue
            )
        )
        .map((evalCategory) => evalCategory.id)
    )
    .flat()

  const { count: deletedEvalCategoryCount } = await prismaClient.studyEvaluationCategory.updateMany({
    where: { id: { in: deletedEvaluationCategoryIds }, isDeleted: false },
    data: { isDeleted: true },
  })

  if (deletedEvalCategoryCount > 0) {
    logger.info('Flagged %s study evaluation categories as deleted', deletedEvalCategoryCount)
  }
}

const fetchStudies = async function* (url: string, username: string, password: string) {
  logger.info(`ingest ${process.env.APP_ENV}: fetching studies from ${url}`)

  const pageSize = 250
  let pageNumber = 1
  let totalStudies = 0
  while (totalStudies === 0 || pageNumber * pageSize < totalStudies + pageSize) {
    try {
      logger.info(`Request studies page: ${pageNumber} (total ${totalStudies})`)
      // eslint-disable-next-line no-await-in-loop -- generator loop
      const { data } = await axios.get<{
        Result: {
          TotalRecords: number
          Studies: Study[]
        }
      }>(url, {
        headers: { username, password },
        params: {
          pageSize,
          pageNumber,
          studyStatus: [
            StudyStatus.InSetup,
            StudyStatus.InSetupPendingApproval,
            StudyStatus.InSetupApprovalReceived,
            StudyStatus.OpenToRecruitment,
            StudyStatus.OpenActivelyRecruiting,
            StudyStatus.SuspendedOpenRecruitment,
            StudyStatus.SuspendedActivelyRecruiting,
          ],
          studyRecordStatus: [StudyRecordStatus.Live, StudyRecordStatus.LiveChangesPendingApproval],
          includeDevolvedAdministrationLedStudies: true,
        },
      })
      totalStudies = data.Result.TotalRecords
      ++pageNumber
      yield data.Result.Studies
    } catch (error) {
      logger.error('Error occurred while fetching study data')
      if (axios.isAxiosError(error)) {
        logger.error('Error response data: %s', JSON.stringify(error.response?.data))
      }
      logger.error(error)
      yield
    }
  }
}

const deleteStudies = async () => {
  const currentStudies = await prismaClient.study.findMany({
    select: { id: true },
    where: { isDeleted: false },
  })

  const deletedStudyIds = currentStudies.filter(({ id }) => !allStudyIds.includes(id)).map(({ id }) => id)

  if (deletedStudyIds.length > 0) {
    await prismaClient.study.updateMany({ where: { id: { in: deletedStudyIds } }, data: { isDeleted: true } })
    logger.info('Flagged %s studies as deleted', deletedStudyIds.length)
  }
}

const deleteOrganisationRoles = async () => {
  const currentOrgRoles = await prismaClient.organisationRole.findMany({
    select: { id: true, roleId: true, organisationId: true },
  })

  const currentOrgRolesById = Object.fromEntries(
    currentOrgRoles.map(({ id, organisationId, roleId }) => [id, [organisationId, roleId]])
  )

  const deletedOrgRoleIds = Object.keys(currentOrgRolesById)
    .filter((id) => {
      const [currentOrgId, currentOrgRoleId] = currentOrgRolesById[id]
      return !allOrganisationRoleIds.some(([orgId, roleId]) => orgId === currentOrgId && roleId === currentOrgRoleId)
    })
    .map(Number)

  const [, { count: deletedOrgRoleCount }] = await prismaClient.$transaction([
    prismaClient.organisationRole.updateMany({
      where: { NOT: { id: { in: deletedOrgRoleIds } } },
      data: { isDeleted: false },
    }),
    prismaClient.organisationRole.updateMany({
      where: { id: { in: deletedOrgRoleIds }, isDeleted: false },
      data: { isDeleted: true },
    }),
  ])

  if (deletedOrgRoleCount > 0) {
    logger.info('Flagged %s organisation roles as deleted', deletedOrgRoleCount)
  }
}

export const ingest = async () => {
  const { API_URL, API_USERNAME, API_PASSWORD } = process.env

  assert(API_URL)
  assert(API_USERNAME)
  assert(API_PASSWORD)

  allStudyIds = []
  allOrganisationIds = []
  allOrganisationRoleIds = []

  for await (const studyRecords of fetchStudies(API_URL, API_USERNAME, API_PASSWORD)) {
    if (!studyRecords) return

    studies = studyRecords.map((study) => ({
      ...study,
      StudySponsors: study.StudySponsors.map(
        (sponsor) =>
          ({
            ...sponsor,
            OrganisationRole: sponsor.OrganisationRole.trim(),
          } as StudySponsor)
      ),
    }))

    await createStudies()
    await createOrganisations()
    await createOrganisationRelationships()
    await createStudyRelationships()

    const ids = studyEntities.map((study) => study.id)
    await setStudyAssessmentDue(ids)
    await setStudyAssessmentNotDue(ids)
  }

  await deleteStudies()
  await deleteOrganisationRoles()
}
