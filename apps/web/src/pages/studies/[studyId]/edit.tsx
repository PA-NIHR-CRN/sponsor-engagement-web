import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@nihr-ui/frontend'
import { logger } from '@nihr-ui/logger'
import clsx from 'clsx'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import type { FieldError } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import { ErrorSummary, Fieldset, Form, Radio, RadioGroup } from '@/components/atoms'
import { DateInput } from '@/components/atoms/Form/DateInput/DateInput'
import type { DateInputValue } from '@/components/atoms/Form/DateInput/types'
import { Textarea } from '@/components/atoms/Form/Textarea/Textarea'
import { TextInput } from '@/components/atoms/Form/TextInput/TextInput'
import Spinner from '@/components/atoms/Spinner/Spinner'
import Warning from '@/components/atoms/Warning/Warning'
import { RequestSupport } from '@/components/molecules'
import { RootLayout } from '@/components/organisms'
import { Roles } from '@/constants'
import {
  fieldNameToLabelMapping,
  FURTHER_INFO_MAX_CHARACTERS,
  GENERIC_STUDIES_GUIDANCE_TEXT,
  PAGE_TITLE,
  statusMap,
  studyStatuses,
} from '@/constants/editStudyForm'
import { useFormErrorHydration } from '@/hooks/useFormErrorHydration'
import { getStudyByIdFromCPMS } from '@/lib/cpms/studies'
import {
  getStudyById,
  mapCPMSStatusToFormStatus,
  mapCPMSStudyEvalToSEEval,
  mapCPMSStudyToSEStudy,
  mapFormStatusToCPMSStatus,
  setStudyAssessmentDueFlag,
  updateEvaluationCategories,
  updateStudy,
} from '@/lib/studies'
import { areAllDatePartsEmpty } from '@/utils/date'
import { getOptionalFormFields, getVisibleFormFields, mapStudyToStudyFormInput } from '@/utils/editStudyForm'
import { getValuesFromSearchParams } from '@/utils/form'
import type { EditStudy as EditStudySchema, EditStudyInputs } from '@/utils/schemas'
import { studySchema } from '@/utils/schemas'
import { withServerSideProps } from '@/utils/withServerSideProps'

export type EditStudyProps = InferGetServerSidePropsType<typeof getServerSideProps>

const transformDateValue = (input?: DateInputValue | null) => ({
  day: input?.day ?? '',
  month: input?.month ?? '',
  year: input?.year ?? '',
})

