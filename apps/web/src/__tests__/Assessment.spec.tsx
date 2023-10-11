import type { GetServerSidePropsContext } from 'next'
import { Mock } from 'ts-mockery'
import { getServerSession } from 'next-auth/next'
import { render, within, screen } from '@testing-library/react'
import { NextSeo } from 'next-seo'
import type { Prisma } from 'database'
import { simpleFaker } from '@faker-js/faker'
import userEvent from '@testing-library/user-event'
import mockRouter from 'next-router-mock'
import type { AssessmentProps } from '../pages/assessments/[studyId]'
import Assessment, { getServerSideProps } from '../pages/assessments/[studyId]'
import { userNoRoles, userWithSponsorContactRole } from '../__mocks__/session'
import { SIGN_IN_PAGE } from '../constants/routes'
import { prismaMock } from '../__mocks__/prisma'
import { sysRefAssessmentFurtherInformation, sysRefAssessmentStatus } from '../__mocks__/sysRefData'

jest.mock('next-auth/next')
jest.mock('next-seo')
jest.mock('axios')

describe('getServerSideProps', () => {
  const getServerSessionMock = jest.mocked(getServerSession)
  const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: '123' } })

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

  test('redirects to 404 page if no study id provided', async () => {
    getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)

    const result = await getServerSideProps({ ...context, query: { studyId: undefined } })
    expect(result).toEqual({
      redirect: {
        destination: '/404',
      },
    })
  })

  test('redirects to 404 page if no study found', async () => {
    getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)

    prismaMock.$transaction.mockResolvedValueOnce([])

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: '/404',
      },
    })
  })
})

type StudyWithRelations = Prisma.StudyGetPayload<{
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
        createdBy: true
        furtherInformation: {
          include: {
            furtherInformation: true
          }
        }
      }
    }
  }
}>

const mockedStudyId = 99
const study = Mock.of<StudyWithRelations>({
  id: mockedStudyId,
  name: 'Test Study',
  isDueAssessment: true,
  createdAt: new Date('2001-01-01'),
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
  assessments: [
    {
      status: { name: 'Off track' },
      createdBy: {
        email: 'mockeduser@nihr.ac.uk',
      },
      furtherInformation: [
        {
          furtherInformation: {
            name: 'Mocked list item 1',
          },
        },
        {
          furtherInformation: {
            name: 'Mocked list item 2',
          },
        },
        {
          furtherInformation: {
            name: 'Mocked list item 3',
          },
        },
        {
          furtherInformationText: 'Testing some further information',
        },
      ],
      updatedAt: new Date('2001-01-01'),
      createdAt: new Date('2001-01-01'),
    },
  ],
})

describe('Assess progress of a study', () => {
  jest.mocked(getServerSession).mockResolvedValue(userWithSponsorContactRole)

  test('Default layout', async () => {
    prismaMock.sysRefAssessmentStatus.findMany.mockResolvedValueOnce(sysRefAssessmentStatus)
    prismaMock.sysRefAssessmentFurtherInformation.findMany.mockResolvedValueOnce(sysRefAssessmentFurtherInformation)
    prismaMock.$transaction.mockResolvedValueOnce([study, sysRefAssessmentStatus, sysRefAssessmentFurtherInformation])

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

    // Study details accordion
    expect(screen.getByRole('button', { name: 'Show study details', expanded: false })).toBeInTheDocument()

    // Last sponsor assessment
    expect(screen.getByRole('heading', { level: 3, name: 'Last sponsor assessment' })).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: '1 January 2001 Off track assessed by mockeduser@nihr.ac.uk',
        expanded: false,
      })
    ).toBeInTheDocument()

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
    prismaMock.sysRefAssessmentStatus.findMany.mockResolvedValueOnce(sysRefAssessmentStatus)
    prismaMock.sysRefAssessmentFurtherInformation.findMany.mockResolvedValueOnce(sysRefAssessmentFurtherInformation)
    prismaMock.$transaction.mockResolvedValueOnce([study, sysRefAssessmentStatus, sysRefAssessmentFurtherInformation])

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

  test('No previous assessments', async () => {
    prismaMock.$transaction.mockResolvedValueOnce([
      {
        ...study,
        assessments: [],
      },
      sysRefAssessmentStatus,
      sysRefAssessmentFurtherInformation,
    ])

    const context = Mock.of<GetServerSidePropsContext>({
      req: {},
      res: {},
      query: { studyId: String(mockedStudyId), returnUrl: 'studies' },
    })

    const { props } = (await getServerSideProps(context)) as {
      props: AssessmentProps
    }

    render(Assessment.getLayout(<Assessment {...props} />, { ...props }))

    expect(screen.getByRole('heading', { level: 3, name: 'Last sponsor assessment' })).toBeInTheDocument()

    expect(
      screen.queryByRole('button', {
        name: '1 January 2001 Off track assessed by mockeduser@nihr.ac.uk',
        expanded: false,
      })
    ).not.toBeInTheDocument()

    expect(screen.getByText('This study has not had any assessments provided')).toBeInTheDocument()
  })
})

