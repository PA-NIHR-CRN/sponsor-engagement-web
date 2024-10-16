import { simpleFaker } from '@faker-js/faker'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import type { Prisma } from 'database'
import type { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'
import mockRouter from 'next-router-mock'
import { NextSeo } from 'next-seo'
import { setStudyAssessmentDue } from 'shared-utilities'
import { Mock } from 'ts-mockery'

import { render, screen, within } from '@/config/TestUtils'
import { StudyUpdateState, StudyUpdateType } from '@/constants'
import {
  getMockEditHistoryFromCPMS,
  mappedCPMSStudyEvals,
  mockCPMSStudy,
  mockMappedAssessment,
  mockStudyUpdates,
  mockStudyWithRelations,
} from '@/mocks/studies'

import { prismaMock } from '../__mocks__/prisma'
import {
  userWithContactManagerRole,
  userWithSponsorContactRole,
  userWithSponsorContactRoleAndEditStudyRole,
} from '../__mocks__/session'
import { SIGN_IN_PAGE, SUPPORT_PAGE } from '../constants/routes'
import type { StudyProps } from '../pages/studies/[studyId]'
import Study, { getServerSideProps } from '../pages/studies/[studyId]'

jest.mock('next-auth/next')
jest.mock('next-seo')
jest.mock('axios')
jest.mock('shared-utilities')

const mockedGetAxios = jest.mocked(axios.get)
const mockSetStudyAssessmentDue = setStudyAssessmentDue as jest.MockedFunction<typeof setStudyAssessmentDue>

const env = { ...process.env }
const mockedEnvVars = {
  apiUrl: 'cpms-api',
  apiUsername: 'testuser',
  apiPassword: 'testpwd',
  assessmentLapseMonths: '3',
}

type StudyWithRelations = Prisma.StudyGetPayload<{
  include: {
    title: true
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

const mockStudyId = mockStudyWithRelations.id.toString()
const mockStudy = Mock.of<StudyWithRelations>({
  ...mockStudyWithRelations,
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
})

const organisationsByRole = {
  CRO: 'Test Organisation',
}

const renderPage = async (
  mockGetStudyResponse = mockStudy,
  mockUrl = `/study/${mockStudyId}`,
  mockGetCPMSStudyResponse = mockCPMSStudy,
  mockUpdateStudyResponse = mockStudy,
  mockUpdatedStudyEvals = mappedCPMSStudyEvals,
  isAssessmentDue = false
) => {
  jest.mocked(getServerSession).mockResolvedValue(userWithSponsorContactRoleAndEditStudyRole)

  prismaMock.$transaction.mockResolvedValueOnce([mockGetStudyResponse])
  mockedGetAxios.mockResolvedValueOnce({ data: { StatusCode: 200, Result: mockGetCPMSStudyResponse } })
  prismaMock.study.update.mockResolvedValueOnce(mockUpdateStudyResponse)
  mockSetStudyAssessmentDue.mockResolvedValueOnce({ count: isAssessmentDue ? 1 : 0 })
  mockUpdatedStudyEvals.forEach((studyEval) =>
    prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce(studyEval)
  )

  await mockRouter.push(mockUrl)

  // Requests for edit history
  prismaMock.studyUpdates.groupBy.mockResolvedValueOnce([
    { ...mockStudyUpdates[0], _count: true, _avg: undefined, _sum: undefined, _min: undefined, _max: undefined },
  ])
  prismaMock.studyUpdates.findMany.mockResolvedValueOnce(mockStudyUpdates)
  prismaMock.studyUpdates.findMany.mockResolvedValueOnce(
    mockStudyUpdates.map((studyUpdate) => ({
      ...studyUpdate,
      studyUpdateStateId: StudyUpdateState.After,
      studyUpdateTypeId: StudyUpdateType.Direct,
      LSN: studyUpdate.LSN ?? Buffer.from(mockCPMSStudy.ChangeHistory[1].LSN, 'hex'),
    }))
  )

  const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: mockStudyId } })

  const { props } = (await getServerSideProps(context)) as {
    props: StudyProps
  }

  render(Study.getLayout(<Study {...props} />, { ...props }))
}

