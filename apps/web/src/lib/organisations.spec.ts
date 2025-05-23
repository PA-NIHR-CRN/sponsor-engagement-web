import type { Prisma, UserOrganisation } from 'database'
import { Mock } from 'ts-mockery'

import {
  mockClinicalResearchSponsor,
  mockContactResearchOrganisation,
  mockStudyOrganisations,
} from '@/mocks/organisations'

import { prismaMock } from '../__mocks__/prisma'
import type { OrganisationWithRelations, UserOrganisationWithRelations } from './organisations'
import {
  getOrganisationById,
  getSponsorOrgName,
  getStudyOrganisations,
  getSupportOrgName,
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

describe('getStudyOrganisations', () => {
  it(`should make the correct DB request when there is a 'searchTerm'`, async () => {
    const searchTerm = 'Novartis'
    const currentPage = 1
    const pageSize = 1

    const query = {
      skip: currentPage * pageSize - pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        roles: {
          select: {
            role: true,
          },
        },
      },
      orderBy: [{ name: 'asc' }],
      where: {
        OR: [
          {
            name: {
              contains: searchTerm,
            },
          },
          {
            users: {
              some: {
                user: {
                  is: {
                    email: searchTerm,
                    isDeleted: false,
                  },
                },
                isDeleted: false,
              },
            },
          },
        ],
        studies: {
          some: {},
        },
        isDeleted: false,
      },
    }

    const mockOrganisation = Mock.of<OrganisationWithRelations>({
      id: 123,
      name: 'Novartis',
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

    prismaMock.$transaction.mockResolvedValueOnce([[mockOrganisation], 1])

    await getStudyOrganisations({ currentPage, pageSize, searchTerm })

    expect(prismaMock.organisation.findMany).toHaveBeenCalledWith(query)
  })
})

it(`should apply user filter if 'userId' parameter is defined`, async () => {
  const searchTerm = 'Novartis'
  const userId = 1211

  const mockOrganisation = Mock.of<OrganisationWithRelations>({
    id: 123,
    name: 'Novartis',
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

  prismaMock.$transaction.mockResolvedValueOnce([[mockOrganisation], 1])

  await getStudyOrganisations({ currentPage: 1, pageSize: 1, searchTerm, userId })

  expect(prismaMock.organisation.findMany).toHaveBeenCalledWith(
    expect.objectContaining({
      where: expect.objectContaining({
        users: {
          some: {
            isDeleted: { equals: false },
            userId: { equals: 1211 },
          },
        },
      }) as Prisma.OrganisationWhereInput,
    })
  )
})

describe('isClinicalResearchSponsor', () => {
  it('returns true if the organisation is a Clinical Research Sponsor', () => {
    expect(isClinicalResearchSponsor(mockClinicalResearchSponsor)).toBe(true)
    expect(isClinicalResearchSponsor(mockContactResearchOrganisation)).toBe(false)
  })
})

describe('getSponsorOrgName', () => {
  it('returns the name of the associated sponsor organisation', () => {
    expect(getSponsorOrgName(mockStudyOrganisations)).toBe('Test Clinical Research Sponsor')
  })
})

describe('getSupportOrgName', () => {
  it('returns the name of the associated support organisation (i.e. CTU/CRO)', () => {
    expect(getSupportOrgName(mockStudyOrganisations)).toBe('Test Contract Research Organisation')
  })
})
