import axios from 'axios'

import { mockCPMSStudy } from '../../mocks/studies'
import { getStudyByIdFromCPMS } from './studies'

jest.mock('axios')
const mockedGetAxios = jest.mocked(axios.get)

const env = { ...process.env }
const mockedEnvVars = {
  apiUrl: 'cpms-api',
  apiUsername: 'testuser',
  apiPassword: 'testpwd',
}

const mockStudyId = Number(mockCPMSStudy.StudyId)

describe('getStudyByIdFromCPMS', () => {
  beforeEach(() => {
    process.env.CPMS_API_URL = mockedEnvVars.apiUrl
    process.env.CPMS_API_USERNAME = mockedEnvVars.apiUsername
    process.env.CPMS_API_PASSWORD = mockedEnvVars.apiPassword
    jest.resetAllMocks()
  })

  afterAll(() => {
    process.env = env
  })

  it('should return study when API request is successful', async () => {
    const mockResponse = {
      StatusCode: 200,
      Result: mockCPMSStudy,
    }

    mockedGetAxios.mockResolvedValueOnce({ data: mockResponse })

    const result = await getStudyByIdFromCPMS(mockStudyId)

    expect(result).toStrictEqual({ study: mockResponse.Result })

    expect(mockedGetAxios).toHaveBeenCalledTimes(1)
    expect(mockedGetAxios).toHaveBeenCalledWith(`${mockedEnvVars.apiUrl}/studies/${mockStudyId}/engagement-info`, {
      headers: { username: mockedEnvVars.apiUsername, password: mockedEnvVars.apiPassword },
    })
  })

  it('should return error when CPMS does not return a 200 status code', async () => {
    const mockErrorResponseData = {
      StatusCode: 500,
      Result: {},
    }

    mockedGetAxios.mockResolvedValueOnce({ data: mockErrorResponseData })

    const result = await getStudyByIdFromCPMS(mockStudyId)

    expect(result).toEqual({ study: null, error: 'An error occured fetching study from CPMS' })

    expect(mockedGetAxios).toHaveBeenCalledTimes(1)
  })

  it('should return error when request to CPMS throws an error', async () => {
    const mockErrorMessage = 'Oh no, an error'

    mockedGetAxios.mockRejectedValueOnce(new Error(mockErrorMessage))

    const result = await getStudyByIdFromCPMS(mockStudyId)

    expect(result).toEqual({ study: null, error: mockErrorMessage })

    expect(mockedGetAxios).toHaveBeenCalledTimes(1)
  })

  it.each(['CPMS_API_URL', 'CPMS_API_USERNAME', 'CPMS_API_PASSWORD'])(
    'should throw an error when % environment variable does not exist',
    async (environmentVariable: string) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- listed values are safe to delete
      delete process.env[environmentVariable]

      const result = await getStudyByIdFromCPMS(mockStudyId)

      expect(result.error?.includes(`${environmentVariable} is not defined`)).toB
    }
  )
})
