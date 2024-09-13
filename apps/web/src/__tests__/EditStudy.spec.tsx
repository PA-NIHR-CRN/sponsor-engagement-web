import axios from 'axios'
import type { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'
import mockRouter from 'next-router-mock'
import { Mock } from 'ts-mockery'

import { userWithSponsorContactRole } from '@/__mocks__/session'
import { render, screen, within } from '@/config/TestUtils'
import { SUPPORT_PAGE } from '@/constants/routes'
import { mockCPMSStudy, mockStudyWithRelations } from '@/mocks/studies'
import EditStudy, { type EditStudyProps, getServerSideProps } from '@/pages/studies/[studyId]/edit'

import { prismaMock } from '../__mocks__/prisma'

jest.mock('next-auth/next')
jest.mock('axios')
const mockedGetAxios = jest.mocked(axios.get)

const mockStudyId = mockStudyWithRelations.id.toString()
const mockStudy = {
  studyId: mockStudyId,
  shortStudyTitle: 'Study to test safety/efficacy of CIT treatment in NSCLC patients',
  sponsorOrgName: 'F. Hoffmann-La Roche Ltd (FORTREA DEVELOPMENT LIMITED)',
  studyRoute: 'Commercial',
}
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

describe('getServerSideProps', () => {
  const getServerSessionMock = jest.mocked(getServerSession)

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

  test('redirects to 404 page if no study found', async () => {
    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { study: mockStudyId } })
    getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
    prismaMock.$transaction.mockResolvedValueOnce([])

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: '/404',
      },
    })

    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
  })

  test('redirects to 404 if no cpmsId exists in returned study', async () => {
    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { study: mockStudyId } })
    getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
    prismaMock.$transaction.mockResolvedValueOnce([{ ...mockStudyWithRelations, cpmsId: undefined }])

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: '/404',
      },
    })

    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
  })

  test('redirects to 500 if no study found in CPMS', async () => {
    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { study: mockStudyId } })
    getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
    prismaMock.$transaction.mockResolvedValueOnce([mockStudyWithRelations])
    mockedGetAxios.mockResolvedValueOnce({ data: {} })

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: '/500',
      },
    })

    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
    expect(mockedGetAxios).toHaveBeenCalledTimes(1)
  })

  test('redirects to 500 if request to update study in SE fails', async () => {
    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { study: mockStudyId } })
    getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
    prismaMock.$transaction.mockResolvedValueOnce([mockStudyWithRelations])
    mockedGetAxios.mockResolvedValueOnce({ data: mockCPMSResponse })
    prismaMock.study.update.mockRejectedValueOnce(new Error('Oh no an error'))

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: '/500',
      },
    })

    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
    expect(prismaMock.study.update).toHaveBeenCalledTimes(1)
    expect(mockedGetAxios).toHaveBeenCalledTimes(1)
  })

  test('redirects to 500 if request fails to update study evaluations in SE', async () => {
    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { study: mockStudyId } })
    getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
    prismaMock.$transaction.mockResolvedValueOnce([mockStudyWithRelations])
    mockedGetAxios.mockResolvedValueOnce({ data: mockCPMSResponse })
    prismaMock.study.update.mockResolvedValueOnce(mockStudyWithRelations)
    prismaMock.studyEvaluationCategory.upsert.mockRejectedValueOnce(new Error('Oh no an error'))

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: '/500',
      },
    })

    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
    expect(prismaMock.study.update).toHaveBeenCalledTimes(1)
    expect(prismaMock.studyEvaluationCategory.upsert).toHaveBeenCalledTimes(2)
    expect(mockedGetAxios).toHaveBeenCalledTimes(1)
  })

  test('should return correct study and evaluations when all requests are successful', async () => {
    const mappedCPMSStudyEvals = [
      {
        id: 43343,
        studyId: Number(mockStudyId),
        indicatorType: 'Recruitment concerns',
        indicatorValue: 'Recruitment target met',
        sampleSize: 444,
        totalRecruitmentToDate: 683,
        plannedOpeningDate: new Date('2018-03-01T00:00:00'),
        plannedClosureDate: new Date('2025-03-31T00:00:00'),
        actualOpeningDate: new Date('2018-03-01T00:00:00'),
        actualClosureDate: new Date('2003-02-28T00:00:00'),
        expectedReopenDate: new Date('2003-02-28T00:00:00'),
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 32321,
        studyId: Number(mockStudyId),
        indicatorType: 'Recruitment concerns',
        indicatorValue: 'No recruitment in past 6 months',
        sampleSize: 444,
        totalRecruitmentToDate: 683,
        plannedOpeningDate: new Date('2018-03-01T00:00:00'),
        plannedClosureDate: new Date('2025-03-31T00:00:00'),
        actualOpeningDate: new Date('2018-03-01T00:00:00'),
        actualClosureDate: null,
        expectedReopenDate: null,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const organisationsByRole = {
      Sponsor: 'Test Organisation',
    }

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { study: mockStudyId } })
    getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
    prismaMock.$transaction.mockResolvedValueOnce([mockStudyWithRelations])
    mockedGetAxios.mockResolvedValueOnce({ data: mockCPMSResponse })
    prismaMock.study.update.mockResolvedValueOnce(mockStudyWithRelations)
    prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce(mappedCPMSStudyEvals[0])
    prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce(mappedCPMSStudyEvals[1])

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      props: {
        user: userWithSponsorContactRole.user,
        study: {
          ...mockStudyWithRelations,
          evaluationCategories: mappedCPMSStudyEvals,
          organisationsByRole,
        },
      },
    })

    expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
    expect(prismaMock.study.update).toHaveBeenCalledTimes(1)
    expect(prismaMock.studyEvaluationCategory.upsert).toHaveBeenCalledTimes(2)
    expect(mockedGetAxios).toHaveBeenCalledTimes(1)
  })
})

