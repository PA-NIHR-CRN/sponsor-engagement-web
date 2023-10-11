import { useCallback, type ReactElement } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Container } from '@nihr-ui/frontend'
import { zodResolver } from '@hookform/resolvers/zod'
import type { InferGetServerSidePropsType } from 'next'
import { NextSeo } from 'next-seo'
import type { FieldError } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'
import Link from 'next/link'
import { RootLayout } from '../../../components/Layout/RootLayout'
import { GetSupport } from '../../../components/molecules'
import { getStudyById } from '../../../lib/studies'
import { Checkbox, CheckboxGroup, ErrorSummary, Fieldset, Form, Radio, RadioGroup } from '../../../components/atoms'
import type { AssessmentInputs } from '../../../utils/schemas/assessment.schema'
import { assessmentSchema } from '../../../utils/schemas/assessment.schema'
import { prismaClient } from '../../../lib/prisma'
import { Textarea } from '../../../components/atoms/Form/Textarea/Textarea'
import { TEXTAREA_MAX_CHARACTERS } from '../../../constants/forms'
import { formatDate } from '../../../utils/date'
import { withServerSideProps } from '../../../utils/withServerSideProps'
import { getValuesFromSearchParams } from '../../../utils/form'
import { useFormErrorHydration } from '../../../hooks/useFormErrorHydration'

export type AssessmentProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Assessment({
  query,
  study,
  statuses,
  furtherInformation,
  returnUrl,
  lastAssessment,
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

  return (
    <Container>
      <NextSeo title="Study Progress Review - Assess progress of study" />
      <div className="lg:flex lg:gap-6">
        <div className="w-full">
          <h2 className="govuk-heading-l govuk-!-margin-bottom-4">Assess progress of a study</h2>

          <p className="govuk-body">
            You will need to assess if the study is on or off track and if any action is being taken. If you need NIHR
            CRN support with this study you will need to request this separately.
          </p>

          <div className="text-darkGrey govuk-!-margin-bottom-0 govuk-body-s">
            {study.organisations[0].organisation.name}
          </div>

          <h3 className="govuk-heading-m govuk-!-margin-bottom-3">{study.name}</h3>

          <Accordion className="w-full govuk-!-margin-bottom-3" type="multiple">
            <AccordionItem className="border-none" value="details-1">
              <AccordionTrigger>Show study details</AccordionTrigger>
              <AccordionContent>todo</AccordionContent>
            </AccordionItem>
          </Accordion>

          <h3 className="govuk-heading-m govuk-!-margin-bottom-3">Last sponsor assessment</h3>

          {lastAssessment ? (
            <Accordion className="w-full govuk-!-margin-bottom-4" type="multiple">
              <AccordionItem value="assessment-1">
                <AccordionTrigger
                  sideContent={
                    <span>
                      <strong>{lastAssessment.status}</strong> assessed by {lastAssessment.createdBy}
                    </span>
                  }
                >
                  {lastAssessment.createdAt}
                </AccordionTrigger>
                <AccordionContent indent>
                  <ul aria-label="Further information" className="govuk-list govuk-list--bullet govuk-body-s">
                    {lastAssessment.furtherInformation.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="govuk-body-s govuk-!-margin-bottom-0">{lastAssessment.furtherInformationText}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <p className="govuk-body">This study has not had any assessments provided</p>
          )}

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
                label="Is this study progressing as planned?"
                {...register('status')}
              >
                {statuses.map(({ id, name, description }) => (
                  <Radio hint={description} key={id} label={name} value={String(id)} />
                ))}
              </RadioGroup>

              {/* Further information */}
              <CheckboxGroup
                defaultValue=""
                errors={errors}
                label="Is there any additional information that would help NIHR CRN understand this progress assessment?"
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
          <GetSupport />
        </div>
      </div>
    </Container>
  )
}

Assessment.getLayout = function getLayout(page: ReactElement, { user }: AssessmentProps) {
  return <RootLayout user={user}>{page}</RootLayout>
}

export const getServerSideProps = withServerSideProps(async (context, session) => {
  const studyId = context.query.studyId

  if (!studyId) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }

  const userOrganisationIds = session.user?.organisations.map((org) => org.id)

  const [study, statusRefData, furtherInformationRefData] = await prismaClient.$transaction([
    getStudyById(Number(studyId), userOrganisationIds),
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

  const lastAssessment =
    study.assessments.length > 0
      ? {
          status: study.assessments[0].status.name,
          createdAt: formatDate(study.assessments[0].createdAt),
          createdBy: study.assessments[0].createdBy.email,
          furtherInformation: study.assessments[0].furtherInformation
            .filter(({ furtherInformationText }) => !furtherInformationText)
            .map(({ furtherInformation }) => furtherInformation?.name),
          furtherInformationText: study.assessments[0].furtherInformation.find(({ furtherInformationText }) =>
            Boolean(furtherInformationText)
          )?.furtherInformationText,
        }
      : null

  return {
    props: {
      query: context.query,
      user: session.user,
      study,
      statuses: statusRefData.map(({ id, name, description }) => ({ id, name, description })),
      furtherInformation: furtherInformationRefData.map(({ id, name }) => ({ id, name })),
      returnUrl: context.query.returnUrl === 'studies' ? 'studies' : `studies/${study.id}`,
      lastAssessment,
    },
  }
})
