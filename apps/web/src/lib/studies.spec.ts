import { Prisma, type Study } from 'database'
import { Mock } from 'ts-mockery'

import { prismaMock } from '../__mocks__/prisma'
import { StudySponsorOrganisationRoleRTSIdentifier } from '../constants'
import type { UpdateStudyInput } from './studies'
import { getStudiesForOrgs, getStudyById, updateStudy } from './studies'

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
      sortOrder: 'due-assessment',
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
        orderBy: [{ isDueAssessment: Prisma.SortOrder.desc }, { id: Prisma.SortOrder.asc }],
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
      sortOrder: 'due-assessment',
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
      sortOrder: 'due-assessment',
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

  it('should allow sorting by last assessment date (ascending)', async () => {
    prismaMock.$transaction.mockResolvedValueOnce([mockStudies, mockStudyCount, mockStudyDueAssessmentCount])

    await getStudiesForOrgs({
      organisationIds: userOrganisationIds,
      pageSize: 10,
      currentPage: 1,
      searchTerm: null,
      sortOrder: 'last-assessment-asc',
    })

    expect(prismaMock.study.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [
          {
            lastAssessment: {
              createdAt: Prisma.SortOrder.asc,
            },
          },
          { id: Prisma.SortOrder.asc },
        ],
      })
    )
  })

  it('should allow sorting by last assessment date (descending)', async () => {
    prismaMock.$transaction.mockResolvedValueOnce([mockStudies, mockStudyCount, mockStudyDueAssessmentCount])

    await getStudiesForOrgs({
      organisationIds: userOrganisationIds,
      pageSize: 10,
      currentPage: 1,
      searchTerm: null,
      sortOrder: 'last-assessment-desc',
    })

    expect(prismaMock.study.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [
          {
            lastAssessment: {
              createdAt: Prisma.SortOrder.desc,
            },
          },
          { id: Prisma.SortOrder.asc },
        ],
      })
    )
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

describe('UpdateStudy', () => {
  const studyId = 1212
  const mockStudyInputs = Mock.of<UpdateStudyInput>({ cpmsId: studyId, title: 'Study 1' })
  const mockUpdatedStudy = {
    ...mockStudyInputs,
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

  it('correctly updates and returns the study with given id', async () => {
    prismaMock.study.update.mockResolvedValueOnce(mockUpdatedStudy)

    const result = await updateStudy(studyId, mockStudyInputs)

    expect(result).toEqual({
      data: {
        ...mockUpdatedStudy,
        organisationsByRole: { CTU: 'Pfizer clinical trials' },
      },
    })

    expect(prismaMock.study.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          cpmsId: studyId,
        },
        data: { ...mockStudyInputs },
        include: {
          organisations: {
            where: {
              isDeleted: false,
            },
            include: {
              organisation: true,
              organisationRole: true,
            },
          },
        },
      })
    )

    expect(result.data?.cpmsId).toEqual(mockUpdatedStudy.cpmsId)
    expect(result.data?.title).toEqual(mockUpdatedStudy.title)
  })

  it('returns the correct error message when there is an error', async () => {
    const errorMessage = 'Oh no, an error!'

    prismaMock.study.update.mockRejectedValueOnce(new Error(errorMessage))

    const result = await updateStudy(studyId, mockStudyInputs)
    expect(result).toEqual({ data: null, error: errorMessage })
  })
})
