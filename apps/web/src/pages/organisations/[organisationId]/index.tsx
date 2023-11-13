import { useCallback, type ReactElement } from 'react'
import { Container, NotificationBanner, Table } from '@nihr-ui/frontend'
import type { InferGetServerSidePropsType } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import clsx from 'clsx'
import type { FieldError } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { getOrganisationById } from '../../../lib/organisations'
import { withServerSideProps } from '../../../utils/withServerSideProps'
import { formatDate } from '../../../utils/date'
import { RootLayout } from '../../../components/organisms'
import { TextInput } from '../../../components/atoms/Form/TextInput/TextInput'
import { Roles } from '../../../constants'
import { ErrorSummary, Form } from '../../../components/atoms'
import type { OrganisationAddInputs } from '../../../utils/schemas'
import { organisationAddSchema } from '../../../utils/schemas'
import { getValuesFromSearchParams } from '../../../utils/form'
import { useFormErrorHydration } from '../../../hooks/useFormErrorHydration'

export type OrganisationProps = InferGetServerSidePropsType<typeof getServerSideProps>

const renderNotificationBanner = (success: boolean) =>
  success ? (
    <NotificationBanner heading="Contact added" success>
      New contacts are shown as pending until they sign into this service for the first time.
    </NotificationBanner>
  ) : null

export default function Organisation({ organisation, query }: OrganisationProps) {
  const router = useRouter()

  const { register, formState, setError, handleSubmit } = useForm<OrganisationAddInputs>({
    resolver: zodResolver(organisationAddSchema),
    defaultValues: {
      ...getValuesFromSearchParams(organisationAddSchema, query),
      organisationId: String(organisation.id),
    },
  })

  const handleFoundError = useCallback(
    (field: keyof OrganisationAddInputs, error: FieldError) => {
      setError(field, error)
    },
    [setError]
  )

  const { errors } = useFormErrorHydration<OrganisationAddInputs>({
    schema: organisationAddSchema,
    formState,
    onFoundError: handleFoundError,
  })

  const { defaultValues } = formState

  const renderDetails = useCallback(
    () => (
      <Table className="govuk-!-margin-top-3">
        <Table.Caption className="govuk-visually-hidden">Organisation details</Table.Caption>
        <Table.Body>
          <Table.Row>
            <Table.CellHeader className="w-1/3">Organisation ID</Table.CellHeader>
            <Table.Cell>{organisation.id}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader className="w-1/3">Role</Table.CellHeader>
            <Table.Cell>{organisation.roles.join(', ')}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    ),
    [organisation.roles, organisation.id]
  )

  const renderContactList = useCallback(
    () => (
      <Table>
        <Table.Caption className="govuk-visually-hidden">Organisation contacts</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.CellHeader className="w-1/3" column>
              Contact email
            </Table.CellHeader>
            <Table.CellHeader className="w-1/3" column>
              Date added
            </Table.CellHeader>
            <Table.Cell className="w-1/3" />
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {organisation.users.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>{user.user.email}</Table.Cell>
              <Table.Cell>{user.user.registrationConfirmed ? formatDate(user.createdAt) : 'Pending'}</Table.Cell>
              <Table.Cell>
                <Link href="#">Remove</Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    ),
    [organisation.users]
  )

  return (
    <Container>
      <NextSeo title={`Manage organisation contacts - ${organisation.name}`} />
      <div className="lg:flex lg:gap-6">
        <div className="w-full">
          {renderNotificationBanner(Boolean(router.query.success))}

          {/* Organisation name */}
          <h2 className="govuk-heading-l govuk-!-margin-bottom-1">
            <span className="govuk-visually-hidden">Organisation name: </span>
            {organisation.name}
          </h2>

          {/* Organisation roles */}
          <span className="govuk-body-m mb-0 text-darkGrey">
            <span className="govuk-visually-hidden">Organisation roles: </span>
            {organisation.roles.join(', ')}
          </span>

          {/* Organisation details */}
          {renderDetails()}

          <h3 className="govuk-heading-m p-0 govuk-!-margin-bottom-4">Add or remove sponsor contacts</h3>

          <p>
            Invite new sponsor contacts to set up an NIHR Identity Gateway account so they can access this service. New
            contacts are shown as pending until they sign into this service for the first time.
          </p>

          {/* Invite form */}
          <Form
            action="/api/forms/organisation"
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

            <input type="hidden" {...register('organisationId')} defaultValue={defaultValues?.organisationId} />

            <div className="sm:flex sm:gap-x-4 items-end">
              <TextInput
                className="govuk-input--width-20 flex-grow"
                defaultValue={defaultValues?.emailAddress}
                errors={errors}
                label="Email address"
                {...register('emailAddress')}
              />

              <div className="govuk-button-group">
                <button className={clsx('govuk-button', { 'pointer-events-none': formState.isLoading })} type="submit">
                  Send invite
                </button>
              </div>
            </div>
          </Form>

          {/* Organisation contacts */}
          {organisation.users.length > 0 ? renderContactList() : <p>No contacts associated with this organisation</p>}
        </div>
      </div>
    </Container>
  )
}

Organisation.getLayout = function getLayout(page: ReactElement, { user }: OrganisationProps) {
  return <RootLayout user={user}>{page}</RootLayout>
}

export const getServerSideProps = withServerSideProps(Roles.ContactManager, async (context, session) => {
  const organisationId = Number(context.query.organisationId)

  if (!organisationId) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }

  const organisation = await getOrganisationById(organisationId)

  if (!organisation) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }

  return {
    props: {
      query: context.query,
      user: session.user,
      organisation,
    },
  }
})
