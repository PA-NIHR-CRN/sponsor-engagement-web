import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { logger } from '@nihr-ui/logger'
import { setStudyAssessmentDue, setStudyAssessmentNotDue } from 'shared-utilities'
import { ingest } from '../ingest'
import {
  organisationEntities,
  organisationRoleEntities,
  organisationRoleRefEntities,
  studyEntities,
  evalCategoryEntities,
} from '../mocks/entities'
import { prismaMock } from '../mocks/prisma'
import studies from '../mocks/studies.json'

interface EvalCategory {
  id: number
  studyId: number
  indicatorType: string
  indicatorValue: string
  sampleSize: number | null
  totalRecruitmentToDate: number
  plannedOpeningDate: Date | null
  plannedClosureDate: Date | null
  actualOpeningDate: Date | null
  actualClosureDate: Date | null
  expectedReopenDate: Date | null
  createdAt: Date
  updatedAt: Date
  isDeleted: boolean | null
}

jest.mock('@nihr-ui/logger')
jest.mock('shared-utilities')
const mockSetStudyAssessmentDue = setStudyAssessmentDue as jest.MockedFunction<typeof setStudyAssessmentDue>
const mockSetStudyAssessmentNotDue = setStudyAssessmentNotDue as jest.MockedFunction<typeof setStudyAssessmentNotDue>

const API_URL = 'https://dev.cpmsapi.nihr.ac.uk/api/v1/study-summaries'

const server = setupServer(
  rest.get(API_URL, async (_, res, ctx) => {
    return res(ctx.json(studies))
  })
)

beforeAll(() => {
  server.listen()
})
afterEach(() => {
  server.resetHandlers()
  jest.resetAllMocks()
})
afterAll(() => {
  server.close()
})

beforeEach(() => {
  studyEntities.forEach((entity) => prismaMock.study.upsert.mockResolvedValueOnce(entity))
  organisationEntities.forEach((entity) => prismaMock.organisation.upsert.mockResolvedValueOnce(entity))
  organisationRoleRefEntities.forEach((entity) =>
    prismaMock.sysRefOrganisationRole.upsert.mockResolvedValueOnce(entity)
  )
  evalCategoryEntities.forEach((entity: EvalCategory) =>
    prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce(entity)
  )

  prismaMock.organisationRole.createMany.mockResolvedValueOnce({ count: 1 })
  prismaMock.studyOrganisation.createMany.mockResolvedValueOnce({ count: 1 })
  prismaMock.studyFunder.createMany.mockResolvedValueOnce({ count: 1 })
  prismaMock.studyEvaluationCategory.updateMany.mockResolvedValueOnce({ count: 1 })
  mockSetStudyAssessmentDue.mockResolvedValueOnce({ count: 1 })
  mockSetStudyAssessmentNotDue.mockResolvedValueOnce({ count: 1 })

  prismaMock.study.findMany.mockResolvedValueOnce(studyEntities)
  prismaMock.organisation.findMany.mockResolvedValueOnce(organisationEntities)
  prismaMock.organisationRole.findMany.mockResolvedValueOnce(organisationRoleEntities)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- nock
  prismaMock.$transaction.mockImplementation(async (ops: any) => {
    await Promise.all(ops)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call -- mock
    return ops.map(() => ({}))
  })
})

