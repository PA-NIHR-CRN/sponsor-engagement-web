import type { GetServerSidePropsContext } from 'next'
import { Mock } from 'ts-mockery'
import { getServerSession } from 'next-auth/next'
import { render, screen, within } from '@testing-library/react'
import { NextSeo } from 'next-seo'
import type { Prisma } from 'database'
import { simpleFaker } from '@faker-js/faker'
import mockRouter from 'next-router-mock'
import userEvent from '@testing-library/user-event'
import type { StudyProps } from '../pages/studies/[studyId]'
import Study, { getServerSideProps } from '../pages/studies/[studyId]'
import { userNoRoles, userWithSponsorContactRole } from '../__mocks__/session'
import { SIGN_IN_PAGE } from '../constants/routes'
import { prismaMock } from '../__mocks__/prisma'

jest.mock('next-auth/next')
jest.mock('next-seo')

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

  test('redirects back to the homepage for users without any roles', async () => {
    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {} })
    getServerSessionMock.mockResolvedValueOnce(userNoRoles)

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
    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: '123' } })
    getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
    prismaMock.study.findFirst.mockResolvedValueOnce(null)

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
    title: true
    organisations: {
      include: {
        organisation: true
        organisationRole: true
      }
    }
    evaluationCategories: true
    funders: {
      include: {
        organisation: true
      }
    }
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