describe('Edit study page', () => {
  jest.mocked(getServerSession).mockResolvedValue(userWithSponsorContactRole)

  test('Default layout', async () => {
    await mockRouter.push('/studies/123')

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: mockStudyId } })

    const { props } = (await getServerSideProps(context)) as {
      props: EditStudyProps
    }

    render(EditStudy.getLayout(<EditStudy {...props} />, { ...props }))

    // Header title
    expect(screen.getByRole('heading', { level: 1, name: 'Update study data' })).toBeInTheDocument()

    // Page title
    expect(screen.getByRole('heading', { level: 2, name: 'Page title: Update study data' })).toBeInTheDocument()

    // Sponsor
    expect(screen.getByText(mockStudy.sponsorOrgName, { selector: 'span' })).toBeInTheDocument()

    // Study title
    expect(screen.getByText(mockStudy.shortStudyTitle, { selector: 'span' })).toBeInTheDocument()

    // Guidance text for Commercial
    expect(
      screen.getByText(
        'Changes to the study status, the key dates and recruitment targets will be communicated to RDN, where possible, your changes will update the study record automatically in CPMS, other changes might be subject to review by the RDN team.',
        { selector: 'div' }
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
      `${SUPPORT_PAGE}?returnPath=/studies/123`
    )

    // Form Input - Status
    const statusFieldset = screen.getByRole('radiogroup', { name: 'Study status' })
    expect(statusFieldset).toBeInTheDocument()

    // TODO: Why does accessible description for first element use parent label
    // expect(within(statusFieldset).getByLabelText('In setup')).toBeInTheDocument()
    // expect(within(statusFieldset).getByLabelText('In setup')).toHaveAccessibleDescription(
    //   'Not yet open to recruitment.'
    // )

    expect(within(statusFieldset).getByLabelText('Open to recruitment')).toBeInTheDocument()
    expect(within(statusFieldset).getByLabelText('Open to recruitment')).toHaveAccessibleDescription(
      'Ready (open) to recruit participants in at least one UK site. Provide an actual opening date below.'
    )

    expect(within(statusFieldset).getByLabelText('Closed, in follow-up')).toBeInTheDocument()
    expect(within(statusFieldset).getByLabelText('Closed, in follow-up')).toHaveAccessibleDescription(
      'Ongoing, (i.e. participants are being treated or observed), but recruitment is complete. Provide an actual closure date below.'
    )

    expect(within(statusFieldset).getByLabelText('Closed')).toBeInTheDocument()
    expect(within(statusFieldset).getByLabelText('Closed')).toHaveAccessibleDescription(
      'Completed recruitment and any subsequent patient related activities (follow up). Provide an actual closure date below.'
    )

    expect(within(statusFieldset).getByLabelText('Withdrawn')).toBeInTheDocument()
    expect(within(statusFieldset).getByLabelText('Withdrawn')).toHaveAccessibleDescription(
      'Withdrawn during the setup phase and will not be opening to recruitment in the UK.'
    )

    expect(within(statusFieldset).getByLabelText('Suspended')).toBeInTheDocument()
    expect(within(statusFieldset).getByLabelText('Suspended')).toHaveAccessibleDescription(
      'Recruitment of participants has halted, but may resume. Provide an estimated re-opening date below.'
    )

    // Form Input - Planned open recruitment date
    const plannedOpenDateFieldset = screen.getByRole('group', { name: 'Planned opening to recruitment date' })
    expect(plannedOpenDateFieldset).toBeInTheDocument()

    // Form Input - Actual open recruitment date
    const actualOpenDateFieldset = screen.getByRole('group', { name: 'Actual opening to recruitment date' })
    expect(actualOpenDateFieldset).toBeInTheDocument()

    // Form Input - Planned closing recruitment date
    const plannedClosingDateFieldset = screen.getByRole('group', { name: 'Planned closure to recruitment date' })
    expect(plannedClosingDateFieldset).toBeInTheDocument()

    // Form Input - Actual closing recruitment date
    const actualClosingDateFieldset = screen.getByRole('group', { name: 'Actual closure to recruitment date' })
    expect(actualClosingDateFieldset).toBeInTheDocument()

    // Form Input - UK Recruitment target
    const ukRecruitmentTarget = screen.getByLabelText('UK recruitment target')
    expect(ukRecruitmentTarget).toBeInTheDocument()
    expect(ukRecruitmentTarget).toHaveAccessibleDescription(
      'Changes to the UK recruitment target will be committed to CPMS after manual review.'
    )

    // Form Input - Further information
    const furtherInformation = screen.getByLabelText('Further information')
    expect(furtherInformation).toBeInTheDocument()
    expect(furtherInformation).toHaveAccessibleDescription(
      'You have 0 characters remaining If needed, provide further context or justification for changes made above.'
    )

    // Warning text
    const warningText = screen.getByText(
      'It may a few seconds for the CPMS record to update. Please stay on this page until redirected.'
    )
    expect(warningText).toBeInTheDocument()

    // Update CTA
    expect(screen.getByRole('button', { name: 'Update' })).toHaveAttribute('type', 'submit')

    // Cancel CTA
    expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute('href', `/studies/${mockStudyId}`)
  })
})

// TODO: Confirm behaviour when there are no evals in CPMS - should return empty array
