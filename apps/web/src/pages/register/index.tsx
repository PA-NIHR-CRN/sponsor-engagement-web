import assert from 'node:assert'
import { useCallback, type ReactElement } from 'react'
import { Container } from '@nihr-ui/frontend'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getServerSession } from 'next-auth/next'
import { logger } from '@nihr-ui/logger'
import type { FieldError } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { authService } from '@nihr-ui/auth'
import { RootLayout } from '../../components/organisms'
import { ERROR_PAGE_500, STUDIES_PAGE, REGISTRATION_CONFIRMATION_PAGE } from '../../constants/routes'
import { authOptions } from '../api/auth/[...nextauth]'
import { prismaClient } from '../../lib/prisma'
import { getValuesFromSearchParams } from '../../utils/form'
import type { RegistrationInputs } from '../../utils/schemas'
import { registrationSchema } from '../../utils/schemas'
import { useFormErrorHydration } from '../../hooks/useFormErrorHydration'
import { ErrorSummary, Fieldset, Form } from '../../components/atoms'
import { TextInput } from '../../components/atoms/Form/TextInput/TextInput'

export type RegisterProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Register({ query, registrationToken }: RegisterProps) {
  const { register, formState, setError, handleSubmit } = useForm<RegistrationInputs>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      ...getValuesFromSearchParams(registrationSchema, query),
      registrationToken,
    },
  })

  const handleFoundError = useCallback(
    (field: keyof RegistrationInputs, error: FieldError) => {
      setError(field, error)
    },
    [setError]
  )

  const { errors } = useFormErrorHydration<RegistrationInputs>({
    schema: registrationSchema,
    formState,
    onFoundError: handleFoundError,
  })

  const { defaultValues } = formState

  return (
    <Container>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Review progress of research studies - complete registration</h2>
          <p className="govuk-body">
            Access to the service is via the NIHR Identity Gateway. An account will be created for your email address
            once you have set a password below.
          </p>
          {/* Register form */}
          <Form
            action="/api/forms/registration"
            handleSubmit={handleSubmit}
            method="post"
            onError={(message: string) => {
              setError('root.serverError', {
                type: '400',
                message,
              })
            }}
          >
            <ErrorSummary errors={errors} />

            <input type="hidden" {...register('registrationToken')} defaultValue={defaultValues?.registrationToken} />

            <Fieldset legend="Set a password for your NIHR Identity Gateway account">
              <TextInput
                className="govuk-input--width-20 flex-grow"
                defaultValue={defaultValues?.password}
                errors={errors}
                label="Create your password"
                type="password"
                {...register('password')}
              />

              <TextInput
                className="govuk-input--width-20 flex-grow"
                defaultValue={defaultValues?.confirmPassword}
                errors={errors}
                label="Confirm your password"
                type="password"
                {...register('confirmPassword')}
              />

              <div className="govuk-button-group">
                <button className={clsx('govuk-button', { 'pointer-events-none': formState.isLoading })} type="submit">
                  Save
                </button>
              </div>
            </Fieldset>
          </Form>
        </div>
      </div>
    </Container>
  )
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <RootLayout user={null}>{page}</RootLayout>
}

/**
 * User Registration Workflow:
 *
 * 1. Retrieve user information by querying the registrationToken to obtain the associated email address.
 *
 * 2. Check if an account with the same email address exists in the IDG database.
 *
 * 3. If no IDG account is found:
 *    - Provide the user's email address as a prop and allow them to create a password.
 *    - Upon successful password creation, reset the registrationToken and set registrationConfirmed to 1.
 *
 * 4. If an IDG account already exists:
 *    - Reset the registrationToken and set registrationConfirmed to 1.
 *    - Redirect the user to the registration confirmation page.
 */

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { IDG_API_URL, IDG_API_USERNAME, IDG_API_PASSWORD } = process.env

    assert(IDG_API_URL)
    assert(IDG_API_USERNAME)
    assert(IDG_API_PASSWORD)

    const session = await getServerSession(context.req, context.res, authOptions)

    // If already signed in, redirect to studies
    if (session) {
      return {
        redirect: {
          destination: STUDIES_PAGE,
        },
      }
    }

    // If there's no registrationToken, redirect to error page
    if (!context.query.registrationToken) {
      throw new Error('Missing registration token')
    }

    const registrationToken = context.query.registrationToken as string

    const user = await prismaClient.user.findFirst({
      where: {
        registrationToken,
        isDeleted: false,
      },
    })

    if (!user?.email) {
      throw new Error(`No email found associated with the registrationToken ${registrationToken}`)
    }

    const getUserResponse = await authService.getUser(user.email)

    if (getUserResponse.success) {
      const {
        data: { totalResults, Resources },
      } = getUserResponse

      // No user found
      if (totalResults === 0) {
        logger.info('No IDG account found, proceeding to registration screen')

        return {
          props: {
            query: context.query,
            registrationToken,
          },
        }
      }

      // User found
      if (totalResults > 0 && Resources) {
        const identityGatewayId = Resources.find((resource) => Boolean(resource.id))?.id

        logger.info('Found IDG account matching email')

        const { id } = await prismaClient.user.update({
          where: {
            email: user.email,
            isDeleted: false,
          },
          data: {
            identityGatewayId,
            registrationConfirmed: true,
            registrationToken: null,
          },
        })

        logger.info(
          `Updated local user ${id} with identityGatewayId ${identityGatewayId}, now redirecting to confirmation page`
        )

        return {
          redirect: {
            destination: REGISTRATION_CONFIRMATION_PAGE,
          },
        }
      }

      throw new Error('IDG users request did not return any users matching the provided email')
    }

    throw new Error('IDG Users request did not match expected schema')
  } catch (error) {
    logger.error(error)
    return {
      redirect: {
        destination: ERROR_PAGE_500,
      },
    }
  }
}
