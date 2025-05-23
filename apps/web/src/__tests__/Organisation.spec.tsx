import { logger } from '@nihr-ui/logger'
import userEvent from '@testing-library/user-event'
import type { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'
import mockRouter from 'next-router-mock'
import { NextSeo } from 'next-seo'
import { Mock } from 'ts-mockery'

import { render, screen, within } from '@/config/TestUtils'

import { prismaMock } from '../__mocks__/prisma'
import { userNoRoles, userWithContactManagerRole } from '../__mocks__/session'
import { SIGN_IN_PAGE } from '../constants/routes'
import type { OrganisationWithRelations } from '../lib/organisations'
import type { OrganisationProps } from '../pages/organisations/[organisationId]'
import Organisation, { getServerSideProps } from '../pages/organisations/[organisationId]'

jest.mock('@nihr-ui/logger')
jest.mock('next-auth/next')
jest.mock('next-seo')
jest.mock('axios')

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

  test('redirects back to the homepage for users without contact manager role or sponsor contact role', async () => {
    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {} })
    getServerSessionMock.mockResolvedValueOnce(userNoRoles)

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
  rtsIdentifier: 'rts-123',
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
        lastLogin: new Date('2001-01-03'),
      },
      createdAt: new Date('2001-01-01'),
      updatedAt: new Date('2001-01-02'),
      invitations: [
        {
          status: {
            name: 'Failure',
          },
        },
      ],
    },
    {
      id: 2,
      user: {
        email: 'test2@test2.com',
        registrationConfirmed: false,
        lastLogin: null,
      },
      createdAt: new Date('2001-01-01'),
      updatedAt: new Date('2001-01-02'),
      invitations: [],
    },
  ],
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
    expect(progressHeaders.map((header) => header.textContent)).toEqual(['Organisation ID', 'Role'])

    const progressRows = within(organisationDetailsTable).getAllByRole('row')
    expect(progressRows.map((row) => within(row).getByRole('cell').textContent)).toEqual(['rts-123', 'Sponsor, CRO'])

    expect(screen.getByRole('heading', { name: 'Add or remove sponsor contacts', level: 3 })).toBeInTheDocument()

    expect(
      screen.getByText(
        /Invite new sponsor contacts to this organisation, allowing them to view all studies for this organisation and provide assessments. If the user has not accessed the tool previously, they will be asked to set up an NIHR Identity Gateway account so they can access this service./
      )
    ).toBeInTheDocument()

    // Invite form
    expect(screen.getByLabelText('Email address')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send invite' })).toBeInTheDocument()

    // Organisation contacts
    const contactsTable = screen.getByRole('table', { name: 'Organisation contacts' })

    const contactHeaders = within(contactsTable).getAllByRole('columnheader')
    expect(contactHeaders.map((header) => header.textContent)).toEqual([
      'Contact email',
      'Date added',
      'Date of last login',
      'Actions',
    ])

    const contactCells = within(contactsTable)
      .getAllByRole('cell')
      .map((cell) => cell.textContent)

    expect(contactCells).toEqual([
      'test1@test1.com',
      '2 January 2001Failed to deliver email',
      '3 January 2001',
      'Remove',
      'test2@test2.com',
      '2 January 2001',
      '-No last login date',
      'Remove',
    ])

    const removeLink1 = within(contactsTable).getAllByRole('link', {
      name: `Remove ${mockOrganisation.users[0].user.email}`,
    })[0]
    const removeLink2 = within(contactsTable).getAllByRole('link', {
      name: `Remove ${mockOrganisation.users[1].user.email}`,
    })[0]
    expect(removeLink1).toHaveAttribute('href', '/organisations/remove-contact/1')
    expect(removeLink2).toHaveAttribute('href', '/organisations/remove-contact/2')
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

  test('Success banner shows after adding a contact', async () => {
    prismaMock.organisation.findFirst.mockResolvedValueOnce(mockOrganisation)

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { organisationId: '123' } })

    await mockRouter.push('?success=1')

    const { props } = (await getServerSideProps(context)) as {
      props: OrganisationProps
    }

    render(Organisation.getLayout(<Organisation {...props} />, { ...props }))

    // Banner
    const banner = screen.getByRole('alert', { name: 'Success' })
    expect(within(banner).getByText(/was added as a contact for this organisation/)).toBeInTheDocument()
  })

  test('Success banner shows after removing a contact', async () => {
    prismaMock.organisation.findFirst.mockResolvedValueOnce(mockOrganisation)

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { organisationId: '123' } })

    await mockRouter.push('?success=2')

    const { props } = (await getServerSideProps(context)) as {
      props: OrganisationProps
    }

    render(Organisation.getLayout(<Organisation {...props} />, { ...props }))

    // Banner
    const banner = screen.getByRole('alert', { name: 'Success' })
    expect(within(banner).getByText('The selected contact has been removed from this organisation')).toBeInTheDocument()
  })
})

