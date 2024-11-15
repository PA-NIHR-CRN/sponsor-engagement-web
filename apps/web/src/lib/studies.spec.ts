import type { Study } from 'database'
import { Prisma } from 'database'
import { Mock } from 'ts-mockery'

import { mockCPMSStudy } from '@/mocks/studies'

import { prismaMock } from '../__mocks__/prisma'
import { StudySponsorOrganisationRoleRTSIdentifier } from '../constants'
import type { UpdateStudyInput } from './studies'
import {
  getStudiesForOrgs,
  getStudyById,
  mapCPMSStatusToFormStatus,
  mapCPMSStudyEvalToSEEval,
  mapCPMSStudyToSEStudy,
  updateEvaluationCategories,
  updateStudy,
} from './studies'

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

describe('updateStudy', () => {
  type StudyWithOrganisations = Prisma.StudyGetPayload<{
    include: {
      organisations: {
        include: {
          organisation: true
          organisationRole: true
        }
      }
    }
  }>

  const studyId = 1212
  const mockStudyInputs = Mock.of<UpdateStudyInput>({ cpmsId: studyId, title: 'Study 1' })

  const mockActualStudy = Mock.of<StudyWithOrganisations>({
    id: studyId,
    title: mockStudyInputs.title as string,
    cpmsId: mockStudyInputs.cpmsId as number,
    isDueAssessment: true,
    createdAt: new Date('2001-01-01'),
    managingSpeciality: 'Cancer',
    organisations: [
      {
        organisation: {
          id: 1212,
          name: 'Test Organisation',
        },
        organisationRole: {
          id: 1213,
          name: 'Clinical Research Sponsor',
        },
      },
    ],
  })

  it('correctly updates and returns the study with given id', async () => {
    prismaMock.study.update.mockResolvedValueOnce(mockActualStudy)

    const result = await updateStudy(studyId, mockStudyInputs)

    expect(result).toEqual({
      data: {
        ...mockActualStudy,
        organisationsByRole: { Sponsor: mockActualStudy.organisations[0].organisation.name },
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
          evaluationCategories: {
            select: { id: true, indicatorValue: true },
          },
        },
      })
    )

    expect(result.data?.cpmsId).toEqual(mockActualStudy.cpmsId)
    expect(result.data?.title).toEqual(mockActualStudy.title)
  })

  it('returns the correct error message when there is an error', async () => {
    const errorMessage = 'Oh no, an error!'

    prismaMock.study.update.mockRejectedValueOnce(new Error(errorMessage))

    const result = await updateStudy(studyId, mockStudyInputs)
    expect(result).toEqual({ data: null, error: errorMessage })
  })
})

