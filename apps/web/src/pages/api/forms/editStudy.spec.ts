import { logger } from '@nihr-ui/logger'
import type { Prisma } from '@prisma/client'
import axios from 'axios'
import type { NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import type { RequestOptions } from 'node-mocks-http'
import { createRequest, createResponse } from 'node-mocks-http'

import { prismaMock } from '@/__mocks__/prisma'
import { userWithSponsorContactRole } from '@/__mocks__/session'
import { StudyUpdateType } from '@/constants'
import type { EditStudyInputs } from '@/utils/schemas'

import { mockCPMSStudy, mockCPMSUpdateInput } from '../../../mocks/studies'
import type { ExtendedNextApiRequest } from './editStudy'
import api from './editStudy'

jest.mock('axios')
jest.mock('next-auth/next')
jest.mock('@nihr-ui/logger')
const mockedPutAxios = jest.mocked(axios.put)

type ApiRequest = ExtendedNextApiRequest
type ApiResponse = NextApiResponse
const testHandler = async (handler: typeof api, options: RequestOptions) => {
  const req = createRequest<ApiRequest>(options)
  const res = createResponse<ApiResponse>()
  await handler(req, res)
  return res
}

const mockStudyId = 1211

const mockCPMSResponse = {
  StatusCode: 200,
  Result: mockCPMSStudy,
}

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
  ukRecruitmentTarget: mockCPMSStudy.SampleSize,
  comment: '',
  plannedOpeningDate: new Date(mockCPMSStudy.PlannedOpeningDate as string),
  actualClosureToRecruitmentDate: new Date(mockCPMSStudy.ActualClosureToRecruitmentDate as string),
  actualOpeningDate: new Date(mockCPMSStudy.ActualOpeningDate as string),
  plannedClosureToRecruitmentDate: new Date(mockCPMSStudy.PlannedClosureToRecruitmentDate as string),
  estimatedReopeningDate: new Date(mockCPMSStudy.EstimatedReopeningDate as string),
}

const mockStudyUpdateInput = {
  studyStatus: body.status,
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
    connect: { id: StudyUpdateType.Proposed },
  },
  createdBy: {
    connect: { id: userWithSponsorContactRole.user?.id as number },
  },
  modifiedBy: {
    connect: { id: userWithSponsorContactRole.user?.id as number },
  },
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

  test.each(['CPMS_API_URL', 'CPMS_API_USERNAME', 'CPMS_API_PASSWORD'])(
    'should redirect correctly when there are no environemnt variables',
    async (environmentVariable: string) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- listed values are safe to delete
      delete process.env[environmentVariable]

      mockedPutAxios.mockRejectedValueOnce(new Error())
      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(`/editStudy/${body.studyId}?fatal=1`)

      expect(mockedPutAxios).not.toHaveBeenCalled()
    }
  )

  describe('Feature flag, ENABLE_DIRECT_STUDY_UPDATES, disabled', () => {
    test('creates an entry in the studyUpdates table, does not call CPMS and redirects back to study details page with the correct params', async () => {
      prismaMock.studyUpdates.create.mockResolvedValueOnce(
        mockStudyUpdateResponse as Prisma.StudyUpdatesGetPayload<undefined>
      )

      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(`/studies/${body.studyId}?success=2`)

      expect(prismaMock.studyUpdates.create).toHaveBeenCalledTimes(1)
      expect(prismaMock.studyUpdates.create).toHaveBeenCalledWith({
        data: mockStudyUpdateInput,
      })

      expect(mockedPutAxios).not.toHaveBeenCalled()
    })

    test('should redirect correctly when fails to update studyUpdates table', async () => {
      prismaMock.studyUpdates.create.mockRejectedValueOnce(new Error(''))

      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(`/editStudy/${body.studyId}?fatal=1`)

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

    test('creates an entry in the studyUpdates table, calls CPMS and redirects back to study details page with the correct params', async () => {
      prismaMock.studyUpdates.create.mockResolvedValueOnce(
        mockStudyUpdateResponse as Prisma.StudyUpdatesGetPayload<undefined>
      )
      mockedPutAxios.mockResolvedValueOnce({ data: mockCPMSResponse })

      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(`/studies/${body.studyId}?success=2`)

      expect(prismaMock.studyUpdates.create).toHaveBeenCalledTimes(1)
      expect(prismaMock.studyUpdates.create).toHaveBeenCalledWith({
        data: mockStudyUpdateInput,
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
      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(`/editStudy/${body.studyId}?fatal=1`)

      expect(mockedPutAxios).toHaveBeenCalledTimes(1)
    })

    test('should redirect correctly when CPMS returns a non-200 status code', async () => {
      prismaMock.studyUpdates.create.mockResolvedValueOnce(
        mockStudyUpdateResponse as Prisma.StudyUpdatesGetPayload<undefined>
      )
      mockedPutAxios.mockResolvedValueOnce({ data: { ...mockCPMSResponse, StatusCode: 500 } })
      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(`/editStudy/${body.studyId}?fatal=1`)

      expect(mockedPutAxios).toHaveBeenCalledTimes(1)
    })
  })
})
