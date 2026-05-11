import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@nihr-ui/frontend'
import clsx from 'clsx'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { type ReactElement, useCallback, useEffect } from 'react'
import type { FieldError } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import { Fieldset, Form, Radio, RadioGroup } from '@/components/atoms'
import { Textarea } from '@/components/atoms/Form/Textarea/Textarea'
import { RequestSupport } from '@/components/molecules'
import { RootLayout } from '@/components/organisms'
import { Roles } from '@/constants'
import { TEXTAREA_MAX_CHARACTERS } from '@/constants/forms'
import { useFormErrorHydration } from '@/hooks/useFormErrorHydration'
import { getStudyById } from '@/lib/studies'
import type { ConfigureInputs } from '@/utils/schemas/configure.schema'
import { configureSchema } from '@/utils/schemas/configure.schema'
import { withServerSideProps } from '@/utils/withServerSideProps'

export type ConfigureProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Configure({ study, returnUrl }: Readonly<ConfigureProps>) {
  const {
    register,
    formState,
    setError,
    handleSubmit,
    watch,
    setValue,
  } = useForm<ConfigureInputs>({
    resolver: zodResolver(configureSchema),
    defaultValues: {
      studyId: String(study.id),
      status: study.willRecruitWithinTimeline ? 'true' : 'false',
      noReason: study.reasonNotRecruitingWithinTimeline,
    },
  })

  const status = watch('status')
  const noReasonText = watch('noReason') ?? ''

  const remainingCharacters =
    noReasonText.length >= TEXTAREA_MAX_CHARACTERS
      ? 0
      : TEXTAREA_MAX_CHARACTERS - noReasonText.length

  // Clear conditional field when switching back to "Yes"
  useEffect(() => {
    if (status === 'true') {
      setValue('noReason', null)
    }
  }, [status, setValue])

  const handleFoundError = useCallback(
    (field: keyof ConfigureInputs, error: FieldError) => {
      setError(field, error)
    },
    [setError]
  )

  const { errors } = useFormErrorHydration<ConfigureInputs>({
    schema: configureSchema,
    formState,
    onFoundError: handleFoundError,
  })

  const { organisationsByRole } = study
  const supportOrgName = organisationsByRole.CRO ?? organisationsByRole.CTU

  return (
    <Container>
      <NextSeo title="Study Progress Review - Configure Progress of Study Setup" />

      <div className="lg:flex lg:gap-6">
        <div className="w-full">
          <h2 className="govuk-heading-l govuk-!-margin-bottom-4">
            Configure Progress of Study Setup
          </h2>

          <div className="govuk-body-s govuk-!-margin-bottom-0 text-darkGrey">
            <span className="govuk-visually-hidden">Study sponsor: </span>
            {organisationsByRole.Sponsor}
            {supportOrgName ? ` (${supportOrgName})` : null}
          </div>

          <h3 className="govuk-heading-m govuk-!-margin-bottom-1">
            <span className="govuk-visually-hidden">Study title: </span>
            {study.title}
          </h3>

          <div className="govuk-inset-text">
            Selecting a timeline confirms whether the study should be monitored against that timeframe.
            Missing an agreed timeline without mitigation or exemption may affect eligibility for funding
            or support. Refer to the <Link href="/">Terms and Conditions</Link> guidance for more information.
          </div>

          <Form
            action={`/api/forms/configureStudy?returnUrl=${returnUrl}`}
            handleSubmit={handleSubmit}
            method="post"
            onError={(message: string) =>
              { setError('root.serverError', { type: '400', message }); }
            }
          >
            <input type="hidden" {...register('studyId')} />

            <Fieldset>
              <RadioGroup
                errors={errors}
                hint="Will you achieve this in 90 days?"
                label="Do you expect to achieve the first participant in this timeline?"
                labelSize="m"
                {...register('status')}
              >
                <Radio label="Yes" value="true" />
                <Radio label="No" value="false" />
              </RadioGroup>

              {status === 'false' && (
                <Textarea
                  {...register('noReason')}
                  defaultValue=''
                  errors={errors}
                  hint="If needed, provide further context or justification for changes made above."
                  label="If ‘No’ briefly explain why"
                  labelSize="m"
                  maxLength={TEXTAREA_MAX_CHARACTERS}
                  remainingCharacters={remainingCharacters}
                  required
                />
              )}

              <div className="govuk-button-group">
                <button
                  className={clsx('govuk-button', {
                    'pointer-events-none': formState.isLoading,
                  })}
                  type="submit"
                >
                  Update
                </button>

                <Link
                  className="govuk-button govuk-button--secondary"
                  href={`/${returnUrl}`}
                >
                  Cancel
                </Link>
              </div>
            </Fieldset>
          </Form>
        </div>

        <div className="lg:min-w-[300px] lg:max-w-[300px]">
          <RequestSupport showCallToAction sticky />
        </div>
      </div>
    </Container>
  )
}

Configure.getLayout = function getLayout(page: ReactElement, { user }: ConfigureProps) {
  return (
    <RootLayout breadcrumbConfig={{ showBreadcrumb: true }} user={user}>
      {page}
    </RootLayout>
  )
}

export const getServerSideProps = withServerSideProps(
  [Roles.SponsorContact],
  async (context, session) => {
    const studyId = Number(context.query.studyId)

    if (!studyId) {
      return { redirect: { destination: '/404' } }
    }

    const userOrganisationIds =
      session.user?.organisations.map(({ organisationId }) => organisationId)

    const { data: study } = await getStudyById(studyId, userOrganisationIds)

    if (!study) {
      return { redirect: { destination: '/404' } }
    }

    return {
      props: {
        query: context.query,
        user: session.user,
        study,
        returnUrl:
          context.query.returnUrl === 'studies'
            ? 'studies'
            : `studies/${study.id}/`,
      },
    }
  }
)