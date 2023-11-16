import type { Assessment, Study } from 'database'
import { Mock } from 'ts-mockery'
import type { RequestOptions } from 'node-mocks-http'
import { createResponse, createRequest } from 'node-mocks-http'
import type { NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { ZodError } from 'zod'
import { logger } from '@nihr-ui/logger'
import { prismaClient } from '../../../lib/prisma'
import type { AssessmentInputs } from '../../../utils/schemas'
import { userNoRoles, userWithSponsorContactRole } from '../../../__mocks__/session'
import { AuthError } from '../../../utils/auth'
import { SIGN_IN_PAGE } from '../../../constants/routes'
import type { ExtendedNextApiRequest } from './assessment'
import api from './assessment'

jest.mock('next-auth/next')
jest.mock('@nihr-ui/logger')

type ApiRequest = ExtendedNextApiRequest
type ApiResponse = NextApiResponse

const testHandler = async (handler: typeof api, options: RequestOptions) => {
  const req = createRequest<ApiRequest>(options)
  const res = createResponse<ApiResponse>()
  await handler(req, res)
  return res
}

describe('Successful study assessment submission', () => {
  const body: AssessmentInputs = {
    studyId: '999',
    status: '1',
    furtherInformation: ['2', '6'],
    furtherInformationText: 'Some extra text',
  }

  const createAssessmentResponse = Mock.of<Assessment>({ id: 1 })
  const updateStudyResponse = Mock.of<Study>({ id: 2 })

  beforeEach(() => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithSponsorContactRole)
    logger.info = jest.fn()
  })

  test('Saves the assessment and redirects back to the study detail page', async () => {
    const createAssessmentMock = jest
      .mocked(prismaClient.assessment.create)
      .mockResolvedValueOnce(createAssessmentResponse)
    const updateStudyMock = jest.mocked(prismaClient.study.update).mockResolvedValueOnce(updateStudyResponse)

    const res = await testHandler(api, { method: 'POST', body })

    // Redirect to studies page
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe('/studies?success=1')

    // Assessment data is saved in the database
    expect(createAssessmentMock).toHaveBeenCalledWith({
      data: {
        statusId: Number(body.status),
        studyId: Number(body.studyId),
        createdById: userWithSponsorContactRole.user?.id,
        furtherInformation: {
          createMany: {
            data: [
              {
                furtherInformationId: 2,
              },
              {
                furtherInformationId: 6,
              },
              {
                furtherInformationText: 'Some extra text',
              },
            ],
          },
        },
      },
    })

    // Study is updated to not be due an assessment
    expect(updateStudyMock).toHaveBeenCalledWith({
      where: { id: 999 },
      data: { isDueAssessment: false },
    })

    expect(logger.info).toHaveBeenCalledWith('Added assessment with id: 1')
    expect(logger.info).toHaveBeenCalledWith('Updated study with id: 2')
  })

  test('Saves the assessment and redirects back to the study list page', async () => {
    const createAssessmentMock = jest
      .mocked(prismaClient.assessment.create)
      .mockResolvedValueOnce(createAssessmentResponse)
    const updateStudyMock = jest.mocked(prismaClient.study.update).mockResolvedValueOnce(updateStudyResponse)

    const res = await testHandler(api, { method: 'POST', body, query: { returnUrl: `studies/${body.studyId}` } })

    // Redirect to study detail page
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/studies/${body.studyId}?success=1`)

    // Assessment data is saved in the database
    expect(createAssessmentMock).toHaveBeenCalledWith({
      data: {
        statusId: Number(body.status),
        studyId: Number(body.studyId),
        createdById: userWithSponsorContactRole.user?.id,
        furtherInformation: {
          createMany: {
            data: [
              {
                furtherInformationId: 2,
              },
              {
                furtherInformationId: 6,
              },
              {
                furtherInformationText: 'Some extra text',
              },
            ],
          },
        },
      },
    })

    // Study is updated to not be due an assessment
    expect(updateStudyMock).toHaveBeenCalledWith({
      where: { id: 999 },
      data: { isDueAssessment: false },
    })

    expect(logger.info).toHaveBeenCalledWith('Added assessment with id: 1')
    expect(logger.info).toHaveBeenCalledWith('Updated study with id: 2')
  })
})

describe('Failed study assessment submission', () => {
  const body: AssessmentInputs = {
    studyId: '999',
    status: '1',
    furtherInformation: ['2', '6'],
    furtherInformationText: 'Some extra text',
  }

  beforeEach(() => {
    logger.info = jest.fn()
    logger.error = jest.fn()
  })

  test('User not logged in redirects to sign in page', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(null)
    const res = await testHandler(api, { method: 'POST', body, query: {} })
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(SIGN_IN_PAGE)
    expect(logger.error).toHaveBeenCalledWith(new AuthError('Not signed in'))
  })

  test('User without roles redirects to error page', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userNoRoles)
    const res = await testHandler(api, { method: 'POST', body, query: {} })
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/500`)
    expect(logger.error).toHaveBeenCalledWith(new Error('No role found for user'))
  })

  test('Wrong http method redirects back to the form with a fatal error', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithSponsorContactRole)
    const res = await testHandler(api, { method: 'GET', body, query: {} })
    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(`/assessments/${body.studyId}/?fatal=1`)
    expect(logger.error).toHaveBeenCalledWith(new Error('Wrong method'))
  })

  test('Validation errors redirects back to the form with the errors and original values', async () => {
    jest.mocked(getServerSession).mockResolvedValueOnce(userWithSponsorContactRole)
    jest.mocked(prismaClient.assessment.create).mockResolvedValueOnce(Mock.of<Assessment>({ id: 1 }))
    jest.mocked(prismaClient.study.update).mockResolvedValueOnce(Mock.of<Study>({ id: 2 }))

    const bodyWithValidationIssue: Partial<AssessmentInputs> = {
      studyId: '999',
      status: undefined,
      furtherInformation: ['4', '5'],
      furtherInformationText: 'Some extra text',
    }

    const res = await testHandler(api, { method: 'POST', body: bodyWithValidationIssue })

    expect(res.statusCode).toBe(302)
    expect(res._getRedirectUrl()).toBe(
      `/assessments/999/?statusError=Select+how+the+study+is+progressing&furtherInformation=4%2C5&furtherInformationText=Some+extra+text`
    )
    expect(logger.error).toHaveBeenCalledWith(
      new ZodError([
        {
          code: 'invalid_type',
          expected: 'string',
          received: 'undefined',
          path: ['status'],
          message: 'Select how the study is progressing',
        },
      ])
    )
  })
})
