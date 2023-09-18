import assert from 'assert'
import axios from 'axios'
import {
  Organisation as OrganisationEntity,
  Prisma,
  SysRefOrganisationRole as SysRefOrganisationRoleEntity,
} from 'database'
import { logger } from 'logger'

import { prismaClient } from './lib/prisma'
import { Study, StudyRecordStatus, StudyStatus, StudyWithRelations } from './types'
import { getOrganisationName, getOrgsUniqueByName, getOrgsUniqueByNameRole, getOrgsUniqueByRole } from './utils'

// Entities related to the current batch of studies
let studyEntities: StudyWithRelations[] = []
let organisationEnitities: OrganisationEntity[] = []
let organisationRoleEntities: SysRefOrganisationRoleEntity[] = []

// Running cache of all entity IDs
const allStudyIds: number[] = []
const allOrganisationIds: number[] = []

let studies: Study[]

const createStudies = async () => {
  const studyQueries = studies.map((study) => {
    const studyData = {
      id: study.Id,
      name: study.Name,
      status: study.Status,
      recordStatus: study.StudyRecordStatus,
      route: study.StudyRoute,
      irasId: study.IrasId,
      protocolReferenceNumber: study.ProtocolReferenceNumber,
      sampleSize: study.SampleSize,
      chiefInvestigatorFirstName: study.ChiefInvestigatorFirstName,
      chiefInvestigatorLastName: study.ChiefInvestigatorLastName,
      managingSpeciality: study.ManagingSpecialty,
      plannedOpeningDate: study.PlannedRecruitmentStartDate ? new Date(study.PlannedRecruitmentStartDate) : undefined,
      plannedClosureDate: study.PlannedRecruitmentEndDate ? new Date(study.PlannedRecruitmentEndDate) : undefined,
      actualOpeningDate: study.ActualOpeningDate ? new Date(study.ActualOpeningDate) : undefined,
      actualClosureDate: study.ActualClosureDate ? new Date(study.ActualClosureDate) : undefined,
      isDeleted: false,
    }

    return prismaClient.study.upsert({
      where: { id: study.Id },
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

    const organisationData = {
      name,
      rtsIdentifier: org.OrganisationRTSIdentifier,
    }

    return prismaClient.organisation.upsert({
      where: { name },
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

    const organisationRoleData = {
      name,
      description: '',
      rtsIdentifier: org.OrganisationRoleRTSIdentifier,
    }

    return prismaClient.sysRefOrganisationRole.upsert({
      where: { name },
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
  const organisationRoleInputs = relatedOrgs
    .map((relatedOrg) => {
      const organisationId = organisationEnitities.find((org) => org.name === getOrganisationName(relatedOrg))?.id
      const roleId = organisationRoleEntities.find((ref) => ref.name === relatedOrg.OrganisationRole)?.id
      if (organisationId && roleId) {
        return {
          organisationId,
          roleId,
        }
      }
    })
    .filter((input): input is Prisma.OrganisationRoleCreateManyInput => !!input)

  const organisationRolesResult = await prismaClient.organisationRole.createMany({
    data: organisationRoleInputs,
    skipDuplicates: true,
  })

  logger.info(`Added ${organisationRolesResult.count} organisation roles`)

  // Create the array of study organisations for this batch of studies
  const studyOrganisationInputs = studies
    .map((study) =>
      study.StudySponsors.map((sponsor) => {
        const organisationId = organisationEnitities.find((org) => org.name === sponsor.OrganisationName)?.id
        const organisationRoleId = organisationRoleEntities.find((ref) => ref.name === sponsor.OrganisationRole)?.id
        if (organisationId && organisationRoleId) {
          return {
            studyId: study.Id,
            organisationId,
            organisationRoleId,
          }
        }
      })
    )
    .flat()
    .filter((input): input is Prisma.StudyOrganisationCreateManyInput => !!input)

  const studyOrganisationsResult = await prismaClient.studyOrganisation.createMany({
    data: studyOrganisationInputs,
    skipDuplicates: true,
  })

  logger.info(`Added ${studyOrganisationsResult.count} study organisations`)

  // Create the array of study funders for this batch of studies
  const studyFunderInputs = studies
    .map((study) =>
      study.StudyFunders.map((funder) => {
        const organisationId = organisationEnitities.find((org) => org.name === funder.FunderName)?.id
        if (organisationId) {
          return {
            studyId: study.Id,
            organisationId,
            grantCode: funder.GrantCode,
            fundingStreamName: funder.FundingStreamName || '',
          }
        }
      })
    )
    .flat()
    .filter((input): input is Prisma.StudyFunderCreateManyInput => !!input)

  const studyFundersResult = await prismaClient.studyFunder.createMany({
    data: studyFunderInputs,
    skipDuplicates: true,
  })

  logger.info(`Added ${studyFundersResult.count} study funders`)

  // Create the array of evaluation categories for this batch of studies
  const evaluationCategoryInputs = studies
    .map((study) =>
      study.StudyEvaluationCategories.map((category) => ({
        studyId: study.Id,
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
        actualClosureDate: category.ActualClosedDate ? new Date(category.ActualClosedDate) : undefined,
        expectedReopenDate: category.ExpectedReopenDate ? new Date(category.ExpectedReopenDate) : undefined,
      }))
    )
    .flat()

  const evaluationCategoriesResult = await prismaClient.studyEvaluationCategory.createMany({
    data: evaluationCategoryInputs,
    skipDuplicates: true,
  })

  logger.info(`Added ${evaluationCategoriesResult.count} study evaluation categories`)
}

const fetchStudies = async function* (url: string, username: string, password: string) {
  const pageSize = 1000
  let pageNumber = 1
  let totalStudies = 0
  while (totalStudies === 0 || pageNumber * pageSize < totalStudies) {
    try {
      logger.info(`Request studies page: ${pageNumber}`)
      const { data } = await axios.get(url, {
        headers: {
          username: username,
          password: password,
        },
        params: {
          pageSize: 1000,
          pageNumber,
          studyStatus: [
            StudyStatus.OpenActivelyRecruiting,
            StudyStatus.OpenToRecruitment,
            StudyStatus.ClosedInFollowUp,
            StudyStatus.SuspendedActivelyRecruiting,
            StudyStatus.SuspendedOpenRecruitment,
            StudyStatus.InSetupRecruiting,
            StudyStatus.InSetupPermissionReceived,
            StudyStatus.InSetupPendingApplication,
            StudyStatus.InSetupPendingNHSPerm,
          ],
          studyRecordStatus: [StudyRecordStatus.Live, StudyRecordStatus.LiveChangesPendingApproval],
        },
      })
      totalStudies = data.Result.TotalRecords
      ++pageNumber
      yield data.Result.Studies as Study[]
    } catch (e) {
      logger.error(`Error fetching studies data`, e)
      yield []
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
  }
}
