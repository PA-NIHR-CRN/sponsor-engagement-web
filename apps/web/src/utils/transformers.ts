import type { Prisma } from 'database'
import { formatDate } from './date'

export type StudyWithRelationships = Prisma.StudyGetPayload<{
  select: {
    id: true
    name: true
    organisations: {
      include: {
        organisation: true
        organisationRole: true
      }
    }
    evaluationCategories: true
    assessments: {
      include: {
        status: true
      }
    }
  }
}>

export const transformStudies = (studies: StudyWithRelationships[]) =>
  studies.map((study) => ({
    id: study.id,
    name: study.name,
    organisations: study.organisations.map((studyOrg) => ({
      name: studyOrg.organisation.name,
      roleName: studyOrg.organisationRole.name,
      roleIdentifier: studyOrg.organisationRole.rtsIdentifier,
    })),
    assessments: study.assessments.map((assessment) => ({
      id: assessment.id,
      status: assessment.status,
      createdAt: formatDate(assessment.createdAt),
      updatedAt: formatDate(assessment.updatedAt),
    })),
    evaluationCategories: study.evaluationCategories.map((evalCategory) => ({
      indicatorType: evalCategory.indicatorType,
    })),
  }))
