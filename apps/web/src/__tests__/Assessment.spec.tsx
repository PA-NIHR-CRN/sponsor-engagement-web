import { simpleFaker } from '@faker-js/faker'
import { logger } from '@nihr-ui/logger'
import userEvent from '@testing-library/user-event'
import type { Prisma } from 'database'
import type { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'
import mockRouter from 'next-router-mock'
import { NextSeo } from 'next-seo'
import { Mock } from 'ts-mockery'

import { render, screen, within } from '@/config/TestUtils'

import { prismaMock } from '../__mocks__/prisma'
import { userNoRoles, userWithSponsorContactRole } from '../__mocks__/session'
import { sysRefAssessmentFurtherInformation, sysRefAssessmentStatus } from '../__mocks__/sysRefData'
import { SIGN_IN_PAGE, SUPPORT_PAGE } from '../constants/routes'
import type { AssessmentProps } from '../pages/studies/[studyId]/assess'
import Assessment, { getServerSideProps } from '../pages/studies/[studyId]/assess'

jest.mock('next-auth/next')
jest.mock('next-seo')
jest.mock('axios')
jest.mock('@nihr-ui/logger')

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
  title: 'Test Study',
  cpmsId: 12345,
  createdAt: new Date('2001-01-01'),
  managingSpeciality: 'Cancer',
  organisations: [
    {
      organisation: {
        id: simpleFaker.number.int(),
        name: 'Test Organisation',
      },
      organisationRole: {
        id: simpleFaker.number.int(),
        name: 'Clinical Research Sponsor',
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
      id: 1,
      status: { name: 'Off track' },
      createdBy: {
        email: 'mockeduser@nihr.ac.uk',
      },
      furtherInformation: [
        {
          id: 1,
          furtherInformation: {
            name: 'Mocked list item 1',
          },
        },
        {
          id: 2,
          furtherInformation: {
            name: 'Mocked list item 2',
          },
        },
        {
          id: 3,
          furtherInformation: {
            name: 'Mocked list item 3',
          },
        },
        {
          id: 4,
          furtherInformationText: 'Testing some further information',
        },
      ],
      updatedAt: new Date('2001-01-01'),
      createdAt: new Date('2001-01-01'),
    },
  ],
})

const env = { ...process.env }
const mockedEnvVars = {
  apiUrl: 'cpms-api',
  apiUsername: 'testuser',
  apiPassword: 'testpwd',
}

const renderPage = async (
  context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: String(mockedStudyId) } }),
  firstStudyResponse = study,
  url = '/studies/123/assess'
) => {
  jest.mocked(getServerSession).mockResolvedValue(userWithSponsorContactRole)
  prismaMock.$transaction.mockResolvedValueOnce([firstStudyResponse])
  prismaMock.$transaction.mockResolvedValueOnce([sysRefAssessmentStatus, sysRefAssessmentFurtherInformation])

  await mockRouter.push(url)

  const { props } = (await getServerSideProps(context)) as {
    props: AssessmentProps
  }

  render(Assessment.getLayout(<Assessment {...props} />, { ...props }))
}