describe('Expanding the show study details accordion', () => {
  test('Shows more information about the study', async () => {
    prismaMock.sysRefAssessmentStatus.findMany.mockResolvedValueOnce(sysRefAssessmentStatus)
    prismaMock.sysRefAssessmentFurtherInformation.findMany.mockResolvedValueOnce(sysRefAssessmentFurtherInformation)
    prismaMock.$transaction.mockResolvedValueOnce([study, sysRefAssessmentStatus, sysRefAssessmentFurtherInformation])

    const context = Mock.of<GetServerSidePropsContext>({
      req: {},
      res: {},
      query: { studyId: String(mockedStudyId) },
    })

    const { props } = (await getServerSideProps(context)) as {
      props: AssessmentProps
    }

    render(Assessment.getLayout(<Assessment {...props} />, { ...props }))

    // Expand accordion
    await userEvent.click(screen.getByRole('button', { name: 'Show study details', expanded: false }))

    expect(screen.getByRole('button', { name: 'Show study details', expanded: true })).toBeInTheDocument()
    expect(screen.getByText('todo')).toBeInTheDocument()
  })
})

describe('Expanding last sponsor assessment accordion', () => {
  test('Shows further information', async () => {
    prismaMock.sysRefAssessmentStatus.findMany.mockResolvedValueOnce(sysRefAssessmentStatus)
    prismaMock.sysRefAssessmentFurtherInformation.findMany.mockResolvedValueOnce(sysRefAssessmentFurtherInformation)
    prismaMock.$transaction.mockResolvedValueOnce([study, sysRefAssessmentStatus, sysRefAssessmentFurtherInformation])

    const context = Mock.of<GetServerSidePropsContext>({
      req: {},
      res: {},
      query: { studyId: String(mockedStudyId) },
    })

    const { props } = (await getServerSideProps(context)) as {
      props: AssessmentProps
    }

    render(Assessment.getLayout(<Assessment {...props} />, { ...props }))

    // Expand accordion
    await userEvent.click(
      screen.getByRole('button', {
        name: '1 January 2001 Off track assessed by mockeduser@nihr.ac.uk',
        expanded: false,
      })
    )

    expect(
      screen.getByRole('button', {
        name: '1 January 2001 Off track assessed by mockeduser@nihr.ac.uk',
        expanded: true,
      })
    ).toBeInTheDocument()

    const list = screen.getByRole('list', { name: 'Further information' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(3)
    expect(within(list).getByText('Mocked list item 1')).toBeInTheDocument()
    expect(within(list).getByText('Mocked list item 2')).toBeInTheDocument()
    expect(within(list).getByText('Mocked list item 3')).toBeInTheDocument()

    expect(screen.getByText('Testing some further information')).toBeInTheDocument()
  })
})

describe('Form submission failures', () => {
  beforeEach(() => {
    console.error = jest.fn()
    void mockRouter.push('/assessments/123')
    jest.clearAllMocks()
  })

  test('Client side validation errors', async () => {
    prismaMock.sysRefAssessmentStatus.findMany.mockResolvedValueOnce(sysRefAssessmentStatus)
    prismaMock.sysRefAssessmentFurtherInformation.findMany.mockResolvedValueOnce(sysRefAssessmentFurtherInformation)
    prismaMock.$transaction.mockResolvedValueOnce([study, sysRefAssessmentStatus, sysRefAssessmentFurtherInformation])

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: String(mockedStudyId) } })

    const { props } = (await getServerSideProps(context)) as {
      props: AssessmentProps
    }

    render(Assessment.getLayout(<Assessment {...props} />, { ...props }))

    expect(screen.getByRole('heading', { name: 'Assess progress of a study', level: 2 })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Submit assessment' }))

    // Summary errors
    const alert = screen.getByRole('alert', { name: 'There is a problem' })
    expect(within(alert).getByRole('link', { name: 'Select how the study is progressing' })).toHaveAttribute(
      'href',
      '#status'
    )
    expect(
      within(alert).queryByRole('link', { name: 'Select any additional further information' })
    ).not.toBeInTheDocument()

    // Field errors
    expect(screen.getByRole('group', { name: 'Is this study progressing as planned?' })).toHaveAccessibleErrorMessage(
      'Error: Select how the study is progressing'
    )
    expect(
      screen.getByRole('group', {
        name: 'Is there any additional information that would help NIHR CRN understand this progress assessment?',
      })
    ).not.toHaveAccessibleErrorMessage()
    expect(screen.getByLabelText('Further information (optional)')).not.toHaveAccessibleErrorMessage()
  })

  test('Server side field validation errors', async () => {
    void mockRouter.push('?statusError=Select+how+the+study+is+progressing')

    prismaMock.sysRefAssessmentStatus.findMany.mockResolvedValueOnce(sysRefAssessmentStatus)
    prismaMock.sysRefAssessmentFurtherInformation.findMany.mockResolvedValueOnce(sysRefAssessmentFurtherInformation)
    prismaMock.$transaction.mockResolvedValueOnce([study, sysRefAssessmentStatus, sysRefAssessmentFurtherInformation])

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: String(mockedStudyId) } })

    const { props } = (await getServerSideProps(context)) as {
      props: AssessmentProps
    }

    render(Assessment.getLayout(<Assessment {...props} />, { ...props }))

    expect(screen.getByRole('heading', { name: 'Assess progress of a study', level: 2 })).toBeInTheDocument()

    // Summary errors
    const alert = screen.getByRole('alert', { name: 'There is a problem' })
    expect(within(alert).getByRole('link', { name: 'Select how the study is progressing' })).toHaveAttribute(
      'href',
      '#status'
    )
    expect(
      within(alert).queryByRole('link', { name: 'Select any additional further information' })
    ).not.toBeInTheDocument()

    // Field errors
    expect(screen.getByRole('group', { name: 'Is this study progressing as planned?' })).toHaveAccessibleErrorMessage(
      'Error: Select how the study is progressing'
    )
    expect(
      screen.getByRole('group', {
        name: 'Is there any additional information that would help NIHR CRN understand this progress assessment?',
      })
    ).not.toHaveAccessibleErrorMessage()
    expect(screen.getByLabelText('Further information (optional)')).not.toHaveAccessibleErrorMessage()
  })

  test('Fatal server error shows an error at the top of the page', async () => {
    prismaMock.sysRefAssessmentStatus.findMany.mockResolvedValueOnce(sysRefAssessmentStatus)
    prismaMock.sysRefAssessmentFurtherInformation.findMany.mockResolvedValueOnce(sysRefAssessmentFurtherInformation)
    prismaMock.$transaction.mockResolvedValueOnce([study, sysRefAssessmentStatus, sysRefAssessmentFurtherInformation])

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: String(mockedStudyId) } })

    const { props } = (await getServerSideProps(context)) as {
      props: AssessmentProps
    }

    render(Assessment.getLayout(<Assessment {...props} />, { ...props }))

    expect(screen.getByRole('heading', { name: 'Assess progress of a study', level: 2 })).toBeInTheDocument()

    // Status
    await userEvent.click(screen.getByLabelText('On track'))

    // Further information
    await userEvent.click(screen.getByLabelText('Study no longer going ahead in the UK [withdrawn during setup]'))
    await userEvent.click(screen.getByLabelText('Waiting for site approval or activation'))
    await userEvent.click(screen.getByLabelText('Follow up complete or none required'))

    await userEvent.click(screen.getByRole('button', { name: 'Submit assessment' }))

    expect(mockRouter.asPath).toBe('/assessments/123?fatal=1')

    const alert = screen.getByRole('alert')
    expect(
      within(alert).getByText('An unexpected error occured whilst processing the form, please try again later.')
    ).toBeInTheDocument()
  })
})
