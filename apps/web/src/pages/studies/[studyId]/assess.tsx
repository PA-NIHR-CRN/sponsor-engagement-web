import type { Document } from '@contentful/rich-text-types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Container } from '@nihr-ui/frontend'
import clsx from 'clsx'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { type ReactElement, useCallback } from 'react'
import type { FieldError } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import type { TypeSetAssessmentFormPageSkeleton, TypeSetPageSkeleton } from '@/@types/generated'
import { Checkbox, CheckboxGroup, ErrorSummary, Fieldset, Form, Radio, RadioGroup } from '@/components/atoms'
import { Textarea } from '@/components/atoms/Form/Textarea/Textarea'
import { AssessmentHistory, getAssessmentHistoryFromStudy, RequestSupport, StudyDetails } from '@/components/molecules'
import { RootLayout } from '@/components/organisms'
import { Roles } from '@/constants'
import { TEXTAREA_MAX_CHARACTERS } from '@/constants/forms'
import { useFormErrorHydration } from '@/hooks/useFormErrorHydration'
import { getManagedContent} from '@/lib/contentful/contentfulService'
import { prismaClient } from '@/lib/prisma'
import { getStudyById } from '@/lib/studies'
import { getValuesFromSearchParams } from '@/utils/form'
import { RichTextRenderer } from '@/utils/Renderers/RichTextRenderer/RichTextRenderer'
import { AssessmentInputs, assessmentSchema } from '@/utils/schemas/assessment.schema'
import { withServerSideProps } from '@/utils/withServerSideProps'