export default function EditStudy({ study, currentLSN, query }: EditStudyProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  const mappedFormInput =
    Object.keys(query).length === 1 ? mapStudyToStudyFormInput(study) : getValuesFromSearchParams(studySchema, query)

  const { register, formState, handleSubmit, control, watch, setError } = useForm<EditStudySchema>({
    resolver: zodResolver(studySchema),
    defaultValues: {
      ...mappedFormInput,
      originalValues: mappedFormInput,
      LSN: currentLSN,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  })

  const { organisationsByRole } = study

  const supportOrgName = organisationsByRole.CRO ?? organisationsByRole.CTU ?? organisationsByRole.Sponsor

  const { defaultValues } = formState

  // Watch & update the character count for the "Further information" textarea
  const furtherInformationText = watch('furtherInformation') ?? ''
  const remainingCharacters =
    furtherInformationText.length >= FURTHER_INFO_MAX_CHARACTERS
      ? 0
      : FURTHER_INFO_MAX_CHARACTERS - furtherInformationText.length

  const handleFoundError = useCallback(
    (field: keyof EditStudyInputs, error: FieldError) => {
      setError(field, error)
    },
    [setError]
  )

  const { errors } = useFormErrorHydration<EditStudyInputs>({
    schema: studySchema,
    formState,
    onFoundError: handleFoundError,
  })

  const statusInputValue = watch('status')

  // If mounted is false, JS is disabled so we want to display all fields
  const [visibleDateFields, visibleStatuses] = useMemo(
    () =>
      getVisibleFormFields(
        mapCPMSStatusToFormStatus(study.studyStatus),
        mapCPMSStatusToFormStatus(statusInputValue),
        !mounted
      ),
    [statusInputValue, study.studyStatus, mounted]
  )

  const showLoadingState = formState.isSubmitting || (formState.isSubmitSuccessful && Object.keys(errors).length === 0)

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [errors])

  return (
    <Container>
      <NextSeo title="Study Progress Review - Update study data" />
      <div className="lg:flex lg:gap-6">
        <div className="w-full">
          <h2 className="govuk-heading-l govuk-!-margin-bottom-4">
            <span className="govuk-visually-hidden">Page title: </span>
            {PAGE_TITLE}
          </h2>
          <span className="govuk-body-m mb-0 text-darkGrey">
            <span className="govuk-visually-hidden">Study sponsor: </span>
            {supportOrgName || '-'}
          </span>
          <span className="govuk-heading-m text-primary">
            <span className="govuk-visually-hidden">Study short title: </span>
            {study.shortTitle || '-'}
          </span>

          <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

          <div className="govuk-inset-text">{GENERIC_STUDIES_GUIDANCE_TEXT}</div>

          <p className="govuk-body govuk-!-margin-bottom-4">All fields are required unless labelled as optional.</p>

          <Form
            action="/api/forms/editStudy"
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
            <input type="hidden" {...register('studyId')} defaultValue={Number(defaultValues?.studyId)} />
            <input type="hidden" {...register('cpmsId')} defaultValue={defaultValues?.cpmsId} />
            <input type="hidden" {...register('LSN')} defaultValue={defaultValues?.LSN ?? ''} />
            <input
              type="hidden"
              {...register('originalValues')}
              defaultValue={JSON.stringify(defaultValues?.originalValues)}
            />
            <Fieldset>
              {/* Status */}
              <Controller
                control={control}
                name="status"
                render={({ field }) => {
                  const { name, onChange, value, ref } = field

                  const mappedSEStatusValue = mapCPMSStatusToFormStatus(value)

                  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.defaultValue) {
                      const originalStatus = study.studyStatus
                      const mappedStatus = mapFormStatusToCPMSStatus(e.target.defaultValue, originalStatus)
                      onChange(mappedStatus)
                    }
                  }
                  return (
                    <RadioGroup
                      defaultValue={mappedSEStatusValue}
                      errors={errors}
                      label={fieldNameToLabelMapping.status}
                      labelSize="m"
                      name={name}
                      onChange={handleOnChange}
                      ref={ref}
                    >
                      {studyStatuses.map((status) => {
                        if (!visibleStatuses.includes(status.value)) return

                        return (
                          <Radio hint={status.description} key={status.id} label={status.name} value={status.value} />
                        )
                      })}
                    </RadioGroup>
                  )
                }}
              />

              {/* Planned opening to recruitment date */}
              {visibleDateFields.includes('plannedOpeningDate') && (
                <Controller
                  control={control}
                  name="plannedOpeningDate"
                  render={({ field }) => {
                    const { value, onChange, ref, name } = field

                    return (
                      <DateInput
                        errors={errors}
                        label={fieldNameToLabelMapping.plannedOpeningDate}
                        name={name}
                        onChange={(input) => {
                          const allFieldsEmpty = areAllDatePartsEmpty(input)
                          onChange(allFieldsEmpty ? null : input)
                        }}
                        ref={ref}
                        value={transformDateValue(value)}
                      />
                    )
                  }}
                  shouldUnregister
                />
              )}

              {/* Actual opening to recruitment date */}
              {visibleDateFields.includes('actualOpeningDate') && (
                <Controller
                  control={control}
                  name="actualOpeningDate"
                  render={({ field }) => {
                    const { value, onChange, ref, name } = field
                    const previousStatus = statusMap[study.studyStatus]
                    const newStatus = statusMap[statusInputValue]
                    const optionalFields = getOptionalFormFields(previousStatus, newStatus)
                    const label = optionalFields.includes('actualOpeningDate')
                      ? `${fieldNameToLabelMapping.actualOpeningDate} (optional)`
                      : fieldNameToLabelMapping.actualOpeningDate
                    return (
                      <DateInput
                        errors={errors}
                        label={label}
                        name={name}
                        onChange={(input) => {
                          const allFieldsEmpty = areAllDatePartsEmpty(input)
                          onChange(allFieldsEmpty ? null : input)
                        }}
                        ref={ref}
                        value={transformDateValue(value)}
                      />
                    )
                  }}
                />
              )}

              {/* Planned closure to recruitment date */}
              {visibleDateFields.includes('plannedClosureDate') && (
                <Controller
                  control={control}
                  name="plannedClosureDate"
                  render={({ field }) => {
                    const { value, onChange, ref, name } = field

                    return (
                      <DateInput
                        errors={errors}
                        label={fieldNameToLabelMapping.plannedClosureDate}
                        name={name}
                        onChange={(input) => {
                          const allFieldsEmpty = areAllDatePartsEmpty(input)
                          onChange(allFieldsEmpty ? null : input)
                        }}
                        ref={ref}
                        value={transformDateValue(value)}
                      />
                    )
                  }}
                  shouldUnregister
                />
              )}

              {/* Actual closure to recruitment date */}
              {visibleDateFields.includes('actualClosureDate') && (
                <Controller
                  control={control}
                  name="actualClosureDate"
                  render={({ field }) => {
                    const { value, onChange, ref, name } = field

                    return (
                      <DateInput
                        errors={errors}
                        label={fieldNameToLabelMapping.actualClosureDate}
                        name={name}
                        onChange={(input) => {
                          const allFieldsEmpty = areAllDatePartsEmpty(input)
                          onChange(allFieldsEmpty ? null : input)
                        }}
                        ref={ref}
                        value={transformDateValue(value)}
                      />
                    )
                  }}
                  shouldUnregister
                />
              )}

              {/* Estimated reopening date*/}
              {visibleDateFields.includes('estimatedReopeningDate') && (
                <Controller
                  control={control}
                  name="estimatedReopeningDate"
                  render={({ field }) => {
                    const { value, onChange, ref, name } = field

                    return (
                      <DateInput
                        errors={errors}
                        label={fieldNameToLabelMapping.estimatedReopeningDate}
                        name={name}
                        onChange={(input) => {
                          const allFieldsEmpty = areAllDatePartsEmpty(input)
                          onChange(allFieldsEmpty ? null : input)
                        }}
                        ref={ref}
                        value={transformDateValue(value)}
                      />
                    )
                  }}
                  shouldUnregister
                />
              )}

              {/* UK recruitment target */}
              <Controller
                control={control}
                name="recruitmentTarget"
                render={({ field }) => {
                  const { onChange, ...rest } = field

                  return (
                    <TextInput
                      errors={errors}
                      inputClassName="govuk-input--width-10"
                      label={fieldNameToLabelMapping.recruitmentTarget}
                      labelSize="m"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const inputWithNumericsOnly = e.target.value.replace(/\D/g, '')
                        onChange(inputWithNumericsOnly)
                      }}
                      {...rest}
                    />
                  )
                }}
              />

              {/* Further information */}
              <Textarea
                defaultValue={defaultValues?.furtherInformation}
                errors={errors}
                hint="If needed, provide further context or justification for changes made above."
                label={fieldNameToLabelMapping.furtherInformation}
                labelSize="m"
                remainingCharacters={remainingCharacters}
                required={false}
                {...register('furtherInformation')}
                maxLength={FURTHER_INFO_MAX_CHARACTERS}
              />

              {showLoadingState ? (
                <Warning>
                  It may take a few seconds for the record to update. Please stay on this page until redirected.
                </Warning>
              ) : null}

              <div className="govuk-button-group">
                <button
                  className={clsx('govuk-button', {
                    'pointer-events-none': showLoadingState,
                  })}
                  type="submit"
                >
                  {showLoadingState ? (
                    <>
                      Updating... <Spinner />
                    </>
                  ) : (
                    'Update'
                  )}
                </button>
                <Link className="govuk-button govuk-button--secondary" href={`/studies/${study.id}`}>
                  Cancel
                </Link>
              </div>

              <p className="govuk-body">
                If you need support updating your data, please contact the{' '}
                <a href="mailto:supportmystudy@nihr.ac.uk">RDN Team</a>.
              </p>
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

