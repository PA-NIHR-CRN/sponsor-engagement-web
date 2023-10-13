import { Mock } from 'ts-mockery'
import type { UserOrganisation } from 'database'
import { prismaMock } from '../__mocks__/prisma'
import { getUserOrganisations, isClinicalResearchSponsor, type StudyOrganisationWithRelations } from './organisations'

describe('getUserOrganisations', () => {
  it('returns organisations for the user', async () => {
    const mockUserOrganisation = Mock.of<UserOrganisation>({ organisationId: 123 })

    prismaMock.userOrganisation.findMany.mockResolvedValueOnce([mockUserOrganisation])

    const userOrgs = await getUserOrganisations(123)

    expect(prismaMock.userOrganisation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 123 },
      })
    )

    expect(userOrgs).toStrictEqual([mockUserOrganisation])
  })
})

describe('isClinicalResearchSponsor', () => {
  const mockClinicalResearchSponsor = Mock.of<StudyOrganisationWithRelations>({
    organisation: {
      id: 123,
      name: 'Test Clinical Research Sponsor',
    },
    organisationRole: {
      id: 123,
      name: 'Clinical Research Sponsor',
    },
  })

  const mockContactResearchOrganisation = Mock.of<StudyOrganisationWithRelations>({
    organisation: {
      id: 123,
      name: 'Test Contract Research Organisation',
    },
    organisationRole: {
      id: 123,
      name: 'Contract Research Organisation',
    },
  })

  it('returns true if the organisation is a Clinical Research Sponsor', () => {
    expect(isClinicalResearchSponsor(mockClinicalResearchSponsor)).toBe(true)
    expect(isClinicalResearchSponsor(mockContactResearchOrganisation)).toBe(false)
  })
})
