import type { GetServerSidePropsContext } from 'next'
import { Mock } from 'ts-mockery'
import { getServerSession } from 'next-auth/next'
import { logger } from '@nihr-ui/logger'
import { faker } from '@faker-js/faker'
import type { getUserResponseSchema } from '@nihr-ui/auth'
import { authService } from '@nihr-ui/auth'
import type { z } from 'zod'
import { ZodError } from 'zod'
import { NextSeo } from 'next-seo'
import userEvent from '@testing-library/user-event'
import mockRouter from 'next-router-mock'
import { render, screen, within } from '../config/TestUtils'
import type { RegisterProps } from '../pages/register'
import Registration, { getServerSideProps } from '../pages/register'
import { userNoRoles } from '../__mocks__/session'
import { ERROR_PAGE_500, REGISTRATION_CONFIRMATION_LINKED_PAGE, SIGN_IN_PAGE } from '../constants/routes'
import type { Prisma } from '../lib/prisma'
import { prismaClient } from '../lib/prisma'

jest.mock('@nihr-ui/auth')
jest.mock('@nihr-ui/logger')
jest.mock('next-auth/next')
jest.mock('next-seo')

const sessionMock = jest.mocked(getServerSession).mockResolvedValue(null)

const userName = faker.string.uuid()

const getIDGUserResponseFoundUser = Mock.of<z.infer<typeof getUserResponseSchema>>({
  totalResults: 1,
  Resources: [{ userName }],
})

const getIDGUserResponseNoMatch = Mock.of<z.infer<typeof getUserResponseSchema>>({
  totalResults: 0,
})

describe('getServerSideProps', () => {
  const id = faker.number.int()
  const registrationToken = faker.string.uuid()
  const email = faker.internet.email()
  const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { registrationToken } })
  const findUserMock = jest.mocked(prismaClient.user.findFirst)
  const updateUserMock = jest.mocked(prismaClient.user.update)
  const getIDGUserMock = jest.mocked(authService.getUser)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test.each(['IDG_API_URL', 'IDG_API_USERNAME', 'IDG_API_PASSWORD'])(
    'redirects to error page if the %p env var is missing',
    async (key) => {
      const envBefore = process.env[key]
      process.env[key] = ''
      const result = await getServerSideProps(context)
      expect(result).toEqual({
        redirect: {
          destination: ERROR_PAGE_500,
        },
      })
      process.env[key] = envBefore
    }
  )

  test('redirects to home page when there is already a session', async () => {
    sessionMock.mockResolvedValueOnce(userNoRoles)
    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: '/',
      },
    })
  })

  test('redirects to the error page when a registration token is not provided', async () => {
    const result = await getServerSideProps({ ...context, query: {} })
    expect(result).toEqual({
      redirect: {
        destination: ERROR_PAGE_500,
      },
    })
  })

  test('redirects to the sign in page when no user is found associated with the registration token', async () => {
    findUserMock.mockResolvedValueOnce(null)

    const result = await getServerSideProps(context)

    expect(logger.info).toHaveBeenCalledWith(
      `No email found associated with the registrationToken ${registrationToken}`
    )
    expect(result).toEqual({
      redirect: {
        destination: SIGN_IN_PAGE,
      },
    })
  })

  test('redirects to the error page if the IDG request to check the matched email address fails', async () => {
    findUserMock.mockResolvedValue(Mock.of<Prisma.UserGetPayload<null>>({ email }))
    getIDGUserMock.mockResolvedValueOnce({ success: false, error: new ZodError([]) })

    const result = await getServerSideProps(context)

    expect(logger.error).toHaveBeenCalledWith(new Error(`IDG Users request did not match expected schema`))
    expect(result).toEqual({
      redirect: {
        destination: ERROR_PAGE_500,
      },
    })
  })

  test('shows the registration page when no IDG account exists', async () => {
    findUserMock.mockResolvedValue(Mock.of<Prisma.UserGetPayload<null>>({ email }))
    getIDGUserMock.mockResolvedValueOnce({ success: true, data: getIDGUserResponseNoMatch })

    const result = await getServerSideProps(context)

    expect(logger.info).toHaveBeenCalledWith('No IDG account found, proceeding to registration screen')
    expect(result).toEqual({
      props: {
        query: context.query,
        registrationToken,
      },
    })
  })

  test('syncs the local user with the IDG user when an IDG account does exist', async () => {
    findUserMock.mockResolvedValue(Mock.of<Prisma.UserGetPayload<null>>({ email }))
    getIDGUserMock.mockResolvedValueOnce({ success: true, data: getIDGUserResponseFoundUser })
    updateUserMock.mockResolvedValueOnce(Mock.of<Prisma.UserGetPayload<null>>({ id }))
    const result = await getServerSideProps(context)

    expect(logger.info).toHaveBeenCalledWith('Found IDG account matching email')
    expect(updateUserMock).toHaveBeenCalledWith({
      data: {
        identityGatewayId: userName,
        registrationConfirmed: true,
        registrationToken: null,
      },
      where: {
        email,
        isDeleted: false,
      },
    })
    expect(logger.info).toHaveBeenCalledWith(
      `Updated local user ${id} with identityGatewayId ${userName}, now redirecting to confirmation page`
    )
    expect(result).toEqual({
      redirect: {
        destination: REGISTRATION_CONFIRMATION_LINKED_PAGE,
      },
    })
  })
})

