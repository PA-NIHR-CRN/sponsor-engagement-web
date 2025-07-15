import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Container } from '@nihr-ui/frontend'
import clsx from 'clsx'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { type ReactElement, useCallback } from 'react'
import type { FieldError } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import { ErrorSummary, Form } from '@/components/atoms'
import { RootLayout } from '@/components/organisms'
import { Roles } from '@/constants'
import { CONTACT_MANAGERS_PAGE } from '@/constants/routes'
import { useFormErrorHydration } from '@/hooks/useFormErrorHydration'
import { GetContactManagerEmail } from '@/lib/contactManager'
import type { RemoveContactManagerInputs } from '@/utils/schemas'
import { organisationRemoveContactSchema, removeContactManagerSchema } from '@/utils/schemas'
import { withServerSideProps } from '@/utils/withServerSideProps'

export type RemoveContactManagerProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function RemoveContact({ contactManagerUserId, contactManagerEmail }: RemoveContactManagerProps) {
  const { register, formState, setError, handleSubmit } = useForm<RemoveContactManagerInputs>({
    resolver: zodResolver(removeContactManagerSchema),
    defaultValues: {
      contactManagerUserId: String(contactManagerUserId),
    },
  })

  const handleFoundError = useCallback(
    (field: keyof RemoveContactManagerInputs, error: FieldError) => {
      setError(field, error)
    },
    [setError]
  )

  const { errors } = useFormErrorHydration<RemoveContactManagerInputs>({
    schema: organisationRemoveContactSchema,
    formState,
    onFoundError: handleFoundError,
  })

  return (
    <Container>
      <NextSeo title="RDN and Devolved Administration Contact Managers - remove contact manager" />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <ErrorSummary errors={errors} />
          <h2 className="govuk-heading-l">Are you sure you want to remove this contact manager?</h2>
          <p className="govuk-body-m">
            You are about to remove <strong> {contactManagerEmail?.email} </strong> from acting as a Contact Manager for
            the Sponsor Engagement Tool. This will mean they can no longer manage contacts on the tool. They will still
            have access to the Sponsor Engagement Tool if they are assigned as a Sponsor Contact to any specific
            organisations.
          </p>
          <Form
            action="/api/forms/removeContactManager"
            handleSubmit={handleSubmit}
            method="post"
            onError={(message: string) => {
              setError('root.serverError', {
                type: '400',
                message,
              })
            }}
          >
            <input defaultValue={contactManagerUserId} type="hidden" {...register('contactManagerUserId')} />

            <div className="govuk-button-group flex-col sm:gap-2 justify-start">
              <Button
                className={clsx('govuk-button', { 'pointer-events-none': formState.isLoading })}
                type="submit"
                warning
              >
                Yes I&apos;m sure — remove this contact
              </Button>
              <Link className="govuk-link govuk-link--no-visited-state" href={CONTACT_MANAGERS_PAGE}>
                Cancel
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  )
}

RemoveContact.getLayout = function getLayout(page: ReactElement, { user }: RemoveContactManagerProps) {
  return <RootLayout user={user}>{page}</RootLayout>
}

export const getServerSideProps = withServerSideProps([Roles.ContactManager], async ({ query }, session) => {
  const userId = Number(query.userId)
  const user = session.user
  const contactManagerEmail = await GetContactManagerEmail(userId)

  if (!(userId && user)) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }

  return {
    props: {
      contactManagerUserId: userId,
      contactManagerEmail,
      user,
    },
  }
})