describe('updateEvaluationCategories', () => {
  const mockStudyId = 9282382

  const mockEvaluationCategoriesResponse = Mock.of<Prisma.StudyEvaluationCategoryGetPayload<undefined>>({
    studyId: 18108,
    indicatorType: 'Missed milestone',
    indicatorValue: 'Study is past planned opening date',
    sampleSize: 3,
    totalRecruitmentToDate: 0,
    plannedOpeningDate: new Date('2020-10-09T23:00:00.000Z'),
    plannedClosureDate: new Date('2020-10-09T23:00:00.000Z'),
    actualOpeningDate: new Date('2020-10-09T23:00:00.000Z'),
    actualClosureDate: null,
    expectedReopenDate: null,
    createdAt: new Date('2020-10-09T23:00:00.000Z'),
    updatedAt: new Date('2020-10-09T23:00:00.000Z'),
    isDeleted: false,
  })

  it('correctly updates and returns an evaluation when no deletion is required and there is a single evaluation record', async () => {
    prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce({
      ...mockEvaluationCategoriesResponse,
      id: 484022,
    })

    const result = await updateEvaluationCategories(mockStudyId, [mockEvaluationCategoriesResponse], [])

    expect(result).toEqual({ data: [{ ...mockEvaluationCategoriesResponse, id: 484022 }], error: null })

    expect(prismaMock.studyEvaluationCategory.upsert).toHaveBeenCalledTimes(1)
    expect(prismaMock.studyEvaluationCategory.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          studyId_indicatorValue: {
            studyId: mockStudyId,
            indicatorValue: mockEvaluationCategoriesResponse.indicatorValue,
          },
        },
        update: mockEvaluationCategoriesResponse,
        create: mockEvaluationCategoriesResponse,
      })
    )

    expect(prismaMock.studyEvaluationCategory.updateMany).not.toHaveBeenCalled()
  })

  it('correctly updates and returns evaluations when no deletion is required and there are multiple evaluations', async () => {
    const mockEvaluationCategoriesResponseTwo = Mock.of<Prisma.StudyEvaluationCategoryGetPayload<undefined>>({
      studyId: 934834,
      indicatorType: 'Missed milestone',
      indicatorValue: 'Study is past planned opening date',
      sampleSize: 3,
      totalRecruitmentToDate: 0,
      plannedOpeningDate: new Date('2020-10-09T23:00:00.000Z'),
      plannedClosureDate: new Date('2020-10-09T23:00:00.000Z'),
      actualOpeningDate: new Date('2020-10-09T23:00:00.000Z'),
      actualClosureDate: null,
      expectedReopenDate: null,
      createdAt: new Date('2020-10-09T23:00:00.000Z'),
      updatedAt: new Date('2020-10-09T23:00:00.000Z'),
      isDeleted: false,
    })

    prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce({
      ...mockEvaluationCategoriesResponse,
      id: 484022,
    })
    prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce({
      ...mockEvaluationCategoriesResponseTwo,
      id: 484023,
    })

    const result = await updateEvaluationCategories(
      mockStudyId,
      [mockEvaluationCategoriesResponse, mockEvaluationCategoriesResponseTwo],
      []
    )

    expect(result).toEqual({
      data: [
        { ...mockEvaluationCategoriesResponse, id: 484022 },
        {
          ...mockEvaluationCategoriesResponseTwo,
          id: 484023,
        },
      ],
      error: null,
    })

    expect(prismaMock.studyEvaluationCategory.upsert).toHaveBeenCalledTimes(2)
    expect(prismaMock.studyEvaluationCategory.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          studyId_indicatorValue: {
            studyId: mockStudyId,
            indicatorValue: mockEvaluationCategoriesResponse.indicatorValue,
          },
        },
        update: mockEvaluationCategoriesResponse,
        create: mockEvaluationCategoriesResponse,
      })
    )
    expect(prismaMock.studyEvaluationCategory.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          studyId_indicatorValue: {
            studyId: mockStudyId,
            indicatorValue: mockEvaluationCategoriesResponseTwo.indicatorValue,
          },
        },
        update: mockEvaluationCategoriesResponseTwo,
        create: mockEvaluationCategoriesResponseTwo,
      })
    )

    expect(prismaMock.studyEvaluationCategory.updateMany).not.toHaveBeenCalled()
  })

  it('correctly updates and deletes a given evaluation, when deletion is required', async () => {
    const studyEvalToDelete = 2323232

    prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce({
      ...mockEvaluationCategoriesResponse,
      id: 484022,
    })

    const result = await updateEvaluationCategories(
      mockStudyId,
      [mockEvaluationCategoriesResponse],
      [studyEvalToDelete]
    )

    expect(result).toEqual({ data: [{ ...mockEvaluationCategoriesResponse, id: 484022 }], error: null })

    expect(prismaMock.studyEvaluationCategory.upsert).toHaveBeenCalledTimes(1)
    expect(prismaMock.studyEvaluationCategory.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          studyId_indicatorValue: {
            studyId: mockStudyId,
            indicatorValue: mockEvaluationCategoriesResponse.indicatorValue,
          },
        },
        update: mockEvaluationCategoriesResponse,
        create: mockEvaluationCategoriesResponse,
      })
    )

    expect(prismaMock.studyEvaluationCategory.updateMany).toHaveBeenCalledTimes(1)
    expect(prismaMock.studyEvaluationCategory.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: { in: [studyEvalToDelete] }, isDeleted: false },
        data: { isDeleted: true },
      })
    )
  })

  it('returns the correct error message when there is an error updating a study evaluation', async () => {
    const errorMessage = 'Oh no, an error!'

    prismaMock.studyEvaluationCategory.upsert.mockRejectedValueOnce(new Error(errorMessage))

    const result = await updateEvaluationCategories(mockStudyId, [mockEvaluationCategoriesResponse], [])
    expect(result).toEqual({ data: null, error: errorMessage })
  })

  it('returns the correct error message when there is an error deleting a study evaluation', async () => {
    const studyEvalToDelete = 2323232
    const errorMessage = 'Oh no, an error!'

    prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce({
      ...mockEvaluationCategoriesResponse,
      id: 484022,
    })
    prismaMock.studyEvaluationCategory.updateMany.mockRejectedValueOnce(new Error(errorMessage))

    const result = await updateEvaluationCategories(
      mockStudyId,
      [mockEvaluationCategoriesResponse],
      [studyEvalToDelete]
    )
    expect(result).toEqual({ data: null, error: errorMessage })
  })
})

