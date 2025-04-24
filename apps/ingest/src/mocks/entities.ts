import type {
  Organisation as OrganisationEntity,
  OrganisationRole as OrganisationRoleEntity,
  SysRefOrganisationRole as SysRefOrganisationRoleEntity,
  StudyEvaluationCategory as EvalCategoryEntity,
} from 'database'
import { simpleFaker } from '@faker-js/faker'
import { Mock } from 'ts-mockery'
import type { Study, StudyWithRelationships } from '../types'
import { getOrganisationName, getOrgsUniqueByName, getOrgsUniqueByNameRole, getOrgsUniqueByRole } from '../utils'
import studies from './studies.json'

const organisationNameToId = Object.fromEntries(
  getOrgsUniqueByName(studies.Result.Studies as Study[]).map((org) => [
    getOrganisationName(org),
    simpleFaker.number.int(),
  ])
)

const organisationRoleNameToId = Object.fromEntries(
  getOrgsUniqueByRole(studies.Result.Studies as Study[]).map((org) => [org.OrganisationRole, simpleFaker.number.int()])
)

export const studyEntities = studies.Result.Studies.map((study) =>
  Mock.of<StudyWithRelationships>({
    id: study.Id,
    cpmsId: study.Id,
    irasId: study.IrasId,
    title: study.Title,
    shortTitle: study.ShortName,
    organisations: study.StudySponsors.map(({ OrganisationName, OrganisationRole }) => ({
      id: simpleFaker.number.int(),
      organisationId: organisationNameToId[OrganisationName],
      organisationRoleId: organisationRoleNameToId[OrganisationRole],
      organisation: { name: OrganisationName, id: organisationNameToId[OrganisationName] },
      organisationRole: { name: OrganisationRole, id: organisationRoleNameToId[OrganisationRole] },
    })),
    funders: study.StudyFunders.map((org) => ({
      organisation: { name: org.FunderName, id: simpleFaker.number.int() },
    })),
    evaluationCategories: study.StudyEvaluationCategories.map((evalCategory) => ({
      id: simpleFaker.number.int(),
      indicatorValue: evalCategory.EvaluationCategoryValue,
    })),
  })
)

export const organisationEntities = Object.keys(organisationNameToId).map((name) =>
  Mock.of<OrganisationEntity>({
    id: organisationNameToId[name],
    name,
  })
)

export const organisationRoleRefEntities = Object.keys(organisationRoleNameToId).map((name) =>
  Mock.of<SysRefOrganisationRoleEntity>({
    id: organisationRoleNameToId[name],
    name,
  })
)

export const organisationRoleEntities = getOrgsUniqueByNameRole(studies.Result.Studies as Study[]).map((org) =>
  Mock.of<OrganisationRoleEntity>({
    id: simpleFaker.number.int(),
    organisationId: organisationNameToId[getOrganisationName(org)],
    roleId: organisationRoleNameToId[org.OrganisationRole],
  })
)

export const evalCategoryEntities = studies.Result.Studies.map((study) =>
  study.StudyEvaluationCategories.map((category) =>
    Mock.of<EvalCategoryEntity>({
      studyId: study.Id,
      indicatorType: category.EvaluationCategoryType,
      indicatorValue: category.EvaluationCategoryValue,
      sampleSize: category.SampleSize,
      totalRecruitmentToDate: category.TotalRecruitmentToDate,
      plannedOpeningDate: category.PlannedRecruitmentStartDate
        ? new Date(category.PlannedRecruitmentStartDate)
        : undefined,
      plannedClosureDate: category.PlannedRecruitmentEndDate ? new Date(category.PlannedRecruitmentEndDate) : undefined,
      actualOpeningDate: category.ActualOpeningDate ? new Date(category.ActualOpeningDate) : undefined,
      actualClosureDate: category.ActualClosureDate ? new Date(category.ActualClosureDate) : undefined,
      expectedReopenDate: category.ExpectedReopenDate ? new Date(category.ExpectedReopenDate) : undefined,
    })
  )
).flat()
