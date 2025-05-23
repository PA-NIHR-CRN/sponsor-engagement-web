import { simpleFaker } from '@faker-js/faker'
import type { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'
import mockRouter from 'next-router-mock'
import { NextSeo } from 'next-seo'
import { Mock } from 'ts-mockery'

import { render, screen, within } from '@/config/TestUtils'
import { getNotificationBanner } from '@/lib/contentful/contentfulService'

import { prismaMock } from '../__mocks__/prisma'
import { userNoOrgs, userWithContactManagerRole, userWithSponsorContactRole } from '../__mocks__/session'
import { SIGN_IN_PAGE, SUPPORT_PAGE } from '../constants/routes'
import type { StudiesProps } from '../pages/studies'
import Studies, { getServerSideProps } from '../pages/studies'

jest.mock('next-auth/next')
jest.mock('next-seo')
jest.mock('contentful')

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

  test('redirects back to the homepage for users without sponsor contact role', async () => {
    getServerSessionMock.mockResolvedValueOnce(userWithContactManagerRole)

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: '/',
      },
    })
  })

  test('redirects back to the homepage for users without any assigned organisations', async () => {
    getServerSessionMock.mockResolvedValueOnce(userNoOrgs)

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: '/',
      },
    })
  })
})

const mockStudies = Array.from(Array(15)).map((_, index) => ({
  id: index === 0 ? 'mocked-id' : simpleFaker.number.int(),
  shortTitle: 'Test Study',
  dueAssessmentAt: index === 0 ? new Date('2001-01-01') : null,
  organisations: [
    {
      organisation: {
        id: simpleFaker.number.int(),
        name: 'Test Clinical Research Sponsor',
      },
      organisationRole: {
        id: simpleFaker.number.int(),
        name: 'Clinical Research Sponsor',
      },
    },
    {
      organisation: {
        id: simpleFaker.number.int(),
        name: 'Test Contract Research Organisation',
      },
      organisationRole: {
        id: simpleFaker.number.int(),
        name: 'Contract Research Organisation',
      },
    },
  ],
  evaluationCategories: [
    {
      indicatorType: 'Milestone missed',
      updatedAt: new Date('2001-01-01'),
      createdAt: new Date('2001-01-01'),
    },
    {
      indicatorType: 'Recruitment concerns',
      updatedAt: new Date('2001-01-01'),
      createdAt: new Date('2001-01-01'),
    },
    {
      indicatorType: 'Milestone missed',
      updatedAt: new Date('2001-01-01'),
      createdAt: new Date('2001-01-01'),
    },
  ],
  lastAssessment: {
    status: { name: 'Off Track' },
    updatedAt: new Date('2001-01-02'),
    createdAt: new Date('2001-01-01'),
  },
}))