const mockStudy = Mock.of<StudyWithRelations>({
  id: 123,
  title: 'Test Study Long Title',
  shortTitle: 'Test Study Short Title',
  isDueAssessment: false,
  cpmsId: 1234567,
  studyStatus: 'Suspended',
  recordStatus: 'Test record status',
  route: 'Commercial',
  irasId: '12345',
  protocolReferenceNumber: '123',
  sampleSize: 1000,
  chiefInvestigatorFirstName: 'John',
  chiefInvestigatorLastName: 'Smith',
  managingSpeciality: '',
  plannedOpeningDate: new Date('2001-01-01'),
  plannedClosureDate: new Date('2001-01-01'),
  actualOpeningDate: new Date('2001-01-01'),
  actualClosureDate: new Date('2001-01-01'),
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
  funders: [
    {
      organisation: {
        name: 'Test Funder',
        id: 12345,
      },
      fundingStreamName: 'Test funding stream',
      grantCode: 'Test grant code',
    },
  ],
  evaluationCategories: [
    {
      indicatorValue: 'Milestone missed',
      updatedAt: new Date('2001-01-01'),
      createdAt: new Date('2001-01-01'),
      expectedReopenDate: new Date('2001-01-01'),
      totalRecruitmentToDate: 999,
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

describe('Study page', () => {
  jest.mocked(getServerSession).mockResolvedValue(userWithSponsorContactRole)

  test('Default layout', async () => {
    prismaMock.study.findFirst.mockResolvedValueOnce(mockStudy)

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: '123' } })

    const { props } = (await getServerSideProps(context)) as {
      props: StudyProps
    }

    render(Study.getLayout(<Study {...props} />, { ...props }))

    // SEO
    expect(NextSeo).toHaveBeenCalledWith({ title: `Study Progress Review - ${mockStudy.shortTitle}` }, {})

    // Title
    expect(screen.getByRole('heading', { level: 2, name: mockStudy.shortTitle })).toBeInTheDocument()

    // Organisation
    expect(screen.getByText('Test Organisation', { selector: 'span' })).toBeInTheDocument()

    // Assess study
    expect(screen.getByRole('link', { name: 'Assess' })).toHaveProperty(
      'href',
      `http://localhost/assessments/${mockStudy.id}`
    )

    expect(screen.queryByText('Due')).not.toBeInTheDocument()

    expect(screen.getByText(/You can review the progress of this study at any time./)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'NIHR CRN support' })).toHaveAttribute('href', '/')

    // Progress summary
    expect(screen.getByRole('heading', { name: 'Progress Summary', level: 3 })).toBeInTheDocument()
    expect(screen.getByText(/Based on the latest data uploaded to CPMS by the study team./)).toBeInTheDocument()

    const progressSummaryTable = screen.getByRole('table', { name: 'Progress summary' })

    const progressHeaders = within(progressSummaryTable).getAllByRole('rowheader')
    expect(progressHeaders.map((header) => header.textContent)).toEqual([
      'Study Status',
      'Study data indicates',
      'Planned opening date',
      'Actual opening date',
      'Planned closure to recruitment date',
      'Actual closure to recruitment date',
      'Estimated reopening date',
      'Network recruitment target',
      'Total network recruitment to date',
    ])

    const progressRows = within(progressSummaryTable).getAllByRole('row')
    expect(progressRows.map((row) => within(row).getByRole('cell').textContent)).toEqual([
      mockStudy.studyStatus,
      mockStudy.evaluationCategories[0].indicatorValue,
      '1 January 2001',
      '1 January 2001',
      '1 January 2001',
      '1 January 2001',
      '1 January 2001',
      `${mockStudy.sampleSize}`,
      `${mockStudy.evaluationCategories[0].totalRecruitmentToDate}`,
    ])

    // Sponsor assessment history
    expect(screen.getByRole('heading', { name: 'Sponsor assessment history', level: 3 })).toBeInTheDocument()

    // About this study
    expect(screen.getByRole('heading', { name: 'About this study', level: 3 })).toBeInTheDocument()
    expect(
      screen.getByRole('button', {
        name: '01 Jan 2001 Off track assessed by mockeduser@nihr.ac.uk',
        expanded: true,
      })
    ).toBeInTheDocument()

    const aboutStudyTable = screen.getByRole('table', { name: 'About this study' })

    const aboutHeaders = within(aboutStudyTable).getAllByRole('rowheader')
    expect(aboutHeaders.map((header) => header.textContent)).toEqual([
      'Study long title',
      'Study route',
      'Sponsor',
      'Sponsor protocol',
      'IRAS ID',
      'CPMS ID',
      'Managing specialty',
      'Chief investigator',
    ])

    const aboutRows = within(aboutStudyTable).getAllByRole('row')
    expect(aboutRows.map((row) => within(row).getByRole('cell').textContent)).toEqual([
      mockStudy.title,
      mockStudy.route,
      mockStudy.organisations[0].organisation.name,
      mockStudy.protocolReferenceNumber,
      mockStudy.irasId,
      `${mockStudy.cpmsId}`,
      mockStudy.managingSpeciality,
      `${mockStudy.chiefInvestigatorFirstName} ${mockStudy.chiefInvestigatorLastName}`,
    ])

    // Study funders
    const studyFundersTable = screen.getByRole('table', { name: 'Study funders' })

    const funderHeaders = within(studyFundersTable).getAllByRole('columnheader')
    expect(funderHeaders.map((header) => header.textContent)).toEqual(['Funder', 'Funding stream', 'Grant code'])

    const funderCells = within(studyFundersTable)
      .getAllByRole('cell')
      .map((cell) => cell.textContent)
    expect(funderCells).toEqual([
      mockStudy.funders[0].organisation.name,
      mockStudy.funders[0].fundingStreamName,
      mockStudy.funders[0].grantCode,
    ])

    // Support
    expect(screen.getByRole('heading', { level: 3, name: 'Get NIHR CRN support' })).toBeInTheDocument()
    expect(
      screen.getByText('Sponsors or their delegates can get NIHR CRN support with their research study at any time.')
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Get support' })).toHaveAttribute('href', '/')
  })

  test('Due assessment', async () => {
    prismaMock.study.findFirst.mockResolvedValueOnce({ ...mockStudy, isDueAssessment: true })

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: '123' } })

    const { props } = (await getServerSideProps(context)) as {
      props: StudyProps
    }

    render(Study.getLayout(<Study {...props} />, { ...props }))

    expect(screen.getByText('Due')).toBeInTheDocument()
    expect(screen.getByText('This study needs a new sponsor assessment.')).toBeInTheDocument()
  })

  test('No previous assessments', async () => {
    prismaMock.study.findFirst.mockResolvedValueOnce(Mock.of<StudyWithRelations>({ ...mockStudy, assessments: [] }))

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: '123' } })

    const { props } = (await getServerSideProps(context)) as {
      props: StudyProps
    }

    render(Study.getLayout(<Study {...props} />, { ...props }))

    expect(screen.getByRole('heading', { level: 3, name: 'Sponsor assessment history' })).toBeInTheDocument()

    expect(
      screen.queryByRole('button', {
        name: '01 Jan 2001 Off track assessed by mockeduser@nihr.ac.uk',
      })
    ).not.toBeInTheDocument()

    expect(screen.getByText('This study has not had any assessments provided')).toBeInTheDocument()
  })

  test('No evaluation categories', async () => {
    prismaMock.study.findFirst.mockResolvedValueOnce(
      Mock.of<StudyWithRelations>({ ...mockStudy, evaluationCategories: [] })
    )

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: '123' } })

    const { props } = (await getServerSideProps(context)) as {
      props: StudyProps
    }

    render(Study.getLayout(<Study {...props} />, { ...props }))

    expect(screen.getByText('This study is progressing as planned')).toBeInTheDocument()
  })

  test('Non-commercial study', async () => {
    prismaMock.study.findFirst.mockResolvedValueOnce({ ...mockStudy, route: 'Non-commercial' })

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: '123' } })

    const { props } = (await getServerSideProps(context)) as {
      props: StudyProps
    }

    render(Study.getLayout(<Study {...props} />, { ...props }))

    expect(screen.queryByText('Network recruitment target')).not.toBeInTheDocument()
    expect(screen.queryByText('Total network recruitment to date')).not.toBeInTheDocument()
    expect(screen.getByText('UK recruitment target')).toBeInTheDocument()
    expect(screen.getByText('Total UK recruitment to date')).toBeInTheDocument()
  })

  test('Success banner shows after redirection from the assessment form', async () => {
    prismaMock.study.findFirst.mockResolvedValueOnce(mockStudy)

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: '123' } })

    const { props } = (await getServerSideProps(context)) as {
      props: StudyProps
    }

    await mockRouter.push('?success=1')

    render(Study.getLayout(<Study {...props} />, { ...props }))

    // Title
    expect(screen.getByRole('heading', { level: 2, name: mockStudy.shortTitle })).toBeInTheDocument()

    // Banner
    const banner = screen.getByRole('alert', { name: 'Success' })
    expect(within(banner).getByText('The study assessment was successfully saved')).toBeInTheDocument()
    expect(within(banner).getByRole('link', { name: 'NIHR CRN support' })).toHaveAttribute('href', '/')
    expect(within(banner).getByRole('link', { name: 'NIHR CRN support' }).parentElement).toHaveTextContent(
      'Get NIHR CRN support for this study.'
    )
  })
})

