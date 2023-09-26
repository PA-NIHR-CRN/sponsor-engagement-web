import { Organisation as OrganisationEntity, SysRefOrganisationRole as SysRefOrganisationRoleEntity } from 'database'
import { Mock } from 'ts-mockery'

import { Study, StudyWithRelations } from '../types'
import { getOrganisationName, getOrgsUniqueByName, getOrgsUniqueByRole } from '../utils'
import studies from './studies.json'

export const studyEntities = studies.Result.Studies.map((study) =>
  Mock.of<StudyWithRelations>({
    id: 123,
    cpmsId: study.Id,
    name: study.Name,
    organisations: study.StudySponsors.map((org) => ({
      organisation: { name: org.OrganisationName, id: 12345 },
    })),
    funders: study.StudyFunders.map((org) => ({
      organisation: { name: org.FunderName, id: 12345 },
    })),
  })
)

export const organisationEntities = getOrgsUniqueByName(studies.Result.Studies as Study[]).map((org) =>
  Mock.of<OrganisationEntity>({
    name: getOrganisationName(org),
    id: 12345,
  })
)

export const organisationRoleEntities = getOrgsUniqueByRole(studies.Result.Studies as Study[]).map((org) =>
  Mock.of<SysRefOrganisationRoleEntity>({
    name: org.OrganisationRole,
    id: 12345,
  })
)
