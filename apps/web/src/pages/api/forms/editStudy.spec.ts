import { logger } from '@nihr-ui/logger'
import axios from 'axios'
import type { NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import type { RequestOptions } from 'node-mocks-http'
import { createRequest, createResponse } from 'node-mocks-http'

import { userWithSponsorContactRole } from '@/__mocks__/session'

import { mockCPMSStudy } from '../../../mocks/studies'
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

const mockCPMSId = '1211'

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

describe('Succesfully edit study', () => {
  const body = {
    studyId: mockCPMSStudy.StudyId,
    cpmsId: '1211',
    plannedOpeningDate: {
      day: '11',
      month: '1',
      year: '2019',
    },
  }

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

  test('calls the correct endpoint when editing study and redirects back to study details page with the correct params', async () => {
    const expectedBody = JSON.stringify({
      PlannedOpeningDate: new Date(
        `${body.plannedOpeningDate.year}-${body.plannedOpeningDate.month}-${body.plannedOpeningDate.day}`
      ),
    })
    mockedPutAxios.mockResolvedValueOnce({ data: mockCPMSResponse })
    const response = await testHandler(api, { method: 'POST', body })

    expect(response.statusCode).toBe(302)
    expect(response._getRedirectUrl()).toBe(`/studies/${mockCPMSStudy.StudyId}?success=2`)

    expect(mockedPutAxios).toHaveBeenCalledTimes(1)
    expect(mockedPutAxios).toHaveBeenCalledWith(
      `${mockedEnvVars.apiUrl}/studies/${mockCPMSId}/engagement-info`,
      expectedBody,
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
    mockedPutAxios.mockRejectedValueOnce(new Error())
    const response = await testHandler(api, { method: 'POST', body })

    expect(response.statusCode).toBe(302)
    expect(response._getRedirectUrl()).toBe(`/editStudy/${mockCPMSStudy.StudyId}?fatal=1`)

    expect(mockedPutAxios).toHaveBeenCalledTimes(1)
  })

  test.each(['CPMS_API_URL', 'CPMS_API_USERNAME', 'CPMS_API_PASSWORD'])(
    'should redirect correctly when there are no environemnt variables',
    async (environmentVariable: string) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- listed values are safe to delete
      delete process.env[environmentVariable]

      mockedPutAxios.mockRejectedValueOnce(new Error())
      const response = await testHandler(api, { method: 'POST', body })

      expect(response.statusCode).toBe(302)
      expect(response._getRedirectUrl()).toBe(`/editStudy/${mockCPMSStudy.StudyId}?fatal=1`)

      expect(mockedPutAxios).not.toHaveBeenCalled()
    }
  )

  test('should redirect correctly when CPMS returns a non-200 status code', async () => {
    mockedPutAxios.mockResolvedValueOnce({ data: { ...mockCPMSResponse, StatusCode: 500 } })
    const response = await testHandler(api, { method: 'POST', body })

    expect(response.statusCode).toBe(302)
    expect(response._getRedirectUrl()).toBe(`/editStudy/${mockCPMSStudy.StudyId}?fatal=1`)

    expect(mockedPutAxios).toHaveBeenCalledTimes(1)
  })
})