describe('Form submission failures', () => {
  jest.mocked(getServerSession).mockResolvedValue(userWithContactManagerRole)

  beforeEach(() => {
    logger.error = jest.fn()
    void mockRouter.push('/organisations/123')
    jest.clearAllMocks()
  })

  test('Client side validation errors', async () => {
    prismaMock.organisation.findFirst.mockResolvedValueOnce(mockOrganisation)

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { organisationId: '123' } })

    const { props } = (await getServerSideProps(context)) as {
      props: OrganisationProps
    }

    render(Organisation.getLayout(<Organisation {...props} />, { ...props }))

    expect(
      screen.getByRole('heading', { level: 2, name: `Organisation name: ${mockOrganisation.name}` })
    ).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Send invite' }))

    // Summary errors
    const alert = screen.getByRole('alert', { name: 'There is a problem' })
    expect(within(alert).getByRole('link', { name: 'Enter a valid email address' })).toHaveAttribute(
      'href',
      '#emailAddress'
    )

    // Field errors
    expect(screen.getByRole('textbox', { name: 'Email address' })).toHaveAccessibleErrorMessage(
      'Error: Enter a valid email address'
    )
  })

  test('Server side field validation errors', async () => {
    void mockRouter.push('?emailAddressError=Enter+a+valid+email+address')

    prismaMock.organisation.findFirst.mockResolvedValueOnce(mockOrganisation)

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { organisationId: '123' } })

    const { props } = (await getServerSideProps(context)) as {
      props: OrganisationProps
    }

    render(Organisation.getLayout(<Organisation {...props} />, { ...props }))

    expect(
      screen.getByRole('heading', { level: 2, name: `Organisation name: ${mockOrganisation.name}` })
    ).toBeInTheDocument()

    // Summary errors
    const alert = screen.getByRole('alert', { name: 'There is a problem' })
    expect(within(alert).getByRole('link', { name: 'Enter a valid email address' })).toHaveAttribute(
      'href',
      '#emailAddress'
    )

    // Field errors
    expect(screen.getByRole('textbox', { name: 'Email address' })).toHaveAccessibleErrorMessage(
      'Error: Enter a valid email address'
    )
  })

  test('Fatal server error shows an error at the top of the page', async () => {
    prismaMock.organisation.findFirst.mockResolvedValueOnce(mockOrganisation)

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { organisationId: '123' } })

    const { props } = (await getServerSideProps(context)) as {
      props: OrganisationProps
    }

    render(Organisation.getLayout(<Organisation {...props} />, { ...props }))

    expect(
      screen.getByRole('heading', { level: 2, name: `Organisation name: ${mockOrganisation.name}` })
    ).toBeInTheDocument()

    // Email address
    await userEvent.type(screen.getByLabelText('Email address'), 'testuser@nihr.ac.uk')

    await userEvent.click(screen.getByRole('button', { name: 'Send invite' }))

    const alert = await screen.findByRole('alert')
    expect(
      within(alert).getByText('An unexpected error occurred whilst processing the form, please try again later.')
    ).toBeInTheDocument()

    expect(mockRouter.asPath).toBe('/organisations/123?fatal=1')
  })
})
