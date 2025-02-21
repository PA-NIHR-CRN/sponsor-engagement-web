import { simpleFaker } from '@faker-js/faker'
import type { Prisma } from 'database'
import type { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'
import { NextSeo } from 'next-seo'
import { Mock } from 'ts-mockery'

import { render, screen, within } from '@/config/TestUtils'

import { prismaMock } from '../__mocks__/prisma'
import { userNoRoles, userWithContactManagerRole } from '../__mocks__/session'
import { SIGN_IN_PAGE } from '../constants/routes'
import type { OrganisationsProps } from '../pages/organisations'
import Organisations, { getServerSideProps } from '../pages/organisations'

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

type OrganisationWithRelations = Prisma.OrganisationGetPayload<{ include: { roles: { select: { role: true } } } }>[]

const mockOrganisations = Mock.of<OrganisationWithRelations>([
  {
    id: 1,
    name: `Org name 1`,
    roles: [
      {
        role: {
          name: 'Clinical Research Sponsor',
        },
      },
    ],
  },
  {
    id: 2,
    name: `Org name 2`,
    roles: [
      {
        role: {
          name: 'Contract Research Organisation',
        },
      },
    ],
  },
  {
    id: 3,
    name: `Org name 3`,
    roles: [
      {
        role: {
          name: 'Managing Clinical Trials Unit',
        },
      },
    ],
  },
])

describe('Organisations page', () => {
  jest.mocked(getServerSession).mockResolvedValue(userWithContactManagerRole)

  test('Default layout', async () => {
    prismaMock.$transaction.mockResolvedValueOnce([mockOrganisations, mockOrganisations.length])

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: {} })

    const { props } = (await getServerSideProps(context)) as {
      props: OrganisationsProps
    }
    render(Organisations.getLayout(<Organisations {...props} />, { ...props }))

    // SEO
    expect(NextSeo).toHaveBeenCalledWith(
      { title: `Sponsor organisations - Search results (${mockOrganisations.length} organisations, page 1 of 1)` },
      {}
    )

    // Title
    expect(screen.getByRole('heading', { level: 2, name: 'Manage sponsor contacts' })).toBeInTheDocument()

    // Description
    expect(screen.getByText('Add and remove contacts for sponsor organisations.')).toBeInTheDocument()

    // Study results title
    expect(screen.getByText(`${mockOrganisations.length} organisations found`)).toBeInTheDocument()

    // Sort (not available for orgs page)
    expect(screen.queryByRole('combobox', { name: 'Sort by' })).not.toBeInTheDocument()

    // Results
    const table = screen.getByRole('table', { name: 'Manage sponsor organisations' })
    expect(table).toBeInTheDocument()

    const headers = within(table).getAllByRole('columnheader')
    expect(headers.map((header) => header.textContent)).toEqual(['Organisation', 'Action'])

    const rows = within(table).getAllByRole('row')

    // This looks funny because the formatting that GDS visually-hidden applies is stripped out
    expect(rows.map((row) => row.firstChild?.textContent)).toEqual([
      'Organisation',
      'Organisation name:Org name 1Organisation role:Sponsor',
      'Organisation name:Org name 2Organisation role:CRO',
      'Organisation name:Org name 3Organisation role:CTU',
    ])

    expect(rows.map((row) => row.lastChild?.textContent)).toEqual([
      'Action',
      'Manage Org name 1 sponsor contacts',
      'Manage Org name 2 sponsor contacts',
      'Manage Org name 3 sponsor contacts',
    ])

    // No pagination when orgs is less than 50
    const pagination = screen.queryByRole('navigation', { name: 'results' })
    expect(pagination).not.toBeInTheDocument()
  })

  test('No organisations found', async () => {
    const mockOrganisationsEmpty = Mock.of<OrganisationWithRelations>([])

    prismaMock.$transaction.mockResolvedValueOnce([mockOrganisationsEmpty, mockOrganisationsEmpty.length])

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: {} })

    const { props } = (await getServerSideProps(context)) as {
      props: OrganisationsProps
    }
    render(Organisations.getLayout(<Organisations {...props} />, { ...props }))

    // SEO
    expect(NextSeo).toHaveBeenCalledWith(
      {
        title: `Sponsor organisations - Search results (no matching search results)`,
      },
      {}
    )

    // Study results title
    expect(screen.getByText(`${mockOrganisationsEmpty.length} organisations found`)).toBeInTheDocument()

    // Show message instead of the table
    expect(screen.getByText('No organisations found')).toBeInTheDocument()

    // Hide pagination
    const pagination = screen.queryByRole('navigation', { name: 'results' })
    expect(pagination).not.toBeInTheDocument()
  })

  test('Pagination', async () => {
    const mockOrganisationsPaginated = Mock.of<OrganisationWithRelations>(
      Array(70).map(() => ({
        id: simpleFaker.number.int(),
        name: simpleFaker.string.alphanumeric(),
        roles: [],
      }))
    )

    prismaMock.$transaction.mockResolvedValueOnce([mockOrganisationsPaginated, mockOrganisationsPaginated.length])

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { page: '2' } })

    const { props } = (await getServerSideProps(context)) as {
      props: OrganisationsProps
    }
    render(Organisations.getLayout(<Organisations {...props} />, { ...props }))

    // SEO
    expect(NextSeo).toHaveBeenCalledWith(
      {
        title: `Sponsor organisations - Search results (${mockOrganisationsPaginated.length} organisations, page 2 of 2)`,
      },
      {}
    )

    // Study results title
    expect(screen.getByText(`${mockOrganisationsPaginated.length} organisations found`)).toBeInTheDocument()

    // Pagination
    const pagination = screen.getByRole('navigation', { name: 'results' })
    expect(pagination).toBeInTheDocument()
    expect(within(pagination).queryByRole('link', { name: 'Previous' })).not.toBeInTheDocument()
    expect(within(pagination).getByRole('link', { name: 'Page 1' })).toHaveAttribute('href', '/?page=1')
    expect(within(pagination).getByRole('link', { name: 'Page 2' })).toHaveAttribute('href', '/?page=2')
    expect(within(pagination).getByRole('link', { name: 'Next page' })).toHaveAttribute('href', '/?page=2')
  })

  test('Multiple organisastion types (CRO, CTU, Sponsor etc)', async () => {
    const mockOrganisationsPaginated = Mock.of<OrganisationWithRelations>([
      {
        id: 1,
        name: 'Test Org',
        roles: [
          {
            role: {
              name: 'Clinical Research Sponsor',
            },
          },
          {
            role: {
              name: 'Managing Clinical Trials Unit',
            },
          },
        ],
      },
    ])

    prismaMock.$transaction.mockResolvedValueOnce([mockOrganisationsPaginated, mockOrganisationsPaginated.length])

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { page: '2' } })

    const { props } = (await getServerSideProps(context)) as {
      props: OrganisationsProps
    }
    render(Organisations.getLayout(<Organisations {...props} />, { ...props }))

    const table = within(screen.getByRole('table', { name: 'Manage sponsor organisations' }))
    expect(
      table.getByRole('row', {
        name: 'Organisation name: Test Org Organisation role: Sponsor, CTU Manage Test Org sponsor contacts',
      })
    ).toBeInTheDocument()
  })

  test('Selected filters', async () => {
    prismaMock.$transaction.mockResolvedValueOnce([mockOrganisations, mockOrganisations.length])

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { q: 'test search' } })

    const { props } = (await getServerSideProps(context)) as {
      props: OrganisationsProps
    }
    render(Organisations.getLayout(<Organisations {...props} />, { ...props }))

    expect(screen.getByLabelText('Search organisation name')).toHaveValue('test search')

    expect(screen.getByText('Selected filters')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Clear filter: test search' })).toHaveAttribute('href', '/')

    expect(screen.getByRole('link', { name: 'Clear all filters' })).toHaveAttribute('href', '/')
  })
})