describe('ingest', () => {
  it('should seed the initial studies data', async () => {
    await ingest()

    const mockStudy = studies.Result.Studies[0]

    const expectedStudyPayload = {
      cpmsId: mockStudy.Id,
      title: mockStudy.Title,
      shortTitle: mockStudy.ShortName,
      studyStatus: mockStudy.StudyStatus,
      recordStatus: mockStudy.StudyRecordStatus,
      route: mockStudy.StudyRoute,
      irasId: mockStudy.IrasId,
      protocolReferenceNumber: mockStudy.ProtocolReferenceNumber,
      sampleSize: mockStudy.SampleSize,
      chiefInvestigatorFirstName: mockStudy.ChiefInvestigatorFirstName,
      chiefInvestigatorLastName: mockStudy.ChiefInvestigatorLastName,
      managingSpeciality: mockStudy.ManagingSpecialty,
      totalRecruitmentToDate: mockStudy.TotalRecruitmentToDate,
      plannedOpeningDate: expect.any(Date),
      plannedClosureDate: expect.any(Date),
      actualOpeningDate: expect.any(Date),
      actualClosureDate: expect.any(Date),
      estimatedReopeningDate: expect.any(Date),
      isDeleted: false,
      leadAdministrationId: mockStudy.LeadAdministrationId,
    }

    expect(prismaMock.study.upsert).toHaveBeenCalledTimes(3)

    const studyUpsert = prismaMock.study.upsert.mock.calls[0][0]

    expect(studyUpsert).toMatchObject({
      where: { cpmsId: mockStudy.Id },
      create: expectedStudyPayload,
      update: expectedStudyPayload,
    })
  })

  it('should seed the organisations data', async () => {
    const mockOrganisation = studies.Result.Studies[0].StudySponsors[0]

    await ingest()

    const expectedOrganisationPayload = {
      name: mockOrganisation.OrganisationName,
      rtsIdentifier: mockOrganisation.OrganisationRTSIdentifier,
      isDeleted: false,
    }

    const organisationUpsert = prismaMock.organisation.upsert.mock.calls[0][0]

    expect(organisationUpsert).toMatchObject({
      where: { rtsIdentifier: mockOrganisation.OrganisationRTSIdentifier },
      create: expectedOrganisationPayload,
      update: expectedOrganisationPayload,
    })
  })

  it('should seed the organisation role refs', async () => {
    const mockOrganisation = studies.Result.Studies[0].StudySponsors[0]

    await ingest()

    const expectedOrganisationRoleRefPayload = {
      name: mockOrganisation.OrganisationRole,
      description: expect.any(String),
      rtsIdentifier: mockOrganisation.OrganisationRoleRTSIdentifier,
      isDeleted: false,
    }

    expect(prismaMock.sysRefOrganisationRole.upsert).toHaveBeenCalledTimes(2)

    const organisationRoleRefUpsert = prismaMock.sysRefOrganisationRole.upsert.mock.calls[0][0]

    expect(organisationRoleRefUpsert).toMatchObject({
      where: { rtsIdentifier: mockOrganisation.OrganisationRoleRTSIdentifier },
      create: expectedOrganisationRoleRefPayload,
      update: expectedOrganisationRoleRefPayload,
    })
  })

  it('should seed the organisation roles', async () => {
    await ingest()

    expect(prismaMock.organisationRole.createMany).toHaveBeenCalledTimes(1)

    expect(prismaMock.organisationRole.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          organisationId: organisationEntities[0].id,
          roleId: organisationRoleRefEntities[0].id,
        }),
      ]),
      skipDuplicates: true,
    })
  })

  it('should seed the study organisations', async () => {
    await ingest()

    expect(prismaMock.studyOrganisation.createMany).toHaveBeenCalledTimes(1)

    expect(prismaMock.studyOrganisation.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          studyId: studyEntities[0].id,
          organisationId: organisationEntities[0].id,
          organisationRoleId: organisationRoleRefEntities[0].id,
        }),
      ]),
      skipDuplicates: true,
    })
  })

  it('should seed the study funders', async () => {
    await ingest()

    expect(prismaMock.studyFunder.createMany).toHaveBeenCalledTimes(1)

    expect(prismaMock.studyFunder.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          studyId: studyEntities[0].id,
          organisationId: organisationEntities[0].id,
          grantCode: 'Test Grant Code',
          fundingStreamName: 'Test Funding Stream',
        }),
      ]),
      skipDuplicates: true,
    })
  })

  it('should seed the study evaluation categories', async () => {
    await ingest()

    expect(prismaMock.studyEvaluationCategory.upsert).toHaveBeenCalledTimes(6)

    const expectedData = {
      studyId: evalCategoryEntities[0].studyId,
      indicatorType: 'Recruitment concerns',
      indicatorValue: 'Recruitment target met',
      sampleSize: 444,
      totalRecruitmentToDate: 683,
      plannedOpeningDate: expect.any(Date),
      plannedClosureDate: expect.any(Date),
      actualOpeningDate: expect.any(Date),
      actualClosureDate: expect.any(Date),
      expectedReopenDate: expect.any(Date),
      isDeleted: false,
    }

    expect(prismaMock.studyEvaluationCategory.upsert).toHaveBeenCalledWith({
      where: {
        studyId_indicatorValue: {
          studyId: evalCategoryEntities[0].studyId,
          indicatorValue: evalCategoryEntities[0].indicatorValue,
        },
      },
      update: expect.objectContaining(expectedData),
      create: expect.objectContaining(expectedData),
    })
  })

  it('should make the correct requests to update the study `dueAssessmentAt` field', async () => {
    await ingest()

    expect(mockSetStudyAssessmentDue).toHaveBeenCalledTimes(1)
    expect(mockSetStudyAssessmentDue).toHaveBeenCalledWith(studyEntities.map(({ id }) => id))

    expect(mockSetStudyAssessmentNotDue).toHaveBeenCalledTimes(1)
    expect(mockSetStudyAssessmentNotDue).toHaveBeenCalledWith(studyEntities.map(({ id }) => id))
  })

  it('should handle errors when fetching studies', async () => {
    const errorResponse = {
      StatusCode: 500,
      ErrorMessage: 'Internal API exception',
    }

    server.use(
      rest.get(API_URL, async (_, res, ctx) => {
        return res(ctx.status(500), ctx.json(errorResponse))
      })
    )

    await ingest()

    expect(prismaMock.study.updateMany).not.toHaveBeenCalled()

    expect(logger.error).toHaveBeenCalledWith('Error occurred while fetching study data')
    expect(logger.error).toHaveBeenCalledWith('Error response data: %s', JSON.stringify(errorResponse))
    expect(logger.error).toHaveBeenCalledWith(expect.any(Error))
  })

  it('should set studies no longer returned by the API as deleted', async () => {
    server.use(
      rest.get(API_URL, async (_, res, ctx) => {
        return res(ctx.json({ ...studies, Result: { Studies: studies.Result.Studies.slice(0, -1) } }))
      })
    )

    await ingest()

    expect(prismaMock.study.updateMany).toHaveBeenCalledWith({
      where: { id: { in: [studyEntities[studyEntities.length - 1].id] } },
      data: { isDeleted: true },
    })
  })

  it('should set organisation roles no longer returned by the API as deleted', async () => {
    server.use(
      rest.get(API_URL, async (_, res, ctx) => {
        return res(ctx.json({ ...studies, Result: { Studies: studies.Result.Studies.slice(0, -1) } }))
      })
    )

    await ingest()

    const expectedDeletedEntityIds = organisationRoleEntities.slice(-2).map(({ id }: { id: number }) => id)

    // Sets all existing organisation roles to be isDeleted = false
    expect(prismaMock.organisationRole.updateMany).toHaveBeenCalledWith({
      where: { NOT: { id: { in: expectedDeletedEntityIds } } },
      data: { isDeleted: false },
    })

    // Sets organisation roles not seen during ingest as isDeleted = true
    expect(prismaMock.organisationRole.updateMany).toHaveBeenCalledWith({
      where: { id: { in: expectedDeletedEntityIds }, isDeleted: false },
      data: { isDeleted: true },
    })
  })

  it('should set study organisations no longer returned by the API as deleted', async () => {
    server.use(
      rest.get(API_URL, async (_, res, ctx) => {
        const studyResults = studies.Result.Studies
        const lastStudy = studyResults[studyResults.length - 1]
        return res(
          ctx.json({
            ...studies,
            Result: {
              Studies: [...studyResults.slice(0, -1), { ...lastStudy, StudySponsors: [] }],
            },
          })
        )
      })
    )

    await ingest()

    const expectedDeletedStudyOrgIds = studyEntities[studyEntities.length - 1].organisations.map(({ id }) => id)

    // Sets all existing study organisations to be isDeleted = false
    expect(prismaMock.studyOrganisation.updateMany).toHaveBeenCalledWith({
      where: { studyId: { in: studyEntities.map(({ id }) => id) }, NOT: { id: { in: expectedDeletedStudyOrgIds } } },
      data: { isDeleted: false },
    })

    // Sets study organisations not seen during ingest as isDeleted = true
    expect(prismaMock.studyOrganisation.updateMany).toHaveBeenCalledWith({
      where: { id: { in: expectedDeletedStudyOrgIds }, isDeleted: false },
      data: { isDeleted: true },
    })
  })

  it('should set study evaluation categories no longer returned by the API as deleted', async () => {
    server.use(
      rest.get(API_URL, async (_, res, ctx) => {
        const studyResults = studies.Result.Studies
        const lastStudy = studyResults[studyResults.length - 1]
        return res(
          ctx.json({
            ...studies,
            Result: {
              Studies: [...studyResults.slice(0, -1), { ...lastStudy, StudyEvaluationCategories: [] }],
            },
          })
        )
      })
    )

    await ingest()

    const expectedDeletedEvalCategoryIds = studyEntities[studyEntities.length - 1].evaluationCategories.map(
      ({ id }) => id
    )

    // Sets evaluation categories not seen during ingest as isDeleted = true
    expect(prismaMock.studyEvaluationCategory.updateMany).toHaveBeenCalledWith({
      where: { id: { in: expectedDeletedEvalCategoryIds }, isDeleted: false },
      data: { isDeleted: true },
    })
  })
})