describe('Sponsor assessment history accordion', () => {
  test('Defaults the first item open', async () => {
    prismaMock.study.findFirst.mockResolvedValueOnce(mockStudy)

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: '123' } })

    const { props } = (await getServerSideProps(context)) as {
      props: StudyProps
    }

    render(Study.getLayout(<Study {...props} />, { ...props }))

    expect(
      screen.getByRole('button', {
        name: '01 Jan 2001 Off track assessed by mockeduser@nihr.ac.uk',
        expanded: true,
      })
    )

    expect(
      screen.getByRole('region', {
        name: '01 Jan 2001 Off track assessed by mockeduser@nihr.ac.uk',
      })
    ).toHaveAttribute('data-state', 'open')
  })

  test('Collapsing & re-expanding the first item', async () => {
    prismaMock.study.findFirst.mockResolvedValueOnce(mockStudy)

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: '123' } })

    const { props } = (await getServerSideProps(context)) as {
      props: StudyProps
    }

    render(Study.getLayout(<Study {...props} />, { ...props }))

    // Collapse accordion
    await userEvent.click(
      screen.getByRole('button', {
        name: '01 Jan 2001 Off track assessed by mockeduser@nihr.ac.uk',
        expanded: true,
      })
    )

    expect(
      screen.getByRole('button', {
        name: '01 Jan 2001 Off track assessed by mockeduser@nihr.ac.uk',
        expanded: false,
      })
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('region', {
        name: '01 Jan 2001 Off track assessed by mockeduser@nihr.ac.uk',
      })
    ).not.toBeInTheDocument()

    // Expand accordion
    await userEvent.click(
      screen.getByRole('button', {
        name: '01 Jan 2001 Off track assessed by mockeduser@nihr.ac.uk',
        expanded: false,
      })
    )

    expect(
      screen.getByRole('region', {
        name: '01 Jan 2001 Off track assessed by mockeduser@nihr.ac.uk',
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
