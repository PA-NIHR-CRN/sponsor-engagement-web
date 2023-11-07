import type { GetServerSidePropsContext } from 'next'
import { Mock } from 'ts-mockery'
import { getServerSession } from 'next-auth/next'
import { render, screen, within } from '@testing-library/react'
import { NextSeo } from 'next-seo'
import type { OrganisationProps } from '../pages/organisations/[organisationId]'
import Organisation, { getServerSideProps } from '../pages/organisations/[organisationId]'
import { userWithContactManagerRole, userWithSponsorContactRole } from '../__mocks__/session'
import { SIGN_IN_PAGE } from '../constants/routes'
import { prismaMock } from '../__mocks__/prisma'
import type { OrganisationWithRelations } from '../lib/organisations'

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

  test('redirects back to the homepage for users without contact manager role', async () => {
    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {} })
    getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: '/',
      },
    })
  })

  test('redirects to 404 page if no organisation id provided', async () => {
    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: {} })
    getServerSessionMock.mockResolvedValueOnce(userWithContactManagerRole)

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: '/404',
      },
    })
  })

  test('redirects to 404 page if no organisation found', async () => {
    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { organisationId: '123' } })
    getServerSessionMock.mockResolvedValueOnce(userWithContactManagerRole)
    prismaMock.organisation.findFirst.mockResolvedValueOnce(null)

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: '/404',
      },
    })
  })
})

const mockOrganisation = Mock.of<OrganisationWithRelations>({
  id: 123,
  name: 'Test organisation',
  roles: [
    {
      role: {
        name: 'Clinical Research Sponsor',
      },
    },
    {
      role: {
        name: 'Contract Research Organisation',
      },
    },
  ],
  users: [
    {
      id: 1,
      user: {
        email: 'test1@test1.com',
        registrationConfirmed: true,
      },
      createdAt: new Date('2001-01-01'),
    },
    {
      id: 2,
      user: {
        email: 'test2@test2.com',
        registrationConfirmed: false,
      },
      createdAt: new Date('2001-01-01'),
    },
  ],
})

beforeEach(() => {
  console.error = jest.fn()
})

describe('Organisation page', () => {
  jest.mocked(getServerSession).mockResolvedValue(userWithContactManagerRole)

  test('Default layout', async () => {
    prismaMock.organisation.findFirst.mockResolvedValueOnce(mockOrganisation)

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { organisationId: '123' } })

    const { props } = (await getServerSideProps(context)) as {
      props: OrganisationProps
    }

    render(Organisation.getLayout(<Organisation {...props} />, { ...props }))

    // SEO
    expect(NextSeo).toHaveBeenCalledWith({ title: `Manage organisation contacts - ${mockOrganisation.name}` }, {})

    // Title
    expect(
      screen.getByRole('heading', { level: 2, name: `Organisation name: ${mockOrganisation.name}` })
    ).toBeInTheDocument()

    // Roles
    expect(screen.getByText(/Organisation roles:/).parentNode).toHaveTextContent('Organisation roles: Sponsor, CRO')

    // Organisation details
    const organisationDetailsTable = screen.getByRole('table', { name: 'Organisation details' })

    const progressHeaders = within(organisationDetailsTable).getAllByRole('rowheader')
    expect(progressHeaders.map((header) => header.textContent)).toEqual(['Organisation ID', 'Type', 'Role'])

    const progressRows = within(organisationDetailsTable).getAllByRole('row')
    expect(progressRows.map((row) => within(row).getByRole('cell').textContent)).toEqual([
      '123',
      'Commercial',
      'Sponsor, CRO',
    ])

    expect(screen.getByRole('heading', { name: 'Add or remove sponsor contacts', level: 3 })).toBeInTheDocument()

    expect(
      screen.getByText(
        /Invite new sponsor contacts to set up an NIHR Identity Gateway account so they can access this service./
      )
    ).toBeInTheDocument()

    // Invite form
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send invite' })).toBeInTheDocument()

    // Organisation contacts
    const contactsTable = screen.getByRole('table', { name: 'Organisation contacts' })

    const contactHeaders = within(contactsTable).getAllByRole('columnheader')
    expect(contactHeaders.map((header) => header.textContent)).toEqual(['Contact email', 'Date added'])

    const contactCells = within(contactsTable)
      .getAllByRole('cell')
      .map((cell) => cell.textContent)

    expect(contactCells).toEqual([
      '', // Empty header cell
      'test1@test1.com',
      '1 January 2001',
      'Remove',
      'test2@test2.com',
      'Pending',
      'Remove',
    ])

    const removeLinks = within(contactsTable).getAllByRole('link', { name: 'Remove' })
    expect(removeLinks[0]).toHaveAttribute('href', '#')
    expect(removeLinks[1]).toHaveAttribute('href', '#')
  })

  test('No contacts', async () => {
    prismaMock.organisation.findFirst.mockResolvedValueOnce(
      Mock.of<OrganisationWithRelations>({ ...mockOrganisation, users: [] })
    )

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { organisationId: '123' } })

    const { props } = (await getServerSideProps(context)) as {
      props: OrganisationProps
    }

    render(Organisation.getLayout(<Organisation {...props} />, { ...props }))

    expect(screen.queryByRole('table', { name: 'Organisation contacts' })).not.toBeInTheDocument()

    expect(screen.getByText('No contacts associated with this organisation')).toBeInTheDocument()
  })
})
