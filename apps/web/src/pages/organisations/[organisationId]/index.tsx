import { zodResolver } from '@hookform/resolvers/zod'
import { Container, NotificationBanner, Table } from '@nihr-ui/frontend'
import clsx from 'clsx'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { type ReactElement, useCallback } from 'react'
import type { FieldError } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import { ErrorSummary, Form } from '@/components/atoms'
import { TextInput } from '@/components/atoms/Form/TextInput/TextInput'
import { RootLayout } from '@/components/organisms'
import { Roles } from '@/constants'
import { useFormErrorHydration } from '@/hooks/useFormErrorHydration'
import { getOrganisationById } from '@/lib/organisations'
import { formatDate } from '@/utils/date'
import { getValuesFromSearchParams } from '@/utils/form'
import type { OrganisationAddInputs } from '@/utils/schemas'
import { organisationAddSchema } from '@/utils/schemas'
import { withServerSideProps } from '@/utils/withServerSideProps'

export type OrganisationProps = InferGetServerSidePropsType<typeof getServerSideProps>

const renderNotificationBanner = (successType: number) => (
  <NotificationBanner heading={`Contact ${successType === 1 ? 'added' : 'removed'}`} success>
    {successType === 1
      ? 'A new contact was added for this organisation'
      : 'The selected contact has been removed from this organisation'}
  </NotificationBanner>
)

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
            <Table.Cell>{organisation.rtsIdentifier}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.CellHeader className="w-1/3">Role</Table.CellHeader>
            <Table.Cell>{organisation.roles.join(', ')}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    ),
    [organisation.roles, organisation.rtsIdentifier]
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
            <Table.CellHeader className="w-1/3" column>
              Actions
            </Table.CellHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {organisation.users.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>{user.user.email}</Table.Cell>
              <Table.Cell>{formatDate(user.updatedAt)}</Table.Cell>
              <Table.Cell>
                <Link aria-label={`Remove ${user.user.email}`} href={`/organisations/remove-contact/${user.id}`}>
                  Remove
                </Link>
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
          {Boolean(router.query.success) && renderNotificationBanner(Number(router.query.success))}

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
            Invite new sponsor contacts to this organisation, allowing them to view all studies for this organisation
            and provide assessments. If the user has not accessed the tool previously, they will be asked to set up an
            NIHR Identity Gateway account so they can access this service.
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
