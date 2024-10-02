import axios from 'axios'

import { constructDateObjFromParts } from '@/utils/date'
import type { EditStudyInputs } from '@/utils/schemas'

import { mockCPMSStudy, mockCPMSUpdateInput, mockCPMSValidationResult } from '../../mocks/studies'
import { getStudyByIdFromCPMS, mapEditStudyInputToCPMSStudy, updateStudyInCPMS, validateStudyUpdate } from './studies'

jest.mock('axios')
const mockedGetAxios = jest.mocked(axios.get)
const mockedPutAxios = jest.mocked(axios.put)
const mockedPostAxios = jest.mocked(axios.post)

jest.mock('../../utils/date')
const mockConstructDateObjFromParts = constructDateObjFromParts as jest.MockedFunction<typeof constructDateObjFromParts>

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

  it('should return an error when CPMS does not return a 200 status code', async () => {
    const mockErrorResponseData = {
      StatusCode: 500,
      Result: {},
    }

    mockedGetAxios.mockResolvedValueOnce({ data: mockErrorResponseData })

    const result = await getStudyByIdFromCPMS(mockStudyId)

    expect(result).toEqual({ study: null, error: 'An error occured fetching study from CPMS' })

    expect(mockedGetAxios).toHaveBeenCalledTimes(1)
  })

  it('should return an error when request to CPMS throws an error', async () => {
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

      expect(result.error?.includes(`${environmentVariable} is not defined`)).toEqual(true)
    }
  )
})

describe('updateStudyInCPMS', () => {
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

    mockedPutAxios.mockResolvedValueOnce({ data: mockResponse })

    const result = await updateStudyInCPMS(mockStudyId, mockCPMSUpdateInput)

    expect(result).toStrictEqual({ study: mockResponse.Result })

    expect(mockedPutAxios).toHaveBeenCalledTimes(1)
    expect(mockedPutAxios).toHaveBeenCalledWith(
      `${mockedEnvVars.apiUrl}/studies/${mockStudyId}/engagement-info`,
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

  it('should return an error when CPMS does not return a 200 status code', async () => {
    const mockErrorResponseData = {
      StatusCode: 500,
      Result: {},
    }

    mockedPutAxios.mockResolvedValueOnce({ data: mockErrorResponseData })

    const result = await updateStudyInCPMS(mockStudyId, mockCPMSUpdateInput)

    expect(result).toEqual({ study: null, error: 'An error occured updating study in CPMS' })

    expect(mockedPutAxios).toHaveBeenCalledTimes(1)
  })

  it('should return an error when request to CPMS throws an error', async () => {
    const mockErrorMessage = 'Oh no, an error'

    mockedPutAxios.mockRejectedValueOnce(new Error(mockErrorMessage))

    const result = await updateStudyInCPMS(mockStudyId, mockCPMSUpdateInput)

    expect(result).toEqual({ study: null, error: mockErrorMessage })

    expect(mockedPutAxios).toHaveBeenCalledTimes(1)
  })

  it.each(['CPMS_API_URL', 'CPMS_API_USERNAME', 'CPMS_API_PASSWORD'])(
    'should throw an error when % environment variable does not exist',
    async (environmentVariable: string) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- listed values are safe to delete
      delete process.env[environmentVariable]

      const result = await updateStudyInCPMS(mockStudyId, mockCPMSUpdateInput)

      expect(result.error?.includes(`${environmentVariable} is not defined`)).toEqual(true)
    }
  )
})

describe('validateStudyUpdate', () => {
  beforeEach(() => {
    process.env.CPMS_API_URL = mockedEnvVars.apiUrl
    process.env.CPMS_API_USERNAME = mockedEnvVars.apiUsername
    process.env.CPMS_API_PASSWORD = mockedEnvVars.apiPassword
    jest.resetAllMocks()
  })

  afterAll(() => {
    process.env = env
  })

  it('should return validation result when API request is successful', async () => {
    const mockResponse = {
      StatusCode: 200,
      Result: mockCPMSValidationResult,
    }

    mockedPostAxios.mockResolvedValueOnce({ data: mockResponse })

    const result = await validateStudyUpdate(mockStudyId, mockCPMSUpdateInput)

    expect(result).toStrictEqual({ validationResult: mockResponse.Result })

    expect(mockedPostAxios).toHaveBeenCalledTimes(1)
    expect(mockedPostAxios).toHaveBeenCalledWith(
      `${mockedEnvVars.apiUrl}/studies/${mockStudyId}/engagement-info/validate`,
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

  it('should return an error when CPMS does not return a 200 status code', async () => {
    const mockErrorResponseData = {
      StatusCode: 500,
      Result: {},
    }

    mockedPostAxios.mockResolvedValueOnce({ data: mockErrorResponseData })

    const result = await validateStudyUpdate(mockStudyId, mockCPMSUpdateInput)

    expect(result).toEqual({ validationResult: null, error: 'An error occured validating study in CPMS' })

    expect(mockedPostAxios).toHaveBeenCalledTimes(1)
  })

  it('should return an error when request to CPMS throws an error', async () => {
    const mockErrorMessage = 'Oh no, an error'

    mockedPostAxios.mockRejectedValueOnce(new Error(mockErrorMessage))

    const result = await validateStudyUpdate(mockStudyId, mockCPMSUpdateInput)

    expect(result).toEqual({ validationResult: null, error: mockErrorMessage })

    expect(mockedPostAxios).toHaveBeenCalledTimes(1)
  })

  it.each(['CPMS_API_URL', 'CPMS_API_USERNAME', 'CPMS_API_PASSWORD'])(
    'should throw an error when % environment variable does not exist',
    async (environmentVariable: string) => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- listed values are safe to delete
      delete process.env[environmentVariable]

      const result = await validateStudyUpdate(mockStudyId, mockCPMSUpdateInput)

      expect(result.error?.includes(`${environmentVariable} is not defined`)).toEqual(true)
    }
  )
})

describe('mapEditStudyInputToCPMSStudy', () => {
  const input: EditStudyInputs = {
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
    recruitmentTarget: mockCPMSStudy.SampleSize?.toString() ?? undefined,
    furtherInformation: '',
  }

  const mockDate = new Date()

  const mappedInput = {
    StudyStatus: input.status,
    SampleSize: Number(input.recruitmentTarget),
    PlannedOpeningDate: mockDate.toISOString(),
    ActualOpeningDate: mockDate.toISOString(),
    PlannedClosureToRecruitmentDate: mockDate.toISOString(),
    ActualClosureToRecruitmentDate: mockDate.toISOString(),
    EstimatedReopeningDate: mockDate.toISOString(),
  }

  test('correctly maps data when all fields exist', () => {
    mockConstructDateObjFromParts.mockReturnValue(mockDate)

    const result = mapEditStudyInputToCPMSStudy(input)
    expect(result).toStrictEqual(mappedInput)
  })

  test('correctly maps date fields when they do not exist', () => {
    mockConstructDateObjFromParts.mockReturnValue(undefined)

    const result = mapEditStudyInputToCPMSStudy({
      ...input,
      plannedOpeningDate: undefined,
      actualClosureDate: undefined,
      actualOpeningDate: undefined,
      plannedClosureDate: undefined,
      estimatedReopeningDate: undefined,
    })
    expect(result).toStrictEqual({
      ...mappedInput,
      PlannedOpeningDate: null,
      ActualOpeningDate: null,
      PlannedClosureToRecruitmentDate: null,
      ActualClosureToRecruitmentDate: null,
      EstimatedReopeningDate: null,
    })
  })
})
