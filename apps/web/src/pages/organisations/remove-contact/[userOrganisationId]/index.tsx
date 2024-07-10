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
import { useFormErrorHydration } from '@/hooks/useFormErrorHydration'
import { getUserOrganisationById } from '@/lib/organisations'
import type { OrganisationRemoveContactInputs } from '@/utils/schemas'
import { organisationRemoveContactSchema } from '@/utils/schemas'
import { withServerSideProps } from '@/utils/withServerSideProps'

export type RemoveContactProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function RemoveContact({ userOrganisation }: RemoveContactProps) {
  const { register, formState, setError, handleSubmit } = useForm<OrganisationRemoveContactInputs>({
    resolver: zodResolver(organisationRemoveContactSchema),
    defaultValues: {
      userOrganisationId: `${userOrganisation.id}`,
    },
  })

  const handleFoundError = useCallback(
    (field: keyof OrganisationRemoveContactInputs, error: FieldError) => {
      setError(field, error)
    },
    [setError]
  )

  const { errors } = useFormErrorHydration<OrganisationRemoveContactInputs>({
    schema: organisationRemoveContactSchema,
    formState,
    onFoundError: handleFoundError,
  })

  return (
    <Container>
      <NextSeo title="Manage organisation contacts - remove contact" />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <ErrorSummary errors={errors} />
          <h2 className="govuk-heading-l">Are you sure you want to remove this contact?</h2>
          <p className="govuk-body-m">
            You are about to remove <strong>{userOrganisation.user.email}</strong> from acting as a Sponsor Contact for
            the organisation <strong>{userOrganisation.organisation.name}</strong>. This will mean they can no longer
            view or assess studies for this organisation. They will still have access to studies for any other
            organisation they are assigned to.
          </p>
          <p className="govuk-body-m">
            Are you sure you want to remove this contact from {userOrganisation.organisation.name}? If you proceed, they
            will receive an email notification confirming this.
          </p>
          <Form
            action="/api/forms/removeContact"
            handleSubmit={handleSubmit}
            method="post"
            onError={(message: string) => {
              setError('root.serverError', {
                type: '400',
                message,
              })
            }}
          >
            <input defaultValue={userOrganisation.id} type="hidden" {...register('userOrganisationId')} />
            <div className="govuk-button-group flex-col sm:gap-2 justify-start">
              <Button
                className={clsx('govuk-button', { 'pointer-events-none': formState.isLoading })}
                type="submit"
                warning
              >
                Yes I&apos;m sure — remove this contact
              </Button>
              <Link
                className="govuk-link govuk-link--no-visited-state"
                href={`/organisations/${userOrganisation.organisation.id}`}
              >
                Cancel
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </Container>
  )
}

RemoveContact.getLayout = function getLayout(page: ReactElement, { user }: RemoveContactProps) {
  return <RootLayout user={user}>{page}</RootLayout>
}

export const getServerSideProps = withServerSideProps(Roles.ContactManager, async ({ query }, session) => {
  const userOrganisationId = Number(query.userOrganisationId)

  if (!userOrganisationId) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }

  const userOrganisation = await getUserOrganisationById(userOrganisationId)

  if (!userOrganisation) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }

  return {
    props: {
      user: session.user,
      userOrganisation,
    },
  }
})