export type AssessmentProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Assessment({
  query,
  study,
  statuses,
  furtherInformation,
  returnUrl,
  assessments,
  managedContent,
  // contentfulTestContent,
  // contentfulTestContentFields
}: AssessmentProps) {
  const studyHasNotRecruitedWithinSixMonths = study.evaluationCategories.some(indicator => indicator.indicatorValue === 'No recruitment in past 6 months')

  const {
    register,
    formState,
    setError,
    handleSubmit,
  } = useForm<AssessmentInputs>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      ...getValuesFromSearchParams(assessmentSchema, query),
      studyId: String(study.id),
      studyHasNotRecruitedWithinSixMonths: studyHasNotRecruitedWithinSixMonths ? 'true' : 'false',
      reasonForNoRecruitment: null,
    },
    shouldUnregister: true,
  })

  const handleFoundError = useCallback(
    (field: keyof AssessmentInputs, error: FieldError) => {
      setError(field, error)
    },
    [setError]
  )

  const { errors } = useFormErrorHydration<AssessmentInputs>({
    schema: assessmentSchema,
    formState,
    onFoundError: handleFoundError,
  })

  const { defaultValues } = formState

  const { organisationsByRole } = study

  const supportOrgName = organisationsByRole.CRO ?? organisationsByRole.CTU

  function getStudyRadioDescription(id: number, description: string): string  {
    switch (id) {
      case 1:
        // on track
        return managedContent?.guidanceTextOnTrack as string
      case 2:
        //off track
        return managedContent?.guidanceTextOffTrack as string
      default:
        return description
    }
  }

  return (
    <Container>
      <NextSeo title="Study Progress Review - Assess progress of study" />
      <div className="lg:flex lg:gap-6">
        <div className="w-full">
          <h2 className="govuk-heading-l govuk-!-margin-bottom-4">{managedContent?.pageTitle.toString()}</h2>

          <div className="govuk-body govuk-!-margin-bottom-6">
            <RichTextRenderer>{managedContent?.pageDescription as Document}</RichTextRenderer>
          </div>

          <div className="text-darkGrey govuk-!-margin-bottom-0 govuk-body-s">
            <span className="govuk-visually-hidden">Study sponsor: </span>
            {organisationsByRole.Sponsor}
            {Boolean(supportOrgName) && ` (${supportOrgName})`}
          </div>

          <h3 className="govuk-heading-m govuk-!-margin-bottom-1">
            <span className="govuk-visually-hidden">Study title: </span>
            {study.title}
          </h3>

          <Accordion className="w-full govuk-!-margin-bottom-3" type="multiple">
            <AccordionItem className="border-none" value="details-1">
              <AccordionTrigger>Show study details</AccordionTrigger>
              <AccordionContent>
                <StudyDetails study={study} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <p className="govuk-body govuk-!-margin-bottom-4">All fields are required unless labelled as optional.</p>

          <AssessmentHistory
            assessments={assessments.length > 0 ? [assessments[0]] : []}
            heading="Last sponsor assessment"
          />

          <Form
            action={`/api/forms/assessment?returnUrl=${returnUrl}`}
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

            <input type="hidden" {...register('studyId')} defaultValue={defaultValues?.studyId} />

            <input type="hidden" {...register('studyHasNotRecruitedWithinSixMonths')} />
            <Fieldset>
              {/* Status */}
              <RadioGroup
                defaultValue=''
                errors={errors}
                label={managedContent?.studyProgressionQuestionLabel.toString()}
                {...register('status')}
              >
                {statuses.map(({ id, name, description }) => (
                  <Radio hint={getStudyRadioDescription(id, description)} key={id} label={name} value={String(id)} />
                ))}
              </RadioGroup>

              {/* Reason for no recruitment in the last 6 months text */}
              {studyHasNotRecruitedWithinSixMonths ?

                <Textarea
                  defaultValue=''
                  {...register('reasonForNoRecruitment')}
                  errors={errors}
                  label="Study has not recruited for 6 months"
                  hint="Provide reasoning for no recruitment"
                  maxLength={TEXTAREA_MAX_CHARACTERS}
                  required
                />
                : null}

              {/* Further information */}
              <CheckboxGroup
                defaultValue={
                  defaultValues?.furtherInformation && Array.isArray(defaultValues.furtherInformation)
                    ? defaultValues.furtherInformation
                    : []
                }
                errors={errors}
                label={managedContent?.additionalInfoLabel.toString()}
                required={false}
                {...register('furtherInformation')}
              >
                {furtherInformation.map(({ id, name }) => (
                  <Checkbox key={id} label={name} value={String(id)} />
                ))}
              </CheckboxGroup>

              {/* Further information text */}
              <Textarea
                defaultValue={defaultValues?.furtherInformationText}
                errors={errors}
                label={
                  managedContent?.furtherInformationLabel ? (managedContent.furtherInformationLabel as string) : ''
                }
                required={false}
                maxLength={TEXTAREA_MAX_CHARACTERS}
                {...register('furtherInformationText')}
              />

              <div className="govuk-button-group">
                <button className={clsx('govuk-button', { 'pointer-events-none': formState.isLoading })} type="submit">
                  Submit assessment
                </button>
                <Link className="govuk-button govuk-button--secondary" href={`/${returnUrl}`}>
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

Assessment.getLayout = function getLayout(page: ReactElement, { user }: AssessmentProps) {
  return (
    <RootLayout
      breadcrumbConfig={{
        showBreadcrumb: true,
      }}
      user={user}
    >
      {page}
    </RootLayout>
  )
}

export const getServerSideProps = withServerSideProps([Roles.SponsorContact], async (context, session) => {
  const studyId = context.query.studyId

  if (!studyId) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }

  const userOrganisationIds = session.user?.organisations.map((userOrg) => userOrg.organisationId)

  const { data: study } = await getStudyById(Number(studyId), userOrganisationIds)

  const { CONTENTFUL_PAGE_STUDY_ASSESS_ID } = process.env
  const contentfulContent = await getManagedContent<TypeSetAssessmentFormPageSkeleton>(CONTENTFUL_PAGE_STUDY_ASSESS_ID)

  const managedContent = contentfulContent?.fields || null

  const [statusRefData, furtherInformationRefData] = await prismaClient.$transaction([
    prismaClient.sysRefAssessmentStatus.findMany(),
    prismaClient.sysRefAssessmentFurtherInformation.findMany({
      orderBy: [{ sortOrder: 'asc' }],
      where: {
        isDeleted: false,
      },
    }),
  ])

  if (!study) {
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
      study,
      assessments: getAssessmentHistoryFromStudy(study),
      statuses: statusRefData.map(({ id, name, description }) => ({ id, name, description })),
      furtherInformation: furtherInformationRefData.map(({ id, name }) => ({ id, name })),
      returnUrl: context.query.returnUrl === 'studies' ? 'studies' : `studies/${study.id}`,
      managedContent,
      // contentfulTestContent,
      // contentfulTestContentFields
    },
  }
})