describe('Registration page', () => {
  const registrationToken = faker.string.uuid()
  const email = faker.internet.email()
  const findUserMock = jest.mocked(prismaClient.user.findFirst)
  const getIDGUserMock = jest.mocked(authService.getUser)

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('Default layout', async () => {
    findUserMock.mockResolvedValue(Mock.of<Prisma.UserGetPayload<null>>({ email }))
    getIDGUserMock.mockResolvedValueOnce({ success: true, data: getIDGUserResponseNoMatch })

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { registrationToken } })

    const { props } = (await getServerSideProps(context)) as {
      props: RegisterProps
    }

    render(Registration.getLayout(<Registration {...props} />))

    // SEO
    expect(NextSeo).toHaveBeenCalledWith({ title: `Review progress of research studies - complete registration` }, {})

    // Title
    expect(
      screen.getByRole('heading', { level: 2, name: `Review progress of research studies - complete registration` })
    ).toBeInTheDocument()

    // Description
    expect(
      screen.getByText(
        'Access to the service is via the NIHR Identity Gateway. An account will be created for your email address once you have set a password below.'
      )
    ).toBeInTheDocument()

    // Register form
    expect(
      screen.getByRole('group', { name: 'Set a password for your NIHR Identity Gateway account' })
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Create your password')).toHaveAttribute('type', 'password')
    expect(screen.getByLabelText('Confirm your password')).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'submit')
  })

  test('Client side validation errors', async () => {
    findUserMock.mockResolvedValue(Mock.of<Prisma.UserGetPayload<null>>({ email }))
    getIDGUserMock.mockResolvedValueOnce({ success: true, data: getIDGUserResponseNoMatch })

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { registrationToken } })

    const { props } = (await getServerSideProps(context)) as {
      props: RegisterProps
    }

    render(Registration.getLayout(<Registration {...props} />))

    expect(
      screen.getByRole('heading', { level: 2, name: `Review progress of research studies - complete registration` })
    ).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Save' }))

    // Summary errors
    const alert = screen.getByRole('alert', { name: 'There is a problem' })
    expect(within(alert).getAllByRole('link', { name: 'Enter a minimum of 12 characters' })[0]).toHaveAttribute(
      'href',
      '#password'
    )
    expect(within(alert).getAllByRole('link', { name: 'Enter a minimum of 12 characters' })[1]).toHaveAttribute(
      'href',
      '#confirmPassword'
    )

    // Field errors
    expect(screen.getByLabelText('Create your password')).toHaveAccessibleErrorMessage(
      'Error: Enter a minimum of 12 characters'
    )
    expect(screen.getByLabelText('Confirm your password')).toHaveAccessibleErrorMessage(
      'Error: Enter a minimum of 12 characters'
    )
  })

  test('Server side field validation errors', async () => {
    findUserMock.mockResolvedValue(Mock.of<Prisma.UserGetPayload<null>>({ email }))
    getIDGUserMock.mockResolvedValueOnce({ success: true, data: getIDGUserResponseNoMatch })

    void mockRouter.push(`?passwordError=Enter+a+minimum+of+12+characters`)

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { registrationToken } })

    const { props } = (await getServerSideProps(context)) as {
      props: RegisterProps
    }

    render(Registration.getLayout(<Registration {...props} />))

    expect(
      screen.getByRole('heading', { level: 2, name: `Review progress of research studies - complete registration` })
    ).toBeInTheDocument()

    // Summary errors
    const alert = screen.getByRole('alert', { name: 'There is a problem' })
    expect(within(alert).getAllByRole('link', { name: 'Enter a minimum of 12 characters' })[0]).toHaveAttribute(
      'href',
      '#password'
    )

    // Field errors
    expect(screen.getByLabelText('Create your password')).toHaveAccessibleErrorMessage(
      'Error: Enter a minimum of 12 characters'
    )
  })
})
