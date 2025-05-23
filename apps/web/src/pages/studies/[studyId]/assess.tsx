import { zodResolver } from '@hookform/resolvers/zod'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Container } from '@nihr-ui/frontend'
import clsx from 'clsx'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { type ReactElement, useCallback } from 'react'
import type { FieldError } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import { Checkbox, CheckboxGroup, ErrorSummary, Fieldset, Form, Radio, RadioGroup } from '@/components/atoms'
import { Textarea } from '@/components/atoms/Form/Textarea/Textarea'
import { AssessmentHistory, getAssessmentHistoryFromStudy, RequestSupport, StudyDetails } from '@/components/molecules'
import { RootLayout } from '@/components/organisms'
import { Roles } from '@/constants'
import { TEXTAREA_MAX_CHARACTERS } from '@/constants/forms'
import { useFormErrorHydration } from '@/hooks/useFormErrorHydration'
import { prismaClient } from '@/lib/prisma'
import { getStudyById } from '@/lib/studies'
import { getValuesFromSearchParams } from '@/utils/form'
import type { AssessmentInputs } from '@/utils/schemas/assessment.schema'
import { assessmentSchema } from '@/utils/schemas/assessment.schema'
import { withServerSideProps } from '@/utils/withServerSideProps'

export type AssessmentProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Assessment({
  query,
  study,
  statuses,
  furtherInformation,
  returnUrl,
  assessments,
}: AssessmentProps) {
  const { register, formState, setError, watch, handleSubmit } = useForm<AssessmentInputs>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      ...getValuesFromSearchParams(assessmentSchema, query),
      studyId: String(study.id),
    },
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

  // Watch & update the character count for the "Support summary" textarea
  const furtherInformationText = watch('furtherInformationText') ?? ''
  const remainingCharacters =
    furtherInformationText.length >= TEXTAREA_MAX_CHARACTERS
      ? 0
      : TEXTAREA_MAX_CHARACTERS - furtherInformationText.length

  const { defaultValues } = formState

  const { organisationsByRole } = study

  const supportOrgName = organisationsByRole.CRO ?? organisationsByRole.CTU

  return (
    <Container>
      <NextSeo title="Study Progress Review - Assess progress of study" />
      <div className="lg:flex lg:gap-6">
        <div className="w-full">
          <h2 className="govuk-heading-l govuk-!-margin-bottom-4">Assess progress of a study in the UK</h2>

          <p className="govuk-body govuk-!-margin-bottom-6">
            You will need to assess if the study is on or off track in the UK and if any action is being taken. If you
            need NIHR RDN support with this study you will need to request this separately.
          </p>

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

            <Fieldset>
              {/* Status */}
              <RadioGroup
                defaultValue={defaultValues?.status}
                errors={errors}
                label="Is this study progressing in the UK as planned?"
                {...register('status')}
              >
                {statuses.map(({ id, name, description }) => (
                  <Radio hint={description} key={id} label={name} value={String(id)} />
                ))}
              </RadioGroup>

              {/* Further information */}
              <CheckboxGroup
                defaultValue={
                  defaultValues?.furtherInformation && Array.isArray(defaultValues.furtherInformation)
                    ? defaultValues.furtherInformation
                    : []
                }
                errors={errors}
                label="Is there any additional information that would help NIHR RDN understand this progress assessment? (optional)"
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
                label="Further information (optional)"
                remainingCharacters={remainingCharacters}
                required={false}
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
    },
  }
})