describe('Study', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  beforeAll(() => {
    process.env.CPMS_API_URL = mockedEnvVars.apiUrl
    process.env.CPMS_API_USERNAME = mockedEnvVars.apiUsername
    process.env.CPMS_API_PASSWORD = mockedEnvVars.apiPassword
    process.env.ASSESSMENT_LAPSE_MONTHS = mockedEnvVars.assessmentLapseMonths
    process.env.NEXT_PUBLIC_ENABLE_EDIT_HISTORY_FEATURE = 'true'
  })

  afterAll(() => {
    process.env = env
  })

  describe('getServerSideProps', () => {
    const getServerSessionMock = jest.mocked(getServerSession)
    test('redirects to sign in page when there is no user session', async () => {
      const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {} })
      getServerSessionMock.mockResolvedValueOnce(null)
      const result = await getServerSideProps(context)
      expect(result).toEqual({
        redirect: {
          destination: SIGN_IN_PAGE,
        },
      })
    })

    test('redirects back to the homepage for users without sponsor contact role', async () => {
      const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {} })
      getServerSessionMock.mockResolvedValueOnce(userWithContactManagerRole)

      const result = await getServerSideProps(context)
      expect(result).toEqual({
        redirect: {
          destination: '/',
        },
      })
    })

    test('redirects to 404 page if no study id provided', async () => {
      const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: {} })
      getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)

      const result = await getServerSideProps(context)
      expect(result).toEqual({
        redirect: {
          destination: '/404',
        },
      })
    })

    test('redirects to 404 page if no study found', async () => {
      const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: mockStudyId } })
      getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
      prismaMock.$transaction.mockResolvedValueOnce([])

      const result = await getServerSideProps(context)
      expect(result).toEqual({
        redirect: {
          destination: '/404',
        },
      })
    })

    test('returns correct study and evaluations when all requests are successful', async () => {
      const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: mockStudyId } })
      getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
      prismaMock.$transaction.mockResolvedValueOnce([mockStudyWithRelations])
      mockedGetAxios.mockResolvedValueOnce({ data: { StatusCode: 200, Result: mockCPMSStudy } })
      prismaMock.study.update.mockResolvedValueOnce(mockStudyWithRelations)
      mockSetStudyAssessmentDue.mockResolvedValueOnce({ count: 0 })
      prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce(mappedCPMSStudyEvals[0])
      prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce(mappedCPMSStudyEvals[1])
      prismaMock.studyUpdates.groupBy.mockResolvedValueOnce([])
      prismaMock.studyUpdates.findMany.mockResolvedValueOnce([])
      prismaMock.studyUpdates.findMany.mockResolvedValueOnce([])

      const result = await getServerSideProps(context)
      expect(result).toEqual({
        props: {
          user: userWithSponsorContactRole.user,
          assessments: [mockMappedAssessment],
          study: {
            ...mockStudyWithRelations,
            evaluationCategories: mappedCPMSStudyEvals,
            organisationsByRole,
          },
          editHistory: getMockEditHistoryFromCPMS([false, false]),
        },
      })

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
      expect(prismaMock.study.update).toHaveBeenCalledTimes(1)
      expect(prismaMock.studyEvaluationCategory.upsert).toHaveBeenCalledTimes(2)
      expect(mockedGetAxios).toHaveBeenCalledTimes(1)
    })

    test('when request to CPMS fails, should not update study in SE and return correct data', async () => {
      const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: mockStudyId } })
      getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
      prismaMock.$transaction.mockResolvedValueOnce([mockStudyWithRelations])
      mockedGetAxios.mockRejectedValueOnce(new Error('Oh no, an error!'))

      const result = await getServerSideProps(context)
      expect(result).toEqual({
        props: {
          user: userWithSponsorContactRole.user,
          assessments: [mockMappedAssessment],
          study: {
            ...mockStudyWithRelations,
            organisationsByRole,
          },
        },
      })

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
      expect(mockedGetAxios).toHaveBeenCalledTimes(1)
      expect(prismaMock.study.update).not.toHaveBeenCalled()
      expect(prismaMock.studyEvaluationCategory.upsert).not.toHaveBeenCalled()
    })

    test('when request to update study fails, should fallback to SE data and return the correct study evals', async () => {
      const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: mockStudyId } })
      getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
      prismaMock.$transaction.mockResolvedValueOnce([mockStudyWithRelations])
      mockedGetAxios.mockResolvedValueOnce({ data: { StatusCode: 200, Result: mockCPMSStudy } })
      prismaMock.study.update.mockRejectedValueOnce(new Error('Oh no, an error!'))

      const result = await getServerSideProps(context)
      expect(result).toEqual({
        props: {
          user: userWithSponsorContactRole.user,
          assessments: [mockMappedAssessment],
          study: {
            ...mockStudyWithRelations,
            organisationsByRole,
          },
        },
      })

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
      expect(mockedGetAxios).toHaveBeenCalledTimes(1)
      expect(prismaMock.study.update).toHaveBeenCalledTimes(1)
      expect(prismaMock.studyEvaluationCategory.upsert).not.toHaveBeenCalled()
    })

    test('when request to update study evals fails, should return the updated study and correct study evals', async () => {
      const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: mockStudyId } })
      getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
      prismaMock.$transaction.mockResolvedValueOnce([mockStudyWithRelations])
      mockedGetAxios.mockResolvedValueOnce({ data: { StatusCode: 200, Result: mockCPMSStudy } })
      prismaMock.study.update.mockResolvedValueOnce(mockStudyWithRelations)
      mockSetStudyAssessmentDue.mockResolvedValueOnce({ count: 0 })
      prismaMock.studyEvaluationCategory.upsert.mockRejectedValueOnce(new Error('Oh no, an error!'))
      prismaMock.studyUpdates.groupBy.mockResolvedValueOnce([])
      prismaMock.studyUpdates.findMany.mockResolvedValueOnce([])
      prismaMock.studyUpdates.findMany.mockResolvedValueOnce([])

      const result = await getServerSideProps(context)

      expect(result).toEqual({
        props: {
          user: userWithSponsorContactRole.user,
          assessments: [mockMappedAssessment],
          study: {
            ...mockStudyWithRelations,
            organisationsByRole,
          },
          editHistory: getMockEditHistoryFromCPMS([false, false]),
        },
      })

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
      expect(mockedGetAxios).toHaveBeenCalledTimes(1)
      expect(prismaMock.study.update).toHaveBeenCalledTimes(1)
      expect(prismaMock.studyEvaluationCategory.upsert).toHaveBeenCalledTimes(2)
    })

    test('when request to set study assessment flag fails, it should not throw a 500 and return correct study', async () => {
      const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: mockStudyId } })
      getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
      prismaMock.$transaction.mockResolvedValueOnce([mockStudyWithRelations])
      mockedGetAxios.mockResolvedValueOnce({ data: { StatusCode: 200, Result: mockCPMSStudy } })
      prismaMock.study.update.mockResolvedValueOnce(mockStudyWithRelations)
      mockSetStudyAssessmentDue.mockRejectedValueOnce({})
      prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce(mappedCPMSStudyEvals[0])
      prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce(mappedCPMSStudyEvals[1])
      prismaMock.studyUpdates.groupBy.mockResolvedValueOnce([])
      prismaMock.studyUpdates.findMany.mockResolvedValueOnce([])
      prismaMock.studyUpdates.findMany.mockResolvedValueOnce([])

      const result = await getServerSideProps(context)
      expect(result).toEqual({
        props: {
          user: userWithSponsorContactRole.user,
          assessments: [mockMappedAssessment],
          study: {
            ...mockStudyWithRelations,
            evaluationCategories: mappedCPMSStudyEvals,
            organisationsByRole,
          },
          editHistory: getMockEditHistoryFromCPMS([false, false]),
        },
      })

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
      expect(prismaMock.study.update).toHaveBeenCalledTimes(1)
      expect(mockSetStudyAssessmentDue).toHaveBeenCalledTimes(1)
      expect(prismaMock.studyEvaluationCategory.upsert).toHaveBeenCalledTimes(2)
      expect(mockedGetAxios).toHaveBeenCalledTimes(1)
    })

    test('when study is due for assessment, should return study with the correct flag', async () => {
      const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: mockStudyId } })
      getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
      prismaMock.$transaction.mockResolvedValueOnce([mockStudyWithRelations])
      mockedGetAxios.mockResolvedValueOnce({ data: { StatusCode: 200, Result: mockCPMSStudy } })
      prismaMock.study.update.mockResolvedValueOnce(mockStudyWithRelations)
      mockSetStudyAssessmentDue.mockResolvedValueOnce({ count: 1 })
      prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce(mappedCPMSStudyEvals[0])
      prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce(mappedCPMSStudyEvals[1])
      prismaMock.studyUpdates.groupBy.mockResolvedValueOnce([])
      prismaMock.studyUpdates.findMany.mockResolvedValueOnce([])
      prismaMock.studyUpdates.findMany.mockResolvedValueOnce([])

      const result = await getServerSideProps(context)
      expect(result).toEqual({
        props: {
          user: userWithSponsorContactRole.user,
          assessments: [mockMappedAssessment],
          study: {
            ...mockStudyWithRelations,
            evaluationCategories: mappedCPMSStudyEvals,
            organisationsByRole,
            isDueAssessment: true,
          },
          editHistory: getMockEditHistoryFromCPMS([false, false]),
        },
      })

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
      expect(prismaMock.study.update).toHaveBeenCalledTimes(1)
      expect(prismaMock.studyEvaluationCategory.upsert).toHaveBeenCalledTimes(2)
      expect(mockedGetAxios).toHaveBeenCalledTimes(1)
    })
  })

  describe('Study page', () => {
    test('Default layout', async () => {
      await renderPage()

      // SEO
      expect(NextSeo).toHaveBeenCalledWith({ title: `Study Progress Review - ${mockStudy.shortTitle}` }, {})

      // Title
      expect(
        screen.getByRole('heading', { level: 2, name: `Study short title: ${mockStudy.shortTitle}` })
      ).toBeInTheDocument()

      // Organisation
      expect(screen.getByText(mockStudy.organisations[0].organisation.name, { selector: 'span' })).toBeInTheDocument()

      // Assess study
      expect(screen.getByRole('link', { name: 'Assess study' })).toHaveProperty(
        'href',
        `http://localhost/assessments/${mockStudy.id}`
      )

      // Edit study data
      expect(screen.getByRole('link', { name: 'Edit study data' })).toHaveProperty(
        'href',
        `http://localhost/studies/${mockStudy.id}/edit`
      )
      expect(screen.queryByText('Due')).not.toBeInTheDocument()

      expect(screen.getByText(/Check the study data and provide updates where necessary./)).toBeInTheDocument()

      // Summary of study’s progress (UK)
      expect(screen.getByRole('heading', { name: 'Summary of study’s progress (UK)', level: 3 })).toBeInTheDocument()
      expect(screen.getByText(/Based on the latest data uploaded to CPMS by the study team./)).toBeInTheDocument()

      const progressSummaryTable = screen.getByRole('table', { name: 'Summary of study’s progress (UK)' })

      const progressHeaders = within(progressSummaryTable).getAllByRole('rowheader')
      expect(progressHeaders.map((header) => header.textContent)).toEqual([
        'Study Status',
        'Study data indicates',
        'Planned opening date',
        'Actual opening date',
        'Planned closure to recruitment date',
        'Actual closure to recruitment date',
        'Estimated reopening date',
        'UK recruitment target (excluding private sites)',
        'Total UK recruitment to date (excluding private sites)',
      ])

      const progressRows = within(progressSummaryTable).getAllByRole('row')
      expect(progressRows.map((row) => within(row).getByRole('cell').textContent)).toEqual([
        mockStudy.studyStatus,
        `${mappedCPMSStudyEvals[0].indicatorValue}, ${mappedCPMSStudyEvals[1].indicatorValue}`,
        '1 January 2001',
        '1 January 2001',
        '2 January 2001',
        '1 January 2001',
        '28 February 2003',
        `${mockStudy.sampleSize}`,
        `${mockStudy.totalRecruitmentToDate}`,
      ])

      // Sponsor assessment history
      expect(screen.getByRole('heading', { name: 'Sponsor assessment history', level: 3 })).toBeInTheDocument()

      // About this study
      expect(screen.getByRole('heading', { name: 'About this study', level: 3 })).toBeInTheDocument()
      expect(
        screen.getByRole('button', {
          name: '1 January 2001 Off track assessed by mockeduser@nihr.ac.uk',
          expanded: true,
        })
      ).toBeInTheDocument()

      const aboutStudyTable = screen.getByRole('table', { name: 'About this study' })

      const aboutHeaders = within(aboutStudyTable).getAllByRole('rowheader')
      expect(aboutHeaders.map((header) => header.textContent)).toEqual([
        'Study full title',
        'Protocol reference number',
        'IRAS ID',
        'CPMS ID',
        'Sponsor',
        'Managing specialty',
        'Chief investigator',
      ])

      const aboutRows = within(aboutStudyTable).getAllByRole('row')
      expect(aboutRows.map((row) => within(row).getByRole('cell').textContent)).toEqual([
        mockStudy.title,
        mockStudy.protocolReferenceNumber,
        mockStudy.irasId,
        mockStudy.cpmsId.toString(),
        mockStudy.organisations[0].organisation.name,
        mockStudy.managingSpeciality,
        `${mockStudy.chiefInvestigatorFirstName} ${mockStudy.chiefInvestigatorLastName}`,
      ])

      // Support
      expect(screen.getByRole('heading', { level: 3, name: 'Request NIHR RDN support' })).toBeInTheDocument()
      expect(
        screen.getByText(
          'Sponsors or their delegates can request NIHR RDN support with their research study at any time.'
        )
      ).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Request support' })).toHaveAttribute(
        'href',
        `${SUPPORT_PAGE}?returnPath=/study/123`
      )
    })

    test('Due assessment', async () => {
      await renderPage(undefined, undefined, undefined, mockStudy, undefined, true)

      expect(screen.getByText('Due')).toBeInTheDocument()
      expect(screen.getByText('This study needs a new sponsor assessment.')).toBeInTheDocument()
    })

    test('No previous assessments', async () => {
      await renderPage({ ...mockStudy, assessments: [] })

      expect(screen.getByRole('heading', { level: 3, name: 'Sponsor assessment history' })).toBeInTheDocument()

      expect(
        screen.queryByRole('button', {
          name: '1 January 2001 Off track assessed by mockeduser@nihr.ac.uk',
        })
      ).not.toBeInTheDocument()

      expect(screen.getByText('This study has not had any assessments provided')).toBeInTheDocument()
    })

    test('No evaluation categories', async () => {
      await renderPage(undefined, undefined, { ...mockCPMSStudy, StudyEvaluationCategories: [] })

      expect(screen.getByText('This study is progressing as planned')).toBeInTheDocument()
    })

    test('Suspended study with no estimated reopen date', async () => {
      await renderPage(
        undefined,
        undefined,
        undefined,
        {
          ...mockStudy,
          evaluationCategories: [],
        },
        [{ ...mappedCPMSStudyEvals[0], expectedReopenDate: null }, mappedCPMSStudyEvals[1]]
      )

      const summaryTable = screen.getByRole('table', { name: 'Summary of study’s progress (UK)' })

      const rowHeader = within(summaryTable).getByRole('rowheader', { name: 'Estimated reopening date' })
      expect(rowHeader).toBeInTheDocument()
      expect(rowHeader.nextSibling).toHaveTextContent('-')
    })
  })

  describe('Sponsor assessment history accordion', () => {
    test('Defaults the first item open', async () => {
      await renderPage()

      expect(
        screen.getByRole('button', {
          name: '1 January 2001 Off track assessed by mockeduser@nihr.ac.uk',
          expanded: true,
        })
      )

      expect(
        screen.getByRole('region', {
          name: '1 January 2001 Off track assessed by mockeduser@nihr.ac.uk',
        })
      ).toHaveAttribute('data-state', 'open')
    })

    test('Collapsing & re-expanding the first item', async () => {
      await renderPage()

      // Collapse accordion
      await userEvent.click(
        screen.getByRole('button', {
          name: '1 January 2001 Off track assessed by mockeduser@nihr.ac.uk',
          expanded: true,
        })
      )

      expect(
        screen.getByRole('button', {
          name: '1 January 2001 Off track assessed by mockeduser@nihr.ac.uk',
          expanded: false,
        })
      ).toBeInTheDocument()

      expect(
        screen.queryByRole('region', {
          name: '1 January 2001 Off track assessed by mockeduser@nihr.ac.uk',
        })
      ).not.toBeInTheDocument()

      // Expand accordion
      await userEvent.click(
        screen.getByRole('button', {
          name: '1 January 2001 Off track assessed by mockeduser@nihr.ac.uk',
          expanded: false,
        })
      )

      expect(
        screen.getByRole('region', {
          name: '1 January 2001 Off track assessed by mockeduser@nihr.ac.uk',
        })
      ).toHaveAttribute('data-state', 'open')

      const list = screen.getByRole('list', { name: 'Further information' })
      expect(within(list).getAllByRole('listitem')).toHaveLength(3)
      expect(within(list).getByText('Mocked list item 1')).toBeInTheDocument()
      expect(within(list).getByText('Mocked list item 2')).toBeInTheDocument()
      expect(within(list).getByText('Mocked list item 3')).toBeInTheDocument()

      expect(screen.getByText('Testing some further information')).toBeInTheDocument()
    })
  })

  describe('Study edit history accordion', () => {
    test('Displays the correct deatils for edit history', async () => {
      await renderPage()

      const viewEditHistory = screen.getByRole('group')
      expect(within(viewEditHistory).getByText('View edit history')).toBeInTheDocument()
      expect(viewEditHistory).toBeInTheDocument()

      await userEvent.click(viewEditHistory)

      expect(
        within(viewEditHistory).getByTestId(`edit-history-accordion-item-${mockStudyUpdates[0].transactionId}`)
      ).toBeInTheDocument()
      expect(
        within(viewEditHistory).getByTestId(`edit-history-accordion-item-${mockCPMSStudy.ChangeHistory[0].LSN}`)
      ).toBeInTheDocument()
      expect(
        within(viewEditHistory).getByTestId(`edit-history-accordion-item-${mockCPMSStudy.ChangeHistory[1].LSN}`)
      ).toBeInTheDocument()
      expect(
        within(viewEditHistory).getByTestId(`edit-history-accordion-item-${mockCPMSStudy.ChangeHistory[2].LSN}`)
      ).toBeInTheDocument()
    })

    test('When query contains a latestProposedUpdate query, should open the corresponding item', async () => {
      await renderPage(undefined, `?latestProposedUpdate=${mockStudyUpdates[0].transactionId}`)

      const accordionItem = screen.getByTestId(`edit-history-accordion-item-${mockStudyUpdates[0].transactionId}`)
      expect(accordionItem).toBeInTheDocument()
      expect(accordionItem).toHaveAttribute('data-state', 'open')
    })
  })

  describe('Success banner', () => {
    test.each([
      ['1', 'The study assessment was successfully saved'],
      [
        '2',
        'Your study data changes have been received. These will now be reviewed and applied to the study record. Until then, previous study data values will be displayed.',
      ],
      ['3', 'Your study data changes have been accepted.'],
    ])(
      'should show the correct success message when success type is %s',
      async (successType: string, successMessage: string) => {
        await renderPage(undefined, `?success=${successType}`)

        const banner = screen.getByRole('alert', { name: 'Success' })
        expect(within(banner).getByText(successMessage)).toBeInTheDocument()

        if (successType === '1') {
          expect(within(banner).getByRole('link', { name: 'NIHR RDN support' })).toHaveAttribute('href', SUPPORT_PAGE)
          expect(within(banner).getByRole('link', { name: 'NIHR RDN support' }).parentElement).toHaveTextContent(
            'Request NIHR RDN support for this study.'
          )
        }
      }
    )
  })
})