EditStudy.getLayout = function getLayout(page: ReactElement, { user }: EditStudyProps) {
  return (
    <RootLayout heading={PAGE_TITLE} user={user}>
      {page}
    </RootLayout>
  )
}

export const getServerSideProps = withServerSideProps(Roles.SponsorContact, async (context, session) => {
  const userOrganisationIds = session.user?.organisations.map((userOrg) => userOrg.organisationId)

  const { data: study } = await getStudyById(Number(context.query.studyId), userOrganisationIds)

  if (!study) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }

  logger.info('Successfully retrieved study from SE with studyId: %s', context.query.studyId)

  const cpmsId = study.cpmsId

  // CPMS ID is required to update a study
  if (!cpmsId) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }
  const { study: studyInCPMS } = await getStudyByIdFromCPMS(Number(cpmsId))

  if (!studyInCPMS) {
    return {
      props: {
        user: session.user,
        study,
        query: context.query,
      },
    }
  }

  const studyEvalsInCPMS = studyInCPMS.StudyEvaluationCategories
  const mappedStudyEvalsInCPMS = studyEvalsInCPMS.map((studyEval) => mapCPMSStudyEvalToSEEval(studyEval))

  const { data: updatedStudy } = await updateStudy(Number(cpmsId), mapCPMSStudyToSEStudy(studyInCPMS))

  if (!updatedStudy) {
    return {
      props: {
        user: session.user,
        study,
        query: context.query,
      },
    }
  }

  const { data: setStudyAssessmentDueResponse } = await setStudyAssessmentDueFlag([study.id])
  const isStudyDueAssessment = setStudyAssessmentDueResponse !== null ? setStudyAssessmentDueResponse === 1 : false

  const currentStudyEvalsInSE = updatedStudy.evaluationCategories

  // Soft delete evaluations in SE that are no longer returned from CPMS
  const studyEvalIdsToDelete = currentStudyEvalsInSE
    .filter(
      (seEval) =>
        !studyEvalsInCPMS.some(({ EvaluationCategoryValue }) => EvaluationCategoryValue === seEval.indicatorValue)
    )
    .map(({ id }) => id)

  const { data: updatedStudyEvals } = await updateEvaluationCategories(
    study.id,
    mappedStudyEvalsInCPMS,
    studyEvalIdsToDelete
  )

  return {
    props: {
      user: session.user,
      study: {
        ...updatedStudy,
        evaluationCategories: updatedStudyEvals ?? study.evaluationCategories,
        isDueAssessment: isStudyDueAssessment,
      },
      currentLSN: studyInCPMS.CurrentLsn,
      query: context.query,
    },
  }
})
