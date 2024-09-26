import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@nihr-ui/frontend'
import clsx from 'clsx'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { type ReactElement, useCallback, useEffect, useState } from 'react'
import type { FieldError, FieldErrors, FieldErrorsImpl, Merge } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import { ErrorSummary, Fieldset, Form } from '@/components/atoms'
import { DateInput } from '@/components/atoms/Form/DateInput/DateInput'
import { Textarea } from '@/components/atoms/Form/Textarea/Textarea'
import { TextInput } from '@/components/atoms/Form/TextInput/TextInput'
import Warning from '@/components/atoms/Warning/Warning'
import { RequestSupport } from '@/components/molecules'
import { RootLayout } from '@/components/organisms'
import { EDIT_STUDY_ROLE, Roles } from '@/constants'
import { FURTHER_INFO_MAX_CHARACTERS, GENERIC_STUDIES_GUIDANCE_TEXT, PAGE_TITLE } from '@/constants/editStudyForm'
import { useFormErrorHydration } from '@/hooks/useFormErrorHydration'
import { getStudyByIdFromCPMS } from '@/lib/cpms/studies'
import {
  getStudyById,
  mapCPMSStudyEvalToSEEval,
  mapCPMSStudyToSEStudy,
  updateEvaluationCategories,
  updateStudy,
} from '@/lib/studies'
import { mapStudyToStudyFormInput } from '@/utils/editStudyForm'
import type { EditStudyInputs } from '@/utils/schemas'
import { studySchema } from '@/utils/schemas'
import { withServerSideProps } from '@/utils/withServerSideProps'

export type EditStudyProps = InferGetServerSidePropsType<typeof getServerSideProps>

const dateFieldNames: Partial<keyof EditStudyInputs>[] = [
  'actualOpeningDate',
  'plannedClosureDate',
  'plannedOpeningDate',
]

function mapErrorObject(obj: FieldErrors): FieldErrors {
  const result: FieldErrors = {}

  function flattenDateFields(
    parentKey: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- type taken from rhf
    value: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined
  ) {
    for (const key in value) {
      if (typeof value[key] === 'object') {
        const newKey = `${parentKey}-${key}`
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- TODO: look into
        result[newKey] = value[key]
      }
    }
  }

  // Date fields have nested error messages that needs to be flattened
  for (const key in obj) {
    if (dateFieldNames.includes(key as keyof EditStudyInputs)) {
      flattenDateFields(key, obj[key])
    } else {
      result[key] = obj[key]
    }
  }

  return result
}

export default function EditStudy({ study }: EditStudyProps) {
  const { register, formState, handleSubmit, control, watch, setError } = useForm<EditStudyInputs>({
    resolver: zodResolver(studySchema),
    defaultValues: {
      ...mapStudyToStudyFormInput(study),
    },
  })

  const [mappedErrors, setMappedErrors] = useState({})

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

  useEffect(() => {
    // console.log('hitting use effect', formState.errors)
    const mappedRes = mapErrorObject(errors)

    setMappedErrors(mappedRes)
    // console.log({ mappedRes })
  }, [errors])

  return (
    <Container>
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
            <ErrorSummary errors={mappedErrors} />
            <input type="hidden" {...register('cpmsId')} defaultValue={defaultValues?.cpmsId} />
            <Fieldset>
              {/* Status */}
              {/* <Controller
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
                      errors={{}}
                      label="Study status"
                      labelSize="m"
                      name={name}
                      onChange={handleOnChange}
                      ref={ref}
                    >
                      {studyStatuses.map((status) => (
                        <Radio hint={status.description} key={status.id} label={status.name} value={status.value} />
                      ))}
                    </RadioGroup>
                  )
                }}
              /> */}

              {/* Planned opening to recruitment date */}
              <Controller
                control={control}
                name="plannedOpeningDate"
                render={({ field }) => {
                  const { value, onChange, ref, name } = field

                  return (
                    <DateInput
                      errors={mappedErrors}
                      label="Planned opening to recruitment date"
                      name={name}
                      onChange={onChange}
                      ref={ref}
                      value={value}
                    />
                  )
                }}
              />

              {/* Actual opening to recruitment date */}
              <Controller
                control={control}
                name="actualOpeningDate"
                render={({ field }) => {
                  const { value, onChange, ref, name } = field

                  return (
                    <DateInput
                      errors={{}}
                      label="Actual opening to recruitment date"
                      name={name}
                      onChange={onChange}
                      ref={ref}
                      value={value}
                    />
                  )
                }}
              />

              {/* Planned closure to recruitment date */}
              <Controller
                control={control}
                name="plannedClosureDate"
                render={({ field }) => {
                  const { value, onChange, ref, name } = field

                  return (
                    <DateInput
                      errors={{}}
                      label="Planned closure to recruitment date"
                      name={name}
                      onChange={onChange}
                      ref={ref}
                      value={value}
                    />
                  )
                }}
              />

              {/* Actual closure to recruitment date */}
              <Controller
                control={control}
                name="actualClosureDate"
                render={({ field }) => {
                  const { value, onChange, ref, name } = field

                  return (
                    <DateInput
                      errors={{}}
                      label="Actual closure to recruitment date"
                      name={name}
                      onChange={onChange}
                      ref={ref}
                      value={value}
                    />
                  )
                }}
              />

              {/* Estimated reopening date*/}
              <Controller
                control={control}
                name="estimatedReopeningDate"
                render={({ field }) => {
                  const { value, onChange, ref, name } = field

                  return (
                    <DateInput
                      errors={{}}
                      label="Estimated reopening date"
                      name={name}
                      onChange={onChange}
                      ref={ref}
                      value={value}
                    />
                  )
                }}
              />

              {/* UK recruitment target */}
              <TextInput
                defaultValue={defaultValues?.recruitmentTarget}
                errors={{}}
                inputClassName="govuk-input--width-10"
                label="UK recruitment target"
                labelSize="m"
                type="number"
                {...register('recruitmentTarget')}
              />

              {/* Further information */}
              <Textarea
                defaultValue={defaultValues?.furtherInformation}
                errors={{}}
                hint="If needed, provide further context or justification for changes made above."
                label="Further information"
                labelSize="m"
                remainingCharacters={remainingCharacters}
                {...register('furtherInformation')}
                maxLength={FURTHER_INFO_MAX_CHARACTERS}
              />

              <Warning>
                It may a few seconds for the CPMS record to update. Please stay on this page until redirected.
              </Warning>

              <div className="govuk-button-group">
                <button className={clsx('govuk-button', { 'pointer-events-none': formState.isLoading })} type="submit">
                  Update
                </button>
                <Link className="govuk-button govuk-button--secondary" href={`/studies/${study.id}`}>
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

EditStudy.getLayout = function getLayout(page: ReactElement, { user }: EditStudyProps) {
  return (
    <RootLayout heading={PAGE_TITLE} user={user}>
      {page}
    </RootLayout>
  )
}

export const getServerSideProps = withServerSideProps(Roles.SponsorContact, async (context, session) => {
  const canEditStudy = Boolean(session.user?.groups.includes(EDIT_STUDY_ROLE))

  if (!canEditStudy) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }

  const { data: study } = await getStudyById(Number(context.query.studyId))

  if (!study) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }

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
      },
    }
  }

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
      study: { ...updatedStudy, evaluationCategories: updatedStudyEvals ?? study.evaluationCategories },
    },
  }
})
