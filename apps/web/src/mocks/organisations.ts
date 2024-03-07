import { Mock } from 'ts-mockery'

import type { StudyOrganisationWithRelations } from '@/lib/organisations'

export const mockClinicalResearchSponsor = Mock.of<StudyOrganisationWithRelations>({
  organisation: {
    id: 123,
    name: 'Test Clinical Research Sponsor',
  },
  organisationRole: {
    id: 123,
    name: 'Clinical Research Sponsor',
  },
})

export const mockContactResearchOrganisation = Mock.of<StudyOrganisationWithRelations>({
  organisation: {
    id: 123,
    name: 'Test Contract Research Organisation',
  },
  organisationRole: {
    id: 123,
    name: 'Contract Research Organisation',
  },
})

export const mockStudyOrganisations = [mockClinicalResearchSponsor, mockContactResearchOrganisation]
