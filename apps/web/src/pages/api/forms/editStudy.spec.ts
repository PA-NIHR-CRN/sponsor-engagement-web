import { logger } from '@nihr-ui/logger'
import axios from 'axios'
import type { NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import type { RequestOptions } from 'node-mocks-http'
import { createRequest, createResponse } from 'node-mocks-http'

import { prismaMock } from '@/__mocks__/prisma'
import { userWithSponsorContactRole } from '@/__mocks__/session'
import { StudyUpdateRoute } from '@/@types/studies'
import { StudyUpdateState, StudyUpdateType } from '@/constants'

import { mockCPMSStudy, mockCPMSUpdateInput as mockCPMSUpdate } from '../../../mocks/studies'
import type { ExtendedNextApiRequest } from './editStudy'
import api from './editStudy'

const mockTransactionId = '12121'
const mockBeforeLSN = 'before-lsn'
const mockAfterLSN = 'after-lsn'

jest.mock('axios')
jest.mock('next-auth/next')
jest.mock('@nihr-ui/logger')
jest.mock('uuid', () => ({
  v4: () => mockTransactionId,
}))

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

const mockStudyId = '1211'

const nextYearValue = new Date().getFullYear() + 1
const mockEstimatedReopeningDateInFuture = `${nextYearValue}-02-28T00:00:00.000`

const mockCPMSUpdateInput = {
  ...mockCPMSUpdate,
  EstimatedReopeningDate: mockEstimatedReopeningDateInFuture,
}

const mockUpdateCPMSResponse = {
  StatusCode: 200,
  Result: { ...mockCPMSStudy, UpdateLsn: mockAfterLSN },
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

const body: ExtendedNextApiRequest['body'] = {
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
    year: '2004',
  },
  estimatedReopeningDate: {
    day: '28',
    month: '02',
    year: nextYearValue.toString(),
  },
  recruitmentTarget: '121',
  furtherInformation: '',
  originalValues: {
    status: 'Open to Recruitment',
    plannedOpeningDate: {
      day: '27',
      month: '02',
      year: '2003',
    },
    actualClosureDate: {
      day: '28',
      month: '02',
      year: '2003',
    },
    actualOpeningDate: {
      day: '02',
      month: '09',
      year: '1991',
    },
    plannedClosureDate: {
      day: '27',
      month: '02',
      year: '2004',
    },
    estimatedReopeningDate: {
      day: '27',
      month: '02',
      year: '2021',
    },
    recruitmentTarget: '122',
    furtherInformation: '',
  },
  LSN: mockBeforeLSN,
}

const getMockStudyUpdateInput = (isDirect: boolean, isAfterState: boolean) => {
  const studyStatusOnUpdateType = isDirect ? body.status : null
  const LSN = isAfterState ? mockAfterLSN : mockBeforeLSN

  return {
    studyStatus: isAfterState ? studyStatusOnUpdateType : body.originalValues?.status,
    studyStatusGroup: isAfterState ? 'Suspended' : 'Open to recruitment',
    plannedOpeningDate: isAfterState
      ? new Date(mockCPMSUpdateInput.PlannedOpeningDate as string).toISOString()
      : new Date('2003-02-27T00:00:00.000').toISOString(),
    actualOpeningDate: isAfterState
      ? new Date(mockCPMSUpdateInput.ActualOpeningDate as string).toISOString()
      : new Date('1991-09-02T00:00:00.000').toISOString(),
    plannedClosureToRecruitmentDate: isAfterState
      ? new Date(mockCPMSUpdateInput.PlannedClosureToRecruitmentDate as string).toISOString()
      : new Date('2004-02-27T00:00:00.000').toISOString(),
    actualClosureToRecruitmentDate: isAfterState
      ? new Date(mockCPMSUpdateInput.ActualClosureToRecruitmentDate as string).toISOString()
      : new Date('2003-02-28T00:00:00.000').toISOString(),
    estimatedReopeningDate: isAfterState
      ? new Date(mockCPMSUpdateInput.EstimatedReopeningDate).toISOString()
      : new Date('2021-02-27T00:00:00.000').toISOString(),
    ukRecruitmentTarget: isAfterState ? 121 : 122,
    comment: '',
    studyId: Number(body.studyId),
    studyUpdateTypeId: isDirect ? StudyUpdateType.Direct : StudyUpdateType.Proposed,
    createdById: userWithSponsorContactRole.user?.id as number,
    modifiedById: userWithSponsorContactRole.user?.id as number,
    transactionId: mockTransactionId,
    LSN: isAfterState && !isDirect ? null : Buffer.from(LSN, 'hex'),
    studyUpdateStateId: isAfterState ? StudyUpdateState.After : StudyUpdateState.Before,
  }
}

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
      prismaMock.studyUpdates.createMany.mockResolvedValueOnce({ count: 2 })
      mockedPostAxios.mockResolvedValueOnce({ data: getMockValidateStudyResponse(StudyUpdateRoute.Proposed) })

      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(
        `/studies/${body.studyId}?success=2&latestProposedUpdate=${mockTransactionId}`
      )

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

      expect(prismaMock.studyUpdates.createMany).toHaveBeenCalledTimes(1)
      expect(prismaMock.studyUpdates.createMany).toHaveBeenCalledWith({
        data: [getMockStudyUpdateInput(false, false), getMockStudyUpdateInput(false, true)],
      })

      expect(mockedPutAxios).not.toHaveBeenCalled()
    })

    test('when the update type is direct, creates an entry in the studyUpdates table, with a proposed update type, does not call CPMS and redirects back to study details page with the correct params', async () => {
      prismaMock.studyUpdates.createMany.mockResolvedValueOnce({ count: 2 })
      mockedPostAxios.mockResolvedValueOnce({ data: getMockValidateStudyResponse(StudyUpdateRoute.Direct) })

      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(
        `/studies/${body.studyId}?success=2&latestProposedUpdate=${mockTransactionId}`
      )

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

      expect(prismaMock.studyUpdates.createMany).toHaveBeenCalledTimes(1)
      expect(prismaMock.studyUpdates.createMany).toHaveBeenCalledWith({
        data: [getMockStudyUpdateInput(false, false), getMockStudyUpdateInput(false, true)],
      })

      expect(mockedPutAxios).not.toHaveBeenCalled()
    })

    test('should redirect correctly when the request to create an entry in the studyUpdates table fails', async () => {
      mockedPostAxios.mockResolvedValueOnce({ data: getMockValidateStudyResponse(StudyUpdateRoute.Direct) })
      prismaMock.studyUpdates.createMany.mockRejectedValueOnce(new Error(''))

      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(`/studies/${body.studyId}/edit?fatal=1`)

      expect(prismaMock.studyUpdates.createMany).toHaveBeenCalledTimes(1)
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
      prismaMock.studyUpdates.createMany.mockResolvedValueOnce({ count: 2 })
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

      expect(prismaMock.studyUpdates.createMany).toHaveBeenCalledTimes(1)
      expect(prismaMock.studyUpdates.createMany).toHaveBeenCalledWith({
        data: [getMockStudyUpdateInput(true, false), getMockStudyUpdateInput(true, true)],
      })

      expect(mockedPutAxios).toHaveBeenCalledTimes(1)
      expect(mockedPutAxios).toHaveBeenCalledWith(
        `${mockedEnvVars.apiUrl}/studies/${body.cpmsId}/engagement-info`,
        JSON.stringify({
          ...mockCPMSUpdateInput,
          CurrentLsn: mockBeforeLSN,
          notes: 'Update from Sponsor Engagement Tool',
        }),
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
      prismaMock.studyUpdates.createMany.mockResolvedValueOnce({ count: 2 })
      mockedPutAxios.mockRejectedValueOnce(new Error())
      mockedPostAxios.mockResolvedValueOnce({ data: getMockValidateStudyResponse(StudyUpdateRoute.Direct) })
      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(`/studies/${body.studyId}/edit?fatal=1`)

      expect(mockedPutAxios).toHaveBeenCalledTimes(1)
    })

    test('should redirect correctly when CPMS returns a non-200 status code', async () => {
      prismaMock.studyUpdates.createMany.mockResolvedValueOnce({ count: 2 })
      mockedPutAxios.mockResolvedValueOnce({ data: { ...mockUpdateCPMSResponse, StatusCode: 500 } })
      mockedPostAxios.mockResolvedValueOnce({ data: getMockValidateStudyResponse(StudyUpdateRoute.Direct) })

      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(`/studies/${body.studyId}/edit?fatal=1`)

      expect(mockedPutAxios).toHaveBeenCalledTimes(1)
    })
  })
})
