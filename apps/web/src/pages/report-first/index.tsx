import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@nihr-ui/frontend'
import clsx from 'clsx'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { type ReactElement, useCallback } from 'react'
import type { FieldError } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import { DateInput, Fieldset, Form, Radio, RadioGroup } from '@/components/atoms'
import { Textarea } from '@/components/atoms/Form/Textarea/Textarea'
import { RequestSupport } from '@/components/molecules'
import { RootLayout } from '@/components/organisms'
import { Roles } from '@/constants'
import { TEXTAREA_MAX_CHARACTERS } from '@/constants/forms'
import { useFormErrorHydration } from '@/hooks/useFormErrorHydration'
import { getStudyTitlesForOrgs } from '@/lib/studies'
import { reportFirstSchema, type ReportFirstInputs } from '@/utils/schemas/reportFirst.schema'
import { withServerSideProps } from '@/utils/withServerSideProps'
import type { DateInputValue } from '@/components/atoms/Form/DateInput/types'
import { TextInput } from '@/components/atoms/Form/TextInput/TextInput'
import { Select } from '@/components/atoms/Form/Select/Select'

export type ReportFirstProps = InferGetServerSidePropsType<typeof getServerSideProps>

const renderBackLink = (returnUrl: string) => (
  <div className="ml-8 govuk-!-padding-top-3">
    <Container>
      <Link className="govuk-back-link govuk-!-font-size-19 font-light" href={returnUrl}>
        Back
      </Link>
    </Container>
  </div>
)

export default function ReportFirst({ studies, initialStudyId, returnUrl }: Readonly<ReportFirstProps>) {
  const {
    register,
    formState,
    setError,
    handleSubmit,
    watch,
    setValue,
  } = useForm<ReportFirstInputs>({
    resolver: zodResolver(reportFirstSchema),
    defaultValues: {
      studyId: initialStudyId || '',
      siteName: '',
      piTitle: '',
      piFirstName: '',
      piLastName: '',
      piEmail: '',
    },
  })

  const siteNameText = watch('siteName') ?? ''

  const remainingCharacters =
    siteNameText.length >= TEXTAREA_MAX_CHARACTERS
      ? 0
      : TEXTAREA_MAX_CHARACTERS - siteNameText.length

  const handleFoundError = useCallback(
    (field: keyof ReportFirstInputs, error: FieldError) => {
      setError(field, error)
    },
    [setError]
  )

  const { errors } = useFormErrorHydration<ReportFirstInputs>({
    schema: reportFirstSchema,
    formState,
    onFoundError: handleFoundError,
  })

  return (
    <Container>
      <NextSeo title="Report a First" />

      <div className="lg:flex lg:gap-6">
        <div className="w-full">
          <h2 className="govuk-heading-l govuk-!-margin-bottom-6">Report a 'First'</h2>

          <p className="govuk-body govuk-!-margin-bottom-6">
            Reporting a first helps us capture key study milestones quickly and accurately.
            Your direct submission reduces follow‑up emails, improves data quality, and ensures important achievements - such as global
            or European firsts - are recorded and linked to wider systems in real time.
          </p>

          <Form
            action={`/api/forms/reportFirst?returnUrl=${encodeURIComponent(returnUrl)}`}
            handleSubmit={handleSubmit}
            method="post"
            onError={(message: string) => {
              setError('root' as any, { type: '400', message } as any)
            }}
          >
            <Fieldset>
              <Select
                label="Select study"
                labelSize="m"
                errors={errors}
                required
                defaultValue={initialStudyId || ''}
                {...register('studyId')}
                options={[
                  <option key="placeholder" value="">
                    Select a study
                  </option>,
                  ...studies.map((study) => (
                    <option key={study.id} value={String(study.id)}>
                      {study.shortTitle}
                    </option>
                  )),
                ]}
              />

              <RadioGroup
                errors={errors}
                label="Type of First"
                labelSize="m"
                {...register('type')}
              >
                <Radio
                  label="Global"
                  value="global"
                  hint="The UK has consented the first participant in a global study."
                />
                <Radio
                  label="European"
                  value="european"
                  hint="The UK has consented the first participant in a European study."
                />
              </RadioGroup>

              <DateInput
                label="First patient / First visit"
                name="firstAt"
                hint="The date the first participant was consented to the study"
                errors={errors}
                onChange={(value: DateInputValue) => {
                  setValue('firstAt', value as any, { shouldValidate: true, shouldDirty: true })
                }}
              />

              <Textarea
                {...register('siteName')}
                defaultValue=""
                errors={errors}
                hint="Name of site that consented the first global/European participant"
                label="Site name"
                labelSize="m"
                maxLength={TEXTAREA_MAX_CHARACTERS}
                remainingCharacters={remainingCharacters}
                required
              />

              <h3 className="govuk-heading-m govuk-!-margin-bottom-4 govuk-!-margin-top-8">
                Principal Investigator Details
              </h3>

              <TextInput
                label="Title"
                labelSize="m"
                errors={errors}
                {...register('piTitle')}
              />

              <TextInput
                label="First name"
                labelSize="m"
                errors={errors}
                {...register('piFirstName')}
              />

              <TextInput
                label="Last name"
                labelSize="m"
                errors={errors}
                {...register('piLastName')}
              />

              <TextInput
                label="Email address"
                labelSize="m"
                errors={errors}
                {...register('piEmail')}
              />

              <div className="govuk-button-group">
                <button
                  className={clsx('govuk-button', { 'pointer-events-none': formState.isLoading })}
                  type="submit"
                >
                  Submit
                </button>

                <Link className="govuk-button govuk-button--secondary" href={returnUrl}>
                  Go back
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

ReportFirst.getLayout = function getLayout(page: ReactElement, props: ReportFirstProps) {
  const safeReturnUrl = props.returnUrl ?? '/studies'
  return (
    <RootLayout backLink={renderBackLink(safeReturnUrl)} user={props.user}>
      {page}
    </RootLayout>
  )
}

export const getServerSideProps = withServerSideProps([Roles.SponsorContact], async (context, session) => {
    try {
        if (!session.user?.organisations.length) {
            return {
                redirect: { destination: '/' },
            }
        }

        const organisationIds = session.user.organisations.map((userOrg) => userOrg.organisationId)

        const studies = await getStudyTitlesForOrgs({ organisationIds })

        const studyIdFromQuery =
            typeof context.query.studyId === 'string' ? context.query.studyId : ''

        const allowedIds = new Set(studies.data.map((s) => String(s.id)))
        const initialStudyId = allowedIds.has(studyIdFromQuery) ? studyIdFromQuery : ''

        return {
            props: {
                user: session.user,
                studies: studies.data,
                initialStudyId,
                returnUrl:
                    context.query.returnUrl === 'studies'
                        ? 'studies'
                        : `studies/${initialStudyId}/`,
            },
        }
    } catch (error) {
        return {
            redirect: { destination: '/500' },
        }
    }
})
