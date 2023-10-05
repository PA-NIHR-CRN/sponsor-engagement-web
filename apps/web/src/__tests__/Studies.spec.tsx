import type { GetServerSidePropsContext } from 'next'
import { Mock } from 'ts-mockery'
import { getServerSession } from 'next-auth/next'
import { render, within, screen } from '@testing-library/react'
import { NextSeo } from 'next-seo'
import type { UserOrganisation } from 'database'
import { simpleFaker } from '@faker-js/faker'
import type { StudiesProps } from '../pages/studies'
import Studies, { getServerSideProps } from '../pages/studies'
import { userNoRoles, userWithSponsorContactRole } from '../__mocks__/session'
import { SIGN_IN_PAGE } from '../constants/routes'
import { prismaMock } from '../__mocks__/prisma'

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

describe('Studies page', () => {
  jest.mocked(getServerSession).mockResolvedValue(userWithSponsorContactRole)

  test('Default layout', async () => {
    prismaMock.userOrganisation.findMany.mockResolvedValueOnce([
      Mock.of<UserOrganisation>({ organisationId: simpleFaker.number.int() }),
    ])

    const mockStudies = Array.from(Array(15)).map((_, index) => ({
      id: simpleFaker.number.int(),
      name: 'Test Study',
      isDueAssessment: index === 0,
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
    }))

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
        'The NIHR CRN tracks the progress of research studies in its portfolio using data provided by study teams. Sponsors or their delegates need to assess if studies are on or off track and if any NIHR CRN support is needed.'
      )
    ).toBeInTheDocument()

    // Hint collapsible
    expect(screen.getByText('Why am I being asked to assess studies?')).toBeInTheDocument()
    expect(
      screen.getByText(
        'NIHR CRN asks sponsors or their delegates to review and assess study progress for UK sites when:'
      )
    ).toBeInTheDocument()
    expect(screen.getByText('A study falls behind the agreed milestones in the UK')).toBeInTheDocument()
    expect(screen.getByText('A study is not recruiting to target in the UK')).toBeInTheDocument()
    expect(screen.getByText('the last progress assessment from the sponsor is over 3 months old')).toBeInTheDocument()

    // Support
    expect(screen.getByRole('heading', { level: 3, name: 'Get NIHR CRN support' })).toBeInTheDocument()
    expect(
      screen.getByText('Sponsors or their delegates can get NIHR CRN support with their research study at any time.')
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Get support' })).toHaveAttribute('href', '/')

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
    expect(withinFirstStudy.getByText('Test Organisation')).toBeInTheDocument()

    // Study due assessment
    expect(withinFirstStudy.getByText('Due')).toBeInTheDocument()
    expect(withinSecondStudy.queryByText('Due')).not.toBeInTheDocument()

    // Study indicators
    expect(withinFirstStudy.getByText('Milestone missed')).toBeInTheDocument()

    // Study assessment status
    expect(withinFirstStudy.getByText('Off Track')).toBeInTheDocument()

    // Pagination
    const pagination = screen.getByRole('navigation', { name: 'results' })
    expect(pagination).toBeInTheDocument()
    expect(within(pagination).queryByRole('link', { name: 'Previous' })).not.toBeInTheDocument()
    expect(within(pagination).getByRole('link', { name: 'Page 1' })).toHaveAttribute('href', '/?page=1')
    expect(within(pagination).getByRole('link', { name: 'Page 2' })).toHaveAttribute('href', '/?page=2')
    expect(within(pagination).getByRole('link', { name: 'Next' })).toHaveAttribute('href', '/?page=2')
  })
})

// describe('Studies page searching', () => {})
// describe('Studies page filtering', () => {})
// describe('Studies page sorting', () => {})
