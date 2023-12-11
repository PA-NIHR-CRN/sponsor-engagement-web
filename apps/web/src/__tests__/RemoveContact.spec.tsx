import type { GetServerSidePropsContext } from 'next'
import { Mock } from 'ts-mockery'
import { getServerSession } from 'next-auth/next'
import { NextSeo } from 'next-seo'
import { logger } from '@nihr-ui/logger'
import mockRouter from 'next-router-mock'
import userEvent from '@testing-library/user-event'
import axios from 'axios'
import type { RemoveContactProps } from '../pages/organisations/remove-contact/[userOrganisationId]'
import RemoveContact, { getServerSideProps } from '../pages/organisations/remove-contact/[userOrganisationId]'
import { userWithContactManagerRole, userWithSponsorContactRole } from '../__mocks__/session'
import { SIGN_IN_PAGE } from '../constants/routes'
import { prismaMock } from '../__mocks__/prisma'
import type { UserOrganisationWithRelations } from '../lib/organisations'
import { render, screen, within } from '@/config/TestUtils'

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

  test('redirects to 404 page if no user organisation id provided', async () => {
    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: {} })
    getServerSessionMock.mockResolvedValueOnce(userWithContactManagerRole)

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: '/404',
      },
    })
  })

  test('redirects to 404 page if no user organisation found', async () => {
    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { userOrganisationId: '123' } })
    getServerSessionMock.mockResolvedValueOnce(userWithContactManagerRole)
    prismaMock.userOrganisation.findFirst.mockResolvedValueOnce(null)

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: '/404',
      },
    })
  })
})

const mockUserOrganisation = Mock.of<UserOrganisationWithRelations>({
  id: 123,
  organisation: { id: 12345, name: 'Test Organisation' },
  user: { email: 'test@test.com' },
})

describe('Remove contact page', () => {
  jest.mocked(getServerSession).mockResolvedValue(userWithContactManagerRole)

  test('Default layout', async () => {
    prismaMock.userOrganisation.findFirst.mockResolvedValueOnce(mockUserOrganisation)

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { userOrganisationId: '123' } })

    const { props } = (await getServerSideProps(context)) as {
      props: RemoveContactProps
    }

    render(RemoveContact.getLayout(<RemoveContact {...props} />, { ...props }))

    // SEO
    expect(NextSeo).toHaveBeenCalledWith({ title: `Manage organisation contacts - remove contact` }, {})

    // Title
    expect(
      screen.getByRole('heading', { level: 2, name: `Are you sure you want to remove this contact?` })
    ).toBeInTheDocument()

    // Copy
    expect(screen.getByText('You are about to remove', { exact: false })).toHaveTextContent(
      `You are about to remove ${mockUserOrganisation.user.email} from acting as a Sponsor Contact for the organisation ${mockUserOrganisation.organisation.name}. This will mean they can no longer view or assess studies for this organisation. They will still have access to studies for any other organisation they are assigned to.`
    )

    expect(
      screen.getByText(`Are you sure you want to remove this contact from ${mockUserOrganisation.organisation.name}?`, {
        exact: false,
      })
    ).toBeInTheDocument()
  })

  test('Confirm removal of contact', async () => {
    const axiosPostMock = jest.mocked(axios.post).mockResolvedValue({
      request: { responseURL: 'http://localhost/organisations/123?success=2' },
    })

    prismaMock.userOrganisation.findFirst.mockResolvedValueOnce(mockUserOrganisation)

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { userOrganisationId: '123' } })

    const { props } = (await getServerSideProps(context)) as {
      props: RemoveContactProps
    }

    render(RemoveContact.getLayout(<RemoveContact {...props} />, { ...props }))

    await userEvent.click(screen.getByRole('button', { name: `Yes I'm sure — remove this contact` }))

    expect(axiosPostMock).toHaveBeenCalledWith('/api/forms/removeContact', { userOrganisationId: '123' })

    expect(mockRouter.asPath).toBe('/organisations/123?success=2')
  })
})

describe('Form submission failures', () => {
  jest.mocked(getServerSession).mockResolvedValue(userWithContactManagerRole)

  beforeEach(() => {
    logger.error = jest.fn()
    void mockRouter.push('/organisations/remove-contact/123')
    jest.clearAllMocks()
  })

  test('Fatal server error shows an error at the top of the page', async () => {
    jest.mocked(axios.post).mockResolvedValue({
      request: { responseURL: undefined },
    })

    prismaMock.userOrganisation.findFirst.mockResolvedValueOnce(mockUserOrganisation)

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { userOrganisationId: '123' } })

    const { props } = (await getServerSideProps(context)) as {
      props: RemoveContactProps
    }

    render(RemoveContact.getLayout(<RemoveContact {...props} />, { ...props }))

    await userEvent.click(screen.getByRole('button', { name: `Yes I'm sure — remove this contact` }))

    const alert = await screen.findByRole('alert')
    expect(
      within(alert).getByText('An unexpected error occurred whilst processing the form, please try again later.')
    ).toBeInTheDocument()

    expect(mockRouter.asPath).toBe('/organisations/remove-contact/123?fatal=1')
  })
})
