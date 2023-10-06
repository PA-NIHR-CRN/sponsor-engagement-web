import type { GetServerSidePropsContext } from 'next'
import { Mock } from 'ts-mockery'
import { getServerSession } from 'next-auth/next'
import { render, within, screen } from '@testing-library/react'
import { NextSeo } from 'next-seo'
import type { Prisma } from 'database'
import { simpleFaker } from '@faker-js/faker'
import type { AssessmentProps } from '../pages/assessments/[studyId]'
import Assessment, { getServerSideProps } from '../pages/assessments/[studyId]'
import { userNoRoles, userWithSponsorContactRole } from '../__mocks__/session'
import { SIGN_IN_PAGE } from '../constants/routes'
import { prismaMock } from '../__mocks__/prisma'
import { sysRefAssessmentFurtherInformation, sysRefAssessmentStatus } from '../__mocks__/sysRefData'

jest.mock('next-auth/next')
jest.mock('next-seo')

describe('getServerSideProps', () => {
  const getServerSessionMock = jest.mocked(getServerSession)
  const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {} })

  test('redirects to sign in page when there is no user session', async () => {
    getServerSessionMock.mockResolvedValueOnce(null)
    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: SIGN_IN_PAGE,
      },
    })
  })

  test('redirects back to the homepage for users without any roles', async () => {
    getServerSessionMock.mockResolvedValueOnce(userNoRoles)

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: '/',
      },
    })
  })
})

describe('Assess progress of a study', () => {
  jest.mocked(getServerSession).mockResolvedValue(userWithSponsorContactRole)

  const mockedStudyId = 99
  let study

  beforeEach(() => {
    prismaMock.sysRefAssessmentStatus.findMany.mockResolvedValueOnce(sysRefAssessmentStatus)

    prismaMock.sysRefAssessmentFurtherInformation.findMany.mockResolvedValueOnce(sysRefAssessmentFurtherInformation)

    study = Mock.of<
      Prisma.StudyGetPayload<{
        include: {
          organisations: {
            include: {
              organisation: true
              organisationRole: true
            }
          }
          evaluationCategories: true
          assessments: {
            include: {
              status: true
            }
          }
        }
      }>
    >({
      id: mockedStudyId,
      name: 'Test Study',
      isDueAssessment: true,
      organisations: [
        {
          organisation: {
            id: simpleFaker.number.int(),
            name: 'Test Organisation',
          },
          organisationRole: {
            id: simpleFaker.number.int(),
            name: 'Test Organisation Role',
          },
        },
      ],
      evaluationCategories: [
        {
          indicatorType: 'Milestone missed',
          updatedAt: new Date('2001-01-01'),
          createdAt: new Date('2001-01-01'),
        },
      ],
      assessments: [{ status: { name: 'Off Track' } }],
    })

    prismaMock.$transaction.mockResolvedValueOnce([study, sysRefAssessmentStatus, sysRefAssessmentFurtherInformation])
  })

  test('Default layout', async () => {
    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: String(mockedStudyId) } })

    const { props } = (await getServerSideProps(context)) as {
      props: AssessmentProps
    }

    render(Assessment.getLayout(<Assessment {...props} />, { ...props }))

    // SEO
    expect(NextSeo).toHaveBeenCalledWith({ title: 'Study Progress Review - Assess progress of study' }, {})

    // Title
    expect(screen.getByRole('heading', { level: 2, name: 'Assess progress of a study' })).toBeInTheDocument()

    // Description
    expect(
      screen.getByText(
        'You will need to assess if the study is on or off track and if any action is being taken. If you need NIHR CRN support with this study you will need to request this separately.'
      )
    ).toBeInTheDocument()

    // Support
    expect(screen.getByRole('heading', { level: 3, name: 'Get NIHR CRN support' })).toBeInTheDocument()
    expect(
      screen.getByText('Sponsors or their delegates can get NIHR CRN support with their research study at any time.')
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Get support' })).toHaveAttribute('href', '/')

    // Study sponsor
    expect(screen.getByText('Test Organisation')).toBeInTheDocument()

    // Study title
    expect(screen.getByRole('heading', { level: 3, name: 'Test Study' })).toBeInTheDocument()

    // Form Input - Status
    const statusFieldset = screen.getByRole('group', { name: 'Is this study progressing as planned?' })

    expect(within(statusFieldset).getByLabelText('On track')).toBeInTheDocument()
    expect(within(statusFieldset).getByLabelText('On track')).toHaveAccessibleDescription(
      'The sponsor or delegate is satisfied the study is progressing as planned.'
    )
    expect(within(statusFieldset).getByLabelText('Off track')).toBeInTheDocument()
    expect(within(statusFieldset).getByLabelText('Off track')).toHaveAccessibleDescription(
      'The sponsor or delegate has some concerns about the study and is taking action where appropriate.'
    )

    // Form Input - Further information
    const furtherInformationFieldset = screen.getByRole('group', {
      name: 'Is there any additional information that would help NIHR CRN understand this progress assessment?',
    })

    for (const item of sysRefAssessmentFurtherInformation) {
      expect(within(furtherInformationFieldset).getByLabelText(item.name)).toBeInTheDocument()
    }

    // Form Input - Further information (text)
    expect(screen.getByLabelText('Further information (optional)')).toBeInTheDocument()
    expect(screen.getByText('You have 400 characters remaining')).toBeInTheDocument()

    // Submit CTA
    expect(screen.getByRole('button', { name: 'Submit assessment' })).toHaveAttribute('type', 'submit')

    // Cancel CTA
    expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute('href', `/studies/${mockedStudyId}`)
  })

  test('Cancel button redirects back to the studies page if access from the list', async () => {
    const context = Mock.of<GetServerSidePropsContext>({
      req: {},
      res: {},
      query: { studyId: String(mockedStudyId), returnUrl: 'studies' },
    })

    const { props } = (await getServerSideProps(context)) as {
      props: AssessmentProps
    }

    render(Assessment.getLayout(<Assessment {...props} />, { ...props }))

    // Cancel CTA
    expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute('href', `/studies`)
  })
})
