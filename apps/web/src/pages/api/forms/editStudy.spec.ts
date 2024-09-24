import { logger } from '@nihr-ui/logger'
import type { Prisma } from '@prisma/client'
import axios from 'axios'
import type { NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import type { RequestOptions } from 'node-mocks-http'
import { createRequest, createResponse } from 'node-mocks-http'

import { prismaMock } from '@/__mocks__/prisma'
import { userWithSponsorContactRole } from '@/__mocks__/session'
import { StudyUpdateRoute } from '@/@types/studies'
import { StudyUpdateType } from '@/constants'
import type { EditStudyInputs } from '@/utils/schemas'

import { mockCPMSStudy, mockCPMSUpdateInput } from '../../../mocks/studies'
import type { ExtendedNextApiRequest } from './editStudy'
import api from './editStudy'

jest.mock('axios')
jest.mock('next-auth/next')
jest.mock('@nihr-ui/logger')
const mockedPutAxios = jest.mocked(axios.put)
const mockedPostAxios = jest.mocked(axios.post)

type ApiRequest = ExtendedNextApiRequest
type ApiResponse = NextApiResponse
const testHandler = async (handler: typeof api, options: RequestOptions) => {
  const req = createRequest<ApiRequest>(options)
  const res = createResponse<ApiResponse>()
  await handler(req, res)
  return res
}

const mockStudyId = 1211

const mockUpdateCPMSResponse = {
  StatusCode: 200,
  Result: mockCPMSStudy,
}

const getMockValidateStudyResponse = (studyUpdateRoute: StudyUpdateRoute) => ({
  StatusCode: 200,
  Result: {
    StudyUpdateRoute: studyUpdateRoute,
  },
})

const env = { ...process.env }
const mockedEnvVars = {
  apiUrl: 'cpms-api',
  apiUsername: 'testuser',
  apiPassword: 'testpwd',
}

const body: EditStudyInputs = {
  studyId: mockStudyId,
  cpmsId: mockCPMSStudy.StudyId.toString(),
  status: mockCPMSStudy.StudyStatus,
  plannedOpeningDate: {
    day: '28',
    month: '02',
    year: '2003',
  },
  actualClosureDate: {
    day: '28',
    month: '02',
    year: '2003',
  },
  actualOpeningDate: {
    day: '01',
    month: '09',
    year: '1991',
  },
  plannedClosureDate: {
    day: '28',
    month: '02',
    year: '2003',
  },
  estimatedReopeningDate: {
    day: '28',
    month: '02',
    year: '2003',
  },
  recruitmentTarget: mockCPMSStudy.SampleSize?.toString(),
  furtherInformation: '',
}

const mockStudyUpdateResponse = {
  id: 3232,
  studyId: mockStudyId,
  studyStatus: mockCPMSStudy.StudyStatus,
  studyStatusGroup: 'Suspended',
  ukRecruitmentTarget: mockCPMSStudy.SampleSize,
  comment: '',
  plannedOpeningDate: new Date(mockCPMSStudy.PlannedOpeningDate as string),
  actualClosureToRecruitmentDate: new Date(mockCPMSStudy.ActualClosureToRecruitmentDate as string),
  actualOpeningDate: new Date(mockCPMSStudy.ActualOpeningDate as string),
  plannedClosureToRecruitmentDate: new Date(mockCPMSStudy.PlannedClosureToRecruitmentDate as string),
  estimatedReopeningDate: new Date(mockCPMSStudy.EstimatedReopeningDate as string),
}

const getMockStudyUpdateInput = (isDirect: boolean) => ({
  ...(isDirect && { studyStatus: body.status }),
  studyStatusGroup: mockStudyUpdateResponse.studyStatusGroup,
  plannedOpeningDate: mockStudyUpdateResponse.plannedOpeningDate,
  actualOpeningDate: mockStudyUpdateResponse.actualOpeningDate,
  plannedClosureToRecruitmentDate: mockStudyUpdateResponse.plannedClosureToRecruitmentDate,
  actualClosureToRecruitmentDate: mockStudyUpdateResponse.actualClosureToRecruitmentDate,
  estimatedReopeningDate: mockStudyUpdateResponse.estimatedReopeningDate,
  ukRecruitmentTarget: Number(mockStudyUpdateResponse.ukRecruitmentTarget),
  comment: mockStudyUpdateResponse.comment,
  study: {
    connect: {
      id: body.studyId,
    },
  },
  studyUpdateType: {
    connect: { id: isDirect ? StudyUpdateType.Direct : StudyUpdateType.Proposed },
  },
  createdBy: {
    connect: { id: userWithSponsorContactRole.user?.id as number },
  },
  modifiedBy: {
    connect: { id: userWithSponsorContactRole.user?.id as number },
  },
})

describe('/api/forms/editStudy', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithSponsorContactRole)
    logger.info = jest.fn()
  })

  beforeEach(() => {
    process.env.CPMS_API_URL = mockedEnvVars.apiUrl
    process.env.CPMS_API_USERNAME = mockedEnvVars.apiUsername
    process.env.CPMS_API_PASSWORD = mockedEnvVars.apiPassword
  })

  afterAll(() => {
    process.env = env
  })

  test('should redirect correctly when request to validate study fails', async () => {
    mockedPostAxios.mockRejectedValueOnce(new Error('Oh no, an error'))

    const response = await testHandler(api, { method: 'POST', body })

    expect(response.statusCode).toBe(302)
    expect(response._getRedirectUrl()).toBe(`/studies/${body.studyId}/edit?fatal=1`)

    expect(mockedPostAxios).toHaveBeenCalledTimes(1)
  })

  test('should redirect correctly when request to validate study returns a non-200 status code', async () => {
    mockedPostAxios.mockResolvedValueOnce({ data: { StatusCode: 500 } })

    const response = await testHandler(api, { method: 'POST', body })

    expect(response.statusCode).toBe(302)
    expect(response._getRedirectUrl()).toBe(`/studies/${body.studyId}/edit?fatal=1`)

    expect(mockedPostAxios).toHaveBeenCalledTimes(1)
  })

  describe('Feature flag, ENABLE_DIRECT_STUDY_UPDATES, disabled', () => {
    test('when the update type is proposed, creates an entry in the studyUpdates table, with a proposed update type, does not call CPMS and redirects back to study details page with the correct params', async () => {
      prismaMock.studyUpdates.create.mockResolvedValueOnce(
        mockStudyUpdateResponse as Prisma.StudyUpdatesGetPayload<undefined>
      )
      mockedPostAxios.mockResolvedValueOnce({ data: getMockValidateStudyResponse(StudyUpdateRoute.Proposed) })

      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(`/studies/${body.studyId}?success=2`)

      expect(mockedPostAxios).toHaveBeenCalledTimes(1)
      expect(mockedPostAxios).toHaveBeenCalledWith(
        `${mockedEnvVars.apiUrl}/studies/${body.cpmsId}/engagement-info/validate`,
        JSON.stringify(mockCPMSUpdateInput),
        {
          headers: {
            'Content-Type': 'application/json',
            username: mockedEnvVars.apiUsername,
            password: mockedEnvVars.apiPassword,
          },
        }
      )

      expect(prismaMock.studyUpdates.create).toHaveBeenCalledTimes(1)
      expect(prismaMock.studyUpdates.create).toHaveBeenCalledWith({
        data: getMockStudyUpdateInput(false),
      })

      expect(mockedPutAxios).not.toHaveBeenCalled()
    })

    test('when the update type is direct, creates an entry in the studyUpdates table, with a proposed update type, does not call CPMS and redirects back to study details page with the correct params', async () => {
      prismaMock.studyUpdates.create.mockResolvedValueOnce(
        mockStudyUpdateResponse as Prisma.StudyUpdatesGetPayload<undefined>
      )
      mockedPostAxios.mockResolvedValueOnce({ data: getMockValidateStudyResponse(StudyUpdateRoute.Direct) })

      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(`/studies/${body.studyId}?success=2`)

      expect(mockedPostAxios).toHaveBeenCalledTimes(1)
      expect(mockedPostAxios).toHaveBeenCalledWith(
        `${mockedEnvVars.apiUrl}/studies/${body.cpmsId}/engagement-info/validate`,
        JSON.stringify(mockCPMSUpdateInput),
        {
          headers: {
            'Content-Type': 'application/json',
            username: mockedEnvVars.apiUsername,
            password: mockedEnvVars.apiPassword,
          },
        }
      )

      expect(prismaMock.studyUpdates.create).toHaveBeenCalledTimes(1)
      expect(prismaMock.studyUpdates.create).toHaveBeenCalledWith({
        data: getMockStudyUpdateInput(false),
      })

      expect(mockedPutAxios).not.toHaveBeenCalled()
    })

    test('should redirect correctly when the request to create an entry in the studyUpdates table fails', async () => {
      mockedPostAxios.mockResolvedValueOnce({ data: getMockValidateStudyResponse(StudyUpdateRoute.Direct) })
      prismaMock.studyUpdates.create.mockRejectedValueOnce(new Error(''))

      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(`/studies/${body.studyId}/edit?fatal=1`)

      expect(prismaMock.studyUpdates.create).toHaveBeenCalledTimes(1)
    })
  })

  describe('Feature flag, ENABLE_DIRECT_STUDY_UPDATES, enabled', () => {
    beforeAll(() => {
      process.env.ENABLE_DIRECT_STUDY_UPDATES = 'true'
    })

    afterAll(() => {
      process.env.ENABLE_DIRECT_STUDY_UPDATES = env.ENABLE_DIRECT_STUDY_UPDATES
    })

    test('when the update is direct, creates an entry in the studyUpdates table, calls CPMS and redirects back to study details page with the correct params', async () => {
      prismaMock.studyUpdates.create.mockResolvedValueOnce(
        mockStudyUpdateResponse as Prisma.StudyUpdatesGetPayload<undefined>
      )
      mockedPutAxios.mockResolvedValueOnce({ data: mockUpdateCPMSResponse })
      mockedPostAxios.mockResolvedValueOnce({ data: getMockValidateStudyResponse(StudyUpdateRoute.Direct) })

      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(`/studies/${body.studyId}?success=3`)

      expect(mockedPostAxios).toHaveBeenCalledTimes(1)
      expect(mockedPostAxios).toHaveBeenCalledWith(
        `${mockedEnvVars.apiUrl}/studies/${body.cpmsId}/engagement-info/validate`,
        JSON.stringify(mockCPMSUpdateInput),
        {
          headers: {
            'Content-Type': 'application/json',
            username: mockedEnvVars.apiUsername,
            password: mockedEnvVars.apiPassword,
          },
        }
      )

      expect(prismaMock.studyUpdates.create).toHaveBeenCalledTimes(1)
      expect(prismaMock.studyUpdates.create).toHaveBeenCalledWith({
        data: getMockStudyUpdateInput(true),
      })

      expect(mockedPutAxios).toHaveBeenCalledTimes(1)
      expect(mockedPutAxios).toHaveBeenCalledWith(
        `${mockedEnvVars.apiUrl}/studies/${body.cpmsId}/engagement-info`,
        JSON.stringify(mockCPMSUpdateInput),
        {
          headers: {
            'Content-Type': 'application/json',
            username: mockedEnvVars.apiUsername,
            password: mockedEnvVars.apiPassword,
          },
        }
      )
    })

    test('should redirect correctly when the network request to CPMS fails', async () => {
      prismaMock.studyUpdates.create.mockResolvedValueOnce(
        mockStudyUpdateResponse as Prisma.StudyUpdatesGetPayload<undefined>
      )
      mockedPutAxios.mockRejectedValueOnce(new Error())
      mockedPostAxios.mockResolvedValueOnce({ data: getMockValidateStudyResponse(StudyUpdateRoute.Direct) })
      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(`/studies/${body.studyId}/edit?fatal=1`)

      expect(mockedPutAxios).toHaveBeenCalledTimes(1)
    })

    test('should redirect correctly when CPMS returns a non-200 status code', async () => {
      prismaMock.studyUpdates.create.mockResolvedValueOnce(
        mockStudyUpdateResponse as Prisma.StudyUpdatesGetPayload<undefined>
      )
      mockedPutAxios.mockResolvedValueOnce({ data: { ...mockUpdateCPMSResponse, StatusCode: 500 } })
      mockedPostAxios.mockResolvedValueOnce({ data: getMockValidateStudyResponse(StudyUpdateRoute.Direct) })

      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(`/studies/${body.studyId}/edit?fatal=1`)

      expect(mockedPutAxios).toHaveBeenCalledTimes(1)
    })
  })
})
