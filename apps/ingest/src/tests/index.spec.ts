import { rest } from 'msw'
import { setupServer } from 'msw/node'

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

describe('ingest', () => {
  it('should seed the initial studies data', async () => {
    studyEntities.forEach((entity) => prismaMock.study.upsert.mockResolvedValueOnce(entity))
    organisationEntities.forEach((entity) => prismaMock.organisation.upsert.mockResolvedValueOnce(entity))
    organisationRoleEntities.forEach((entity) => prismaMock.sysRefOrganisationRole.upsert.mockResolvedValueOnce(entity))

    prismaMock.organisationRole.createMany.mockResolvedValueOnce({ count: 1 })
    prismaMock.studyOrganisation.createMany.mockResolvedValueOnce({ count: 1 })
    prismaMock.studyFunder.createMany.mockResolvedValueOnce({ count: 1 })
    prismaMock.studyEvaluationCategory.createMany.mockResolvedValueOnce({ count: 1 })

    await ingest()

    // Adds studies
    const mockStudy = studies.Result.Studies[0]
    const expectedStudyPayload = {
      id: mockStudy.Id,
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
    expect(prismaMock.study.upsert).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: { id: mockStudy.Id },
        create: expectedStudyPayload,
        update: expectedStudyPayload,
      })
    )

    // Adds organisations
    const mockOrganisation = studies.Result.Studies[0].StudySponsors[0]
    const expectedOrganisationPayload = {
      name: mockOrganisation.OrganisationName,
      rtsIdentifier: mockOrganisation.OrganisationRTSIdentifier,
    }
    expect(prismaMock.organisation.upsert).toHaveBeenCalledTimes(4)
    expect(prismaMock.organisation.upsert).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: { name: mockOrganisation.OrganisationName },
        create: expectedOrganisationPayload,
        update: expectedOrganisationPayload,
      })
    )

    // Adds organisation role refs
    const expectedOrganisationRoleRefPayload = {
      name: mockOrganisation.OrganisationRole,
      description: expect.any(String),
      rtsIdentifier: mockOrganisation.OrganisationRoleRTSIdentifier,
    }
    expect(prismaMock.sysRefOrganisationRole.upsert).toHaveBeenCalledTimes(2)
    expect(prismaMock.sysRefOrganisationRole.upsert).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: { name: mockOrganisation.OrganisationRole },
        create: expectedOrganisationRoleRefPayload,
        update: expectedOrganisationRoleRefPayload,
      })
    )

    // Adds organisation roles
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

    // Adds study organisations
    expect(prismaMock.studyOrganisation.createMany).toHaveBeenCalledTimes(1)
    expect(prismaMock.studyOrganisation.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          studyId: 622,
          organisationId: 12345,
          organisationRoleId: 12345,
        }),
      ]),
      skipDuplicates: true,
    })

    // Adds study funders
    expect(prismaMock.studyFunder.createMany).toHaveBeenCalledTimes(1)
    expect(prismaMock.studyFunder.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          studyId: 622,
          organisationId: 12345,
          grantCode: 'Test Grant Code',
          fundingStreamName: 'Test Funding Stream',
        }),
      ]),
      skipDuplicates: true,
    })

    // Adds study evaluation categories
    expect(prismaMock.studyEvaluationCategory.createMany).toHaveBeenCalledTimes(1)
    expect(prismaMock.studyEvaluationCategory.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          studyId: 622,
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
})
