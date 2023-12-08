import { Mock } from 'ts-mockery'
import type { Prisma, Study } from 'database'
import { prismaMock } from '../__mocks__/prisma'
import { StudySponsorOrganisationRoleRTSIdentifier } from '../constants'
import { getStudyById, getStudiesForOrgs } from './studies'

describe('getStudiesForOrgs', () => {
  const mockStudies = [Mock.of<Study>({ id: 1, title: 'Study 1' }), Mock.of<Study>({ id: 2, title: 'Study 2' })]
  const mockStudyCount = 2
  const mockStudyDueAssessmentCount = 1

  const userOrganisationIds = [1, 2]

  const expectedOrganisationsQuery = {
    some: {
      organisationId: { in: userOrganisationIds },
      organisationRole: {
        rtsIdentifier: {
          in: [
            StudySponsorOrganisationRoleRTSIdentifier.ClinicalResearchSponsor,
            StudySponsorOrganisationRoleRTSIdentifier.ClinicalTrialsUnit,
            StudySponsorOrganisationRoleRTSIdentifier.ContractResearchOrganisation,
          ],
        },
      },
      isDeleted: false,
    },
  }

  it('should return studies and pagination information', async () => {
    prismaMock.$transaction.mockResolvedValueOnce([mockStudies, mockStudyCount, mockStudyDueAssessmentCount])

    const result = await getStudiesForOrgs({
      organisationIds: userOrganisationIds,
      pageSize: 10,
      currentPage: 1,
      searchTerm: null,
    })

    expect(result).toEqual({
      pagination: {
        total: mockStudyCount,
        totalDue: mockStudyDueAssessmentCount,
      },
      data: mockStudies,
    })

    expect(prismaMock.study.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 10,
        where: {
          organisations: expectedOrganisationsQuery,
          isDeleted: false,
        },
      })
    )

    expect(prismaMock.study.count).toHaveBeenCalledWith({
      where: {
        organisations: expectedOrganisationsQuery,
        isDeleted: false,
      },
    })
  })

  it('should query studies by study title, shortTitle, irasId and protocolReferenceNumber when a search term is provided', async () => {
    prismaMock.$transaction.mockResolvedValueOnce([mockStudies, mockStudyCount, mockStudyDueAssessmentCount])

    const searchTerm = 'test-study'

    const result = await getStudiesForOrgs({
      organisationIds: userOrganisationIds,
      pageSize: 10,
      currentPage: 1,
      searchTerm,
    })

    expect(result).toEqual({
      pagination: {
        total: mockStudyCount,
        totalDue: mockStudyDueAssessmentCount,
      },
      data: mockStudies,
    })

    expect(prismaMock.study.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 10,
        where: {
          OR: [
            { title: { contains: searchTerm } },
            { shortTitle: { contains: searchTerm } },
            { irasId: { contains: searchTerm } },
            { protocolReferenceNumber: { contains: searchTerm } },
          ],
          organisations: expectedOrganisationsQuery,
          isDeleted: false,
        },
      })
    )

    expect(prismaMock.study.count).toHaveBeenCalledWith({
      where: {
        OR: [
          { title: { contains: searchTerm } },
          { shortTitle: { contains: searchTerm } },
          { irasId: { contains: searchTerm } },
          { protocolReferenceNumber: { contains: searchTerm } },
        ],
        organisations: expectedOrganisationsQuery,
        isDeleted: false,
      },
    })
  })

  it('should query studies by cpmsId when a numeric search term is provided', async () => {
    prismaMock.$transaction.mockResolvedValueOnce([mockStudies, mockStudyCount, mockStudyDueAssessmentCount])

    const searchTerm = '123'

    await getStudiesForOrgs({
      organisationIds: userOrganisationIds,
      pageSize: 10,
      currentPage: 1,
      searchTerm,
    })

    expect(prismaMock.study.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 10,
        where: {
          OR: [
            { title: { contains: searchTerm } },
            { shortTitle: { contains: searchTerm } },
            { irasId: { contains: searchTerm } },
            { protocolReferenceNumber: { contains: searchTerm } },
            { cpmsId: Number(searchTerm) },
          ],
          organisations: expectedOrganisationsQuery,
          isDeleted: false,
        },
      })
    )

    expect(prismaMock.study.count).toHaveBeenCalledWith({
      where: {
        OR: [
          { title: { contains: searchTerm } },
          { shortTitle: { contains: searchTerm } },
          { irasId: { contains: searchTerm } },
          { protocolReferenceNumber: { contains: searchTerm } },
          { cpmsId: Number(searchTerm) },
        ],
        organisations: expectedOrganisationsQuery,
        isDeleted: false,
      },
    })
  })
})

describe('getStudyById', () => {
  const mockStudy = Mock.of<
    Prisma.StudyGetPayload<{
      include: {
        title: true
        organisations: {
          include: {
            organisation: true
            organisationRole: true
          }
        }
      }
    }>
  >({
    id: 1,
    title: 'Study 1',
    organisations: [],
  })

  const userOrganisationIds = [1, 2]

  it('returns a study with the given id', async () => {
    prismaMock.$transaction.mockResolvedValueOnce([mockStudy])

    const result = await getStudyById(1, userOrganisationIds)

    expect(result).toEqual({
      data: {
        ...mockStudy,
        organisationsByRole: {},
      },
    })

    expect(prismaMock.study.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          id: 1,
          isDeleted: false,
          organisations: {
            some: {
              organisationId: { in: userOrganisationIds },
              isDeleted: false,
            },
          },
        },
      })
    )

    expect(result.data?.id).toEqual(1)
    expect(result.data?.title).toEqual('Study 1')
  })

  it('maps organisation roles to organisation name', async () => {
    const mockStudyWithOrgs = {
      ...mockStudy,
      organisations: [
        {
          organisation: {
            name: 'Pfizer clinical trials',
          },
          organisationRole: {
            name: 'Managing Clinical Trials Unit',
          },
        },
      ],
    }

    prismaMock.$transaction.mockResolvedValueOnce([mockStudyWithOrgs])

    const result = await getStudyById(1, userOrganisationIds)

    expect(result).toEqual({
      data: {
        ...mockStudyWithOrgs,
        organisationsByRole: {
          CTU: 'Pfizer clinical trials',
        },
      },
    })
  })
})
