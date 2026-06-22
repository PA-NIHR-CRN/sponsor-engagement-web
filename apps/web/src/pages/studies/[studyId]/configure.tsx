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
import { RequestSupport, StudyProgressExtended } from '@/components/molecules'
import { RootLayout } from '@/components/organisms'
import { Roles } from '@/constants'
import { TEXTAREA_MAX_CHARACTERS } from '@/constants/forms'
import { useFormErrorHydration } from '@/hooks/useFormErrorHydration'
import { getStudyById } from '@/lib/studies'
import type { ConfigureInputs } from '@/utils/schemas/configure.schema'
import { configureSchema } from '@/utils/schemas/configure.schema'
import { withServerSideProps } from '@/utils/withServerSideProps'
import { getSetPageByKey } from '@/lib/contentful/contentfulService'
import { TypeSetPageSkeleton } from '@/@types/generated'
import { ContentfulPage } from '@/constants/contentful/pages'
import { RichTextRenderer } from '@/utils/Renderers/RichTextRenderer/RichTextRenderer'
import type { Document } from '@contentful/rich-text-types'
import { mapDynamicManagedContent } from '@/lib/contentful/contentfulUtils'
import { ContentfulEntries } from '@/constants/contentful/entries'

export type ConfigureProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Configure({ study, returnUrl, managedContent, progressBarManagedContent,managedContentFields }: Readonly<ConfigureProps>) {
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
            {managedContent?.title.toString()}
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
            <RichTextRenderer>{managedContent?.guidanceText as Document}</RichTextRenderer>
          </div>

          <StudyProgressExtended
            hraApprovalDate={study.hraApprovalDate}
            studyStatus={study.studyStatus}
            willRecruitWithinTimeline={study.willRecruitWithinTimeline}
            progressBarManagedContent={progressBarManagedContent}
          />

          <Form
            action={`/api/forms/configureStudy?returnUrl=${returnUrl}`}
            handleSubmit={handleSubmit}
            method="post"
            onError={(message: string) => { setError('root.serverError', { type: '400', message }); }
            }
          >
            <input type="hidden" {...register('studyId')} />

            <Fieldset>
              <RadioGroup
                errors={errors}
                hint={managedContentFields.get(ContentfulEntries.CONFIGURE_STUDY_SUB_QUESTION)?.toString()}
                label={managedContentFields.get(ContentfulEntries.CONFIGURE_STUDY_SETUP_QUESTION)?.toString()}
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
                  label={managedContentFields.get(ContentfulEntries.CONFIGURE_STUDY_SETUP_CONDITIONAL_BOX)?.toString()}
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

    const progressBarManagedContent = await getSetPageByKey<TypeSetPageSkeleton>(ContentfulPage.PROGRESS_BAR)
    const managedContentResp = await getSetPageByKey<TypeSetPageSkeleton>(ContentfulPage.CONFIGURE_STUDY_SETUP)
    const managedContent = managedContentResp?.fields
    const managedContentFields = mapDynamicManagedContent(managedContent?.managedContent)

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
        managedContent,
        progressBarManagedContent,
        managedContentFields
      },
    }
  }
)