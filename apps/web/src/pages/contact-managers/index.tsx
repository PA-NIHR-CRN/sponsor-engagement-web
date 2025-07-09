import { zodResolver } from '@hookform/resolvers/zod'
import { Container, NotificationBanner, Table } from '@nihr-ui/frontend'
import clsx from 'clsx'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { type ReactElement, useCallback, useEffect, useState } from 'react'
import type { FieldError } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import { ErrorSummary, Form } from '@/components/atoms'
import { TextInput } from '@/components/atoms/Form/TextInput/TextInput'
import { RootLayout } from '@/components/organisms'
import { Roles } from '@/constants'
import { useFormErrorHydration } from '@/hooks/useFormErrorHydration'
import { getContactManagerUsers } from '@/lib/contactManager'
import { isContactManager, isContactManagerAndSponsorContact } from '@/utils/auth'
import { formatDate } from '@/utils/date'
import type { ContactManagerAddInputs } from '@/utils/schemas'
import { contactManagerAddSchema } from '@/utils/schemas'
import { withServerSideProps } from '@/utils/withServerSideProps'

export type ContactManagerProps = InferGetServerSidePropsType<typeof getServerSideProps>

const renderNotificationBanner = (successType: number, email?: string) => (
  <NotificationBanner heading={`Contact ${successType === 1 ? 'added' : 'removed'}`} success>
    {successType === 1
      ? `${email} was added as a contact manager`
      : 'The selected contact has been removed as a conatact manager'}
  </NotificationBanner>
)

export default function ContactManager({ contactManagers }: ContactManagerProps) {
  const router = useRouter()

  const { register, formState, setError, handleSubmit, reset } = useForm<ContactManagerAddInputs>({
    resolver: zodResolver(contactManagerAddSchema),
  })

  const handleFoundError = useCallback(
    (field: keyof ContactManagerAddInputs, error: FieldError) => {
      setError(field, error)
    },
    [setError]
  )

  const { errors } = useFormErrorHydration<ContactManagerAddInputs>({
    schema: contactManagerAddSchema,
    formState,
    onFoundError: handleFoundError,
  })

  const { defaultValues } = formState

  const renderContactList = useCallback(
    () => (
      <Table>
        <Table.Caption className="govuk-visually-hidden">Contact Mangers</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.CellHeader className="w-1/4" column>
              Contact email
            </Table.CellHeader>
            <Table.CellHeader className="w-1/4" column>
              Date added
            </Table.CellHeader>
            <Table.CellHeader className="w-1/4" column>
              Actions
            </Table.CellHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {contactManagers.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>
                <div className="flex flex-col gap-2 w-fit">{formatDate(user.roles[0].updatedAt)}</div>
              </Table.Cell>
              <Table.Cell>
                <Link aria-label={`Remove ${user.email}`} href={`/contact-managers/remove-contact-manager/${user.id}`}>
                  Remove
                </Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    ),
    [contactManagers]
  )

  const [invitedEmail, setInvitedEmail] = useState<string | undefined>()

  const handleFormSubmission = (values: { emailAddress: string }) => {
    setInvitedEmail(values.emailAddress)
  }

  useEffect(() => {
    if (router.query.success) {
      reset()
    }
  }, [router.query.success])

  return (
    <Container>
      <NextSeo title="RDN and Devolved Administration Contact Managers" />
      <div className="lg:flex lg:gap-6">
        <div className="w-full">
          {Boolean(router.query.success) && renderNotificationBanner(Number(router.query.success), invitedEmail)}

          <h2 className="govuk-heading-l govuk-!-margin-bottom-2">RDN and Devolved Administration Contact Managers</h2>
          <p className="govuk-!-margin-bottom-9">
            This page allows current Contact Managers to either add or remove other Contact Managers. This page is NOT
            visible to Sponsor Contacts.
          </p>

          <h3 className="govuk-heading-m p-0 govuk-!-margin-bottom-4">Add or remove Contact Managers</h3>

          <p>
            Invite or remove new contact managers using the options below. When you have invited a new contact manager
            they will be able to view and manage sponsor contacts for all organisations. This is only for RDN and
            Devolved Administration users.
          </p>

          {/* Invite form */}
          <Form
            action="/api/forms/contactManager"
            handleSubmit={handleSubmit}
            method="post"
            onError={(message: string) => {
              setError('root.serverError', {
                type: '400',
                message,
              })
            }}
            onSuccess={handleFormSubmission}
          >
            <ErrorSummary errors={errors} />
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
          {contactManagers.length > 0 ? renderContactList() : <p>No contacts associated with this organisation</p>}
        </div>
      </div>
    </Container>
  )
}

ContactManager.getLayout = function getLayout(page: ReactElement, { user }: ContactManagerProps) {
  return <RootLayout user={user}>{page}</RootLayout>
}

export const getServerSideProps = withServerSideProps([Roles.ContactManager], async (context, session) => {
  if (!(isContactManager(session.user?.roles ?? []) || isContactManagerAndSponsorContact(session.user?.roles ?? []))) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }

  const contactManagers = await getContactManagerUsers()

  return {
    props: {
      query: context.query,
      user: session.user,
      contactManagers,
    },
  }
})
