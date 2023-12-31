import type { UserOrganisation } from 'database'
import { Mock } from 'ts-mockery'

import { prismaMock } from '../__mocks__/prisma'
import type {
  OrganisationWithRelations,
  StudyOrganisationWithRelations,
  UserOrganisationWithRelations,
} from './organisations'
import {
  getOrganisationById,
  getUserOrganisationById,
  getUserOrganisations,
  isClinicalResearchSponsor,
} from './organisations'

describe('getUserOrganisations', () => {
  it('returns organisations for the user', async () => {
    const mockUserOrganisation = Mock.of<UserOrganisation>({ organisationId: 123 })

    prismaMock.userOrganisation.findMany.mockResolvedValueOnce([mockUserOrganisation])

    const userOrgs = await getUserOrganisations(123)

    expect(prismaMock.userOrganisation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: 123, isDeleted: false },
      })
    )

    expect(userOrgs).toStrictEqual([mockUserOrganisation])
  })
})

describe('getOrganisationById', () => {
  it('returns an organisation by its id', async () => {
    const mockOrganisation = Mock.of<OrganisationWithRelations>({
      id: 123,
      roles: [
        {
          role: {
            name: 'Clinical Research Sponsor',
          },
        },
        {
          role: {
            name: 'Contract Research Organisation',
          },
        },
      ],
    })

    prismaMock.organisation.findFirst.mockResolvedValueOnce(mockOrganisation)

    const organisation = await getOrganisationById(123)

    expect(prismaMock.organisation.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 123, isDeleted: false },
      })
    )

    expect(organisation).toStrictEqual({ ...mockOrganisation, roles: ['Sponsor', 'CRO'] })
  })
})

describe('getUserOrganisationById', () => {
  it('returns a user organisation by its id', async () => {
    const mockUserOrganisation = Mock.of<UserOrganisationWithRelations>({
      id: 123,
    })

    prismaMock.userOrganisation.findFirst.mockResolvedValueOnce(mockUserOrganisation)

    const userOrganisation = await getUserOrganisationById(123)

    expect(prismaMock.userOrganisation.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 123 },
      })
    )

    expect(userOrganisation).toStrictEqual(mockUserOrganisation)
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