describe('mapCPMSStudyToSEStudy', () => {
  const mockMappedStudy = {
    cpmsId: mockCPMSStudy.StudyId,
    shortTitle: mockCPMSStudy.StudyShortName,
    studyStatus: mockCPMSStudy.StudyStatus,
    route: mockCPMSStudy.StudyRoute,
    sampleSize: mockCPMSStudy.SampleSize,
    totalRecruitmentToDate: mockCPMSStudy.TotalRecruitmentToDate,
    plannedOpeningDate: new Date(mockCPMSStudy.PlannedOpeningDate as string),
    plannedClosureDate: new Date(mockCPMSStudy.PlannedClosureToRecruitmentDate as string),
    actualOpeningDate: new Date(mockCPMSStudy.ActualOpeningDate as string),
    actualClosureDate: new Date(mockCPMSStudy.ActualClosureToRecruitmentDate as string),
    estimatedReopeningDate: new Date(mockCPMSStudy.EstimatedReopeningDate as string),
    isDueAssessment: false,
  }

  it('correctly maps data when all fields exist', () => {
    const result = mapCPMSStudyToSEStudy(mockCPMSStudy)
    expect(result).toStrictEqual(mockMappedStudy)
  })

  it('correctly maps date fields when they do not exist', () => {
    const result = mapCPMSStudyToSEStudy({
      ...mockCPMSStudy,
      PlannedOpeningDate: '',
      PlannedClosureToRecruitmentDate: '',
      ActualOpeningDate: '',
      ActualClosureToRecruitmentDate: '',
      EstimatedReopeningDate: '',
    })
    expect(result).toStrictEqual({
      ...mockMappedStudy,
      actualClosureDate: null,
      actualOpeningDate: null,
      plannedClosureDate: null,
      plannedOpeningDate: null,
      estimatedReopeningDate: null,
    })
  })
})

describe('mapCPMSStudyEvalToSEEval', () => {
  const mockCPMSEvals = mockCPMSStudy.StudyEvaluationCategories[0]

  const mockMappedEval = {
    indicatorType: mockCPMSEvals.EvaluationCategoryType,
    indicatorValue: mockCPMSEvals.EvaluationCategoryValue,
    sampleSize: mockCPMSEvals.SampleSize,
    totalRecruitmentToDate: mockCPMSEvals.TotalRecruitmentToDate,
    plannedOpeningDate: new Date(mockCPMSEvals.PlannedRecruitmentStartDate as string),
    plannedClosureDate: new Date(mockCPMSEvals.PlannedRecruitmentEndDate as string),
    actualOpeningDate: new Date(mockCPMSEvals.ActualOpeningDate as string),
    actualClosureDate: new Date(mockCPMSEvals.ActualClosureDate as string),
    expectedReopenDate: new Date(mockCPMSEvals.ExpectedReopenDate as string),
    isDeleted: false,
  }
  it('correctly maps data when all fields exist', () => {
    const result = mapCPMSStudyEvalToSEEval(mockCPMSEvals)
    expect(result).toStrictEqual(mockMappedEval)
  })

  it('correctly maps date fields when they do not exist', () => {
    const result = mapCPMSStudyEvalToSEEval({
      ...mockCPMSEvals,
      PlannedRecruitmentStartDate: '',
      PlannedRecruitmentEndDate: '',
      ActualOpeningDate: '',
      ActualClosureDate: '',
    })
    expect(result).toStrictEqual({
      ...mockMappedEval,
      plannedOpeningDate: null,
      plannedClosureDate: null,
      actualOpeningDate: null,
      actualClosureDate: null,
    })
  })
})

describe('mapCPMSStatusToFormStatus', () => {
  it.each([
    ['Pre-Setup', 'In setup'],
    ['In Setup, Pending NHS Permission', 'In setup'],
    ['Closed to Recruitment', 'Closed'],
    ['Withdrawn During Setup', 'Withdrawn'],
  ])('correctly maps known statuses', (inputValue: string, expectedValue: string) => {
    const result = mapCPMSStatusToFormStatus(inputValue)
    expect(result).toEqual(expectedValue)
  })

  it('correctly returns the input value when a mapping does not exist', () => {
    const mockUnknownStatus = 'unknown'
    const result = mapCPMSStatusToFormStatus(mockUnknownStatus)
    expect(result).toEqual(mockUnknownStatus)
  })
})
