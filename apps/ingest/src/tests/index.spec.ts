import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { logger } from 'logger'
import { ingest } from '../ingest'
import { organisationEntities, organisationRoleEntities, studyEntities } from '../mocks/entities'
import { prismaMock } from '../mocks/prisma'
import studies from '../mocks/studies.json'

jest.mock('logger')

const API_URL = 'https://dev.cpmsapi.nihr.ac.uk/api/v1/study-summaries'

const server = setupServer(
  rest.get(API_URL, async (_, res, ctx) => {
    return res(
      ctx.json({
        Result: {
          ...studies.Result,
          Studies: studies.Result.Studies.slice(0, 3),
        },
      })
    )
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

beforeEach(() => {
  studyEntities.forEach((entity) => prismaMock.study.upsert.mockResolvedValueOnce(entity))
  organisationEntities.forEach((entity) => prismaMock.organisation.upsert.mockResolvedValueOnce(entity))
  organisationRoleEntities.forEach((entity) => prismaMock.sysRefOrganisationRole.upsert.mockResolvedValueOnce(entity))

  prismaMock.organisationRole.createMany.mockResolvedValueOnce({ count: 1 })
  prismaMock.studyOrganisation.createMany.mockResolvedValueOnce({ count: 1 })
  prismaMock.studyFunder.createMany.mockResolvedValueOnce({ count: 1 })
  prismaMock.studyEvaluationCategory.createMany.mockResolvedValueOnce({ count: 1 })
  prismaMock.study.updateMany.mockResolvedValueOnce({ count: 1 })
})

describe('ingest', () => {
  it('should seed the initial studies data', async () => {
    await ingest()

    const mockStudy = studies.Result.Studies[0]

    const expectedStudyPayload = {
      cpmsId: mockStudy.Id,
      name: mockStudy.Name,
      status: mockStudy.Status,
      recordStatus: mockStudy.StudyRecordStatus,
      route: mockStudy.StudyRoute,
      irasId: mockStudy.IrasId,
      protocolReferenceNumber: mockStudy.ProtocolReferenceNumber,
      sampleSize: mockStudy.SampleSize,
      chiefInvestigatorFirstName: mockStudy.ChiefInvestigatorFirstName,
      chiefInvestigatorLastName: mockStudy.ChiefInvestigatorLastName,
      managingSpeciality: mockStudy.ManagingSpecialty,
      plannedOpeningDate: expect.any(Date),
      plannedClosureDate: expect.any(Date),
      actualOpeningDate: expect.any(Date),
      actualClosureDate: expect.any(Date),
      isDeleted: false,
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
          organisationId: 12345,
          roleId: 12345,
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
          studyId: 123,
          organisationId: 12345,
          organisationRoleId: 12345,
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
          studyId: 123,
          organisationId: 12345,
          grantCode: 'Test Grant Code',
          fundingStreamName: 'Test Funding Stream',
        }),
      ]),
      skipDuplicates: true,
    })
  })

  it('should seed the study evaluation categories', async () => {
    await ingest()

    expect(prismaMock.studyEvaluationCategory.createMany).toHaveBeenCalledTimes(1)

    expect(prismaMock.studyEvaluationCategory.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          studyId: 123,
          indicatorType: 'Recruitment concerns',
          indicatorValue: 'Recruitment target met',
          sampleSize: 444,
          totalRecruitmentToDate: 683,
          plannedOpeningDate: expect.any(Date),
          plannedClosureDate: expect.any(Date),
          actualOpeningDate: expect.any(Date),
          actualClosureDate: expect.any(Date),
          expectedReopenDate: expect.any(Date),
        }),
      ]),
      skipDuplicates: true,
    })
  })

  it('should update the study `isDueAssessment` flag', async () => {
    await ingest()

    expect(prismaMock.study.updateMany).toHaveBeenCalledTimes(1)

    expect(prismaMock.study.updateMany).toHaveBeenCalledWith({
      data: {
        isDueAssessment: true,
      },
      where: {
        id: { in: [123, 123, 123] },
        evaluationCategories: {
          some: {},
        },
        assessments: {
          every: {
            updatedAt: {
              lte: expect.any(Date),
            },
          },
        },
      },
    })
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

    expect(logger.error).toHaveBeenCalledWith(expect.any(Object), 'Error fetching studies data')
    expect(logger.error).toHaveBeenCalledWith(errorResponse, 'Error response')
  })
})