describe('Assessment', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  beforeAll(() => {
    process.env.CPMS_API_URL = mockedEnvVars.apiUrl
    process.env.CPMS_API_USERNAME = mockedEnvVars.apiUsername
    process.env.CPMS_API_PASSWORD = mockedEnvVars.apiPassword
  })

  afterAll(() => {
    process.env = env
  })

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
      prismaMock.$transaction.mockResolvedValueOnce([])

      const result = await getServerSideProps(context)
      expect(result).toEqual({
        redirect: {
          destination: '/404',
        },
      })
    })
  })

  describe('Assess progress of a study in the UK', () => {
    test('Default layout', async () => {
      await renderPage()

      // SEO
      expect(NextSeo).toHaveBeenCalledWith({ title: 'Study Progress Review - Assess progress of study' }, {})

      // Title
      expect(
        screen.getByRole('heading', { level: 2, name: 'Assess progress of a study in the UK' })
      ).toBeInTheDocument()

      // Description
      expect(
        screen.getByText(
          'You will need to assess if the study is on or off track in the UK and if any action is being taken. If you need NIHR RDN support with this study you will need to request this separately.'
        )
      ).toBeInTheDocument()

      // Support
      expect(screen.getByRole('heading', { level: 3, name: 'Request NIHR RDN support' })).toBeInTheDocument()
      expect(
        screen.getByText(
          'Sponsors or their delegates can request NIHR RDN support with their research study at any time.'
        )
      ).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Request support' })).toHaveAttribute(
        'href',
        `${SUPPORT_PAGE}?returnPath=/studies/123/assess`
      )

      // Study sponsor
      expect(screen.getByText('Test Organisation')).toBeInTheDocument()

      // Study title
      expect(screen.getByRole('heading', { level: 3, name: 'Study title: Test Study' })).toBeInTheDocument()

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
      const statusFieldset = screen.getByRole('radiogroup', { name: 'Is this study progressing in the UK as planned?' })

      expect(within(statusFieldset).getByLabelText('On track')).toBeInTheDocument()
      expect(within(statusFieldset).getByLabelText('On track')).toHaveAccessibleDescription(
        'The sponsor or delegate is satisfied the study is progressing in the UK as planned.'
      )
      expect(within(statusFieldset).getByLabelText('Off track')).toBeInTheDocument()
      expect(within(statusFieldset).getByLabelText('Off track')).toHaveAccessibleDescription(
        'The sponsor or delegate has some concerns about the study in the UK and is taking action where appropriate.'
      )

      // Form Input - Further information
      const furtherInformationFieldset = screen.getByRole('group', {
        name: 'Is there any additional information that would help NIHR RDN understand this progress assessment? (optional)',
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

      await renderPage(context)

      // Cancel CTA
      expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute('href', `/studies`)
    })

    test('No previous assessments', async () => {
      const context = Mock.of<GetServerSidePropsContext>({
        req: {},
        res: {},
        query: { studyId: String(mockedStudyId), returnUrl: 'studies' },
      })

      await renderPage(context, {
        ...study,
        assessments: [],
      })
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
      await renderPage()

      // Expand accordion
      await userEvent.click(screen.getByRole('button', { name: 'Show study details', expanded: false }))

      expect(screen.getByRole('button', { name: 'Show study details', expanded: true })).toBeInTheDocument()

      const table = screen.getByRole('table', { name: 'About this study' })
      expect(table).toBeInTheDocument()

      const aboutHeaders = within(table).getAllByRole('rowheader')
      expect(aboutHeaders.map((header) => header.textContent)).toEqual([
        'Study full title',
        'IRAS ID',
        'CPMS ID',
        'Sponsor',
        'Managing specialty',
        'Chief investigator',
      ])

      const aboutRows = within(table).getAllByRole('row')
      expect(aboutRows.map((row) => within(row).getByRole('cell').textContent)).toEqual([
        study.title,
        study.irasId ?? 'None available',
        study.cpmsId.toString(),
        study.organisations[0].organisation.name,
        study.managingSpeciality,
        `${
          study.chiefInvestigatorFirstName
            ? `${study.chiefInvestigatorFirstName}, ${study.chiefInvestigatorLastName}`
            : 'None available'
        }`,
      ])
    })
  })

  describe('Expanding last sponsor assessment accordion', () => {
    test('Shows further information', async () => {
      await renderPage()

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
      logger.error = jest.fn()
      jest.clearAllMocks()
    })

    test('Client side validation errors', async () => {
      await renderPage()

      expect(
        screen.getByRole('heading', { name: 'Assess progress of a study in the UK', level: 2 })
      ).toBeInTheDocument()

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
      expect(
        screen.getByRole('radiogroup', { name: 'Is this study progressing in the UK as planned?' })
      ).toHaveAccessibleErrorMessage('Error: Select how the study is progressing')
      expect(
        screen.getByRole('group', {
          name: 'Is there any additional information that would help NIHR RDN understand this progress assessment? (optional)',
        })
      ).not.toHaveAccessibleErrorMessage()
      expect(screen.getByLabelText('Further information (optional)')).not.toHaveAccessibleErrorMessage()
    })

    test('Server side field validation errors', async () => {
      await renderPage(undefined, undefined, '?statusError=Select+how+the+study+is+progressing')

      expect(
        screen.getByRole('heading', { name: 'Assess progress of a study in the UK', level: 2 })
      ).toBeInTheDocument()

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
      expect(
        screen.getByRole('radiogroup', { name: 'Is this study progressing in the UK as planned?' })
      ).toHaveAccessibleErrorMessage('Error: Select how the study is progressing')
      expect(
        screen.getByRole('group', {
          name: 'Is there any additional information that would help NIHR RDN understand this progress assessment? (optional)',
        })
      ).not.toHaveAccessibleErrorMessage()
      expect(screen.getByLabelText('Further information (optional)')).not.toHaveAccessibleErrorMessage()
    })

    test('Fatal server error shows an error at the top of the page', async () => {
      await renderPage()

      expect(
        screen.getByRole('heading', { name: 'Assess progress of a study in the UK', level: 2 })
      ).toBeInTheDocument()

      // Status
      await userEvent.click(screen.getByLabelText('On track'))

      // Further information
      await userEvent.click(screen.getByLabelText('Study no longer going ahead in the UK [withdrawn during setup]'))
      await userEvent.click(screen.getByLabelText('Waiting for site approval or activation'))
      await userEvent.click(screen.getByLabelText('Follow up complete or none required'))

      await userEvent.click(screen.getByRole('button', { name: 'Submit assessment' }))

      expect(mockRouter.asPath).toBe('/studies/123/assess?fatal=1')

      const alert = screen.getByRole('alert')
      expect(
        within(alert).getByText('An unexpected error occurred whilst processing the form, please try again later.')
      ).toBeInTheDocument()
    })
  })
})