describe('Studies page', () => {
  jest.mocked(getServerSession).mockResolvedValue(userWithSponsorContactRole)
  jest.mocked(getNotificationBanner)

  test('Default layout', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2001-01-05'))
    prismaMock.$transaction.mockResolvedValueOnce([mockStudies, mockStudies.length, 3])

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: {} })

    const { props } = (await getServerSideProps(context)) as {
      props: StudiesProps
    }
    render(Studies.getLayout(<Studies {...props} />, { ...props }))

    // SEO
    expect(NextSeo).toHaveBeenCalledWith(
      { title: `Study Progress Review - Search results (${mockStudies.length} studies, page 1 of 2)` },
      {}
    )

    // Title
    expect(screen.getByRole('heading', { level: 2, name: 'Assess progress of studies' })).toBeInTheDocument()

    // Total studies needing assessment
    expect(screen.getByText(`There are 3 studies to assess`)).toBeInTheDocument()

    // Description
    expect(
      screen.getByText(
        'Review study data and provide data updates where necessary. You will also be able to assess if studies are on or off track, and decide if any NIHR RDN support is needed.'
      )
    ).toBeInTheDocument()

    // Hint collapsible
    expect(screen.getByText('Why am I being asked to assess studies?')).toBeInTheDocument()
    expect(
      screen.getByText(
        'NIHR RDN asks sponsors or their delegates to review and assess study progress for UK studies when:'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('A study falls behind the agreed milestones in the UK or')).toBeInTheDocument()
    expect(screen.getByText('A study is not recruiting to target in the UK')).toBeInTheDocument()
    expect(screen.getByText('the last progress assessment from the sponsor is over 3 months old')).toBeInTheDocument()

    // Support
    expect(screen.getByRole('heading', { level: 3, name: 'Request NIHR RDN support' })).toBeInTheDocument()
    expect(
      screen.getByText(
        'Sponsors or their delegates can request NIHR RDN support with their research study at any time. Click into your study for study level support guidance.'
      )
    ).toBeInTheDocument()

    // Export Study Data
    expect(screen.getByRole('heading', { level: 3, name: 'Download study data' })).toBeInTheDocument()
    expect(
      screen.getByText(
        'This download is a snapshot of all the information held within the Sponsor Engagement Tool for the sponsor/delegate organisation.'
      )
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: 'Download a snapshot of all the information held within the Sponsor Engagement Tool for the sponsor/delegate organisation',
      })
    ).toHaveAttribute('href', '/api/export')

    // Study results title
    expect(screen.getByText(`${mockStudies.length} studies found (3 due for assessment)`)).toBeInTheDocument()

    // Sort
    expect(screen.getByRole('combobox', { name: 'Sort by' })).toBeInTheDocument()
    expect(screen.getByRole<HTMLOptionElement>('option', { name: 'Due assessment' }).selected).toBe(true)

    // Study results list
    const studies = within(screen.getByRole('list', { name: 'Studies' })).getAllByRole('listitem')

    expect(studies).toHaveLength(mockStudies.length)

    const withinFirstStudy = within(studies[0])
    const withinSecondStudy = within(studies[1])

    // Study title
    expect(withinFirstStudy.getByText('Test Study')).toBeInTheDocument()

    // Study organisation
    expect(
      withinFirstStudy.getByText('Test Clinical Research Sponsor (Test Contract Research Organisation)')
    ).toBeInTheDocument()

    // Study due assessment
    expect(withinFirstStudy.getByText('Due for 4 days')).toBeInTheDocument()
    expect(withinSecondStudy.queryByText(/Due/)).not.toBeInTheDocument()

    // Study indicators
    expect(withinFirstStudy.getByText('Milestone missed, Recruitment concerns')).toBeInTheDocument()

    // Study assessment status
    expect(withinFirstStudy.getByText('Off Track on 1 January 2001')).toBeInTheDocument()

    // Study assessment CTA
    const shortTitle = mockStudies[0].shortTitle
    expect(withinFirstStudy.getByRole('link', { name: `View study ${shortTitle}` })).toHaveAttribute(
      'href',
      '/studies/mocked-id'
    )

    // Pagination
    const pagination = screen.getByRole('navigation', { name: 'results' })
    expect(pagination).toBeInTheDocument()
    expect(within(pagination).queryByRole('link', { name: 'Previous' })).not.toBeInTheDocument()
    expect(within(pagination).getByRole('link', { name: 'Page 1' })).toHaveAttribute('href', '/?page=1')
    expect(within(pagination).getByRole('link', { name: 'Page 2' })).toHaveAttribute('href', '/?page=2')
    expect(within(pagination).getByRole('link', { name: 'Next page' })).toHaveAttribute('href', '/?page=2')

    jest.useRealTimers()
  })

  test('No studies found', async () => {
    prismaMock.$transaction.mockResolvedValueOnce([[], 0, 0])

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: {} })

    const { props } = (await getServerSideProps(context)) as {
      props: StudiesProps
    }

    render(Studies.getLayout(<Studies {...props} />, { ...props }))

    // SEO
    expect(NextSeo).toHaveBeenCalledWith(
      {
        title: `Study Progress Review - Search results (no matching search results)`,
      },
      {}
    )

    // Study results title
    expect(screen.getByText(`0 studies found (0 due for assessment)`)).toBeInTheDocument()

    // Show message instead of the table
    expect(screen.getByText('No studies found')).toBeInTheDocument()

    // Hide pagination
    const pagination = screen.queryByRole('navigation', { name: 'results' })
    expect(pagination).not.toBeInTheDocument()
  })

  test('Changing page', async () => {
    prismaMock.$transaction.mockResolvedValueOnce([mockStudies, mockStudies.length, 3])

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { page: '2' } })

    const { props } = (await getServerSideProps(context)) as {
      props: StudiesProps
    }

    render(Studies.getLayout(<Studies {...props} />, { ...props }))

    // SEO
    expect(NextSeo).toHaveBeenCalledWith(
      { title: `Study Progress Review - Search results (${mockStudies.length} studies, page 2 of 2)` },
      {}
    )
  })

  test('Success banner shows after redirection from the assessment form', async () => {
    prismaMock.$transaction.mockResolvedValueOnce([mockStudies, mockStudies.length, 3])

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: {} })

    const { props } = (await getServerSideProps(context)) as {
      props: StudiesProps
    }

    await mockRouter.push('?success=1')

    render(Studies.getLayout(<Studies {...props} />, { ...props }))

    // Title
    expect(screen.getByRole('heading', { level: 2, name: 'Assess progress of studies' })).toBeInTheDocument()

    // Banner
    const banner = screen.getByRole('alert', { name: 'Success' })
    expect(within(banner).getByText('The study assessment was successfully saved')).toBeInTheDocument()
    expect(within(banner).getByRole('link', { name: 'NIHR RDN support' })).toHaveAttribute('href', SUPPORT_PAGE)
    expect(within(banner).getByRole('link', { name: 'NIHR RDN support' }).parentElement).toHaveTextContent(
      'Request NIHR RDN support for this study.'
    )
  })

  test('Selected filters', async () => {
    prismaMock.$transaction.mockResolvedValueOnce([mockStudies, mockStudies.length, 3])

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { q: 'test search' } })

    const { props } = (await getServerSideProps(context)) as {
      props: StudiesProps
    }

    await mockRouter.push('')

    render(Studies.getLayout(<Studies {...props} />, { ...props }))

    expect(screen.getByLabelText('Search study title, protocol number, IRAS ID or CPMS ID')).toHaveValue('test search')

    expect(screen.getByText('Selected filters')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Clear filter: test search' })).toHaveAttribute('href', '/')

    expect(screen.getByRole('link', { name: 'Clear all filters' })).toHaveAttribute('href', '/')
  })
})
