import type { Prisma } from 'database'

export type StudyWithRelationships = Prisma.StudyGetPayload<{
  include: {
    organisations: {
      include: {
        organisation: true
        organisationRole: true
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
  }))
