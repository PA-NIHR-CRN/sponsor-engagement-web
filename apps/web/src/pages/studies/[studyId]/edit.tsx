import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@nihr-ui/frontend'
import clsx from 'clsx'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { type ReactElement, useCallback } from 'react'
import type { FieldError } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import { ErrorSummary, Fieldset, Form, Radio, RadioGroup } from '@/components/atoms'
import { DateInput } from '@/components/atoms/Form/DateInput/DateInput'
import { Textarea } from '@/components/atoms/Form/Textarea/Textarea'
import { TextInput } from '@/components/atoms/Form/TextInput/TextInput'
import Warning from '@/components/atoms/Warning/Warning'
import { RequestSupport } from '@/components/molecules'
import { RootLayout } from '@/components/organisms'
import { Roles } from '@/constants'
import {
  COMMERCIAL_GUIDANCE_TEXT,
  NON_COMMERCIAL_GUIDANCE_TEXT,
  PAGE_TITLE,
  studyStatuses,
} from '@/constants/editStudyForm'
import { TEXTAREA_MAX_CHARACTERS } from '@/constants/forms'
import { useFormErrorHydration } from '@/hooks/useFormErrorHydration'
import { getValuesFromSearchParams } from '@/utils/form'
import type { StudyInputs } from '@/utils/schemas'
import { studySchema } from '@/utils/schemas'
import { withServerSideProps } from '@/utils/withServerSideProps'

// Dummy content to use before retrieving data from API

export type EditStudyProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function EditStudy({ query, study }: EditStudyProps) {
  const { register, formState, setError, handleSubmit, control, watch } = useForm<StudyInputs>({
    resolver: zodResolver(studySchema),
    defaultValues: {
      ...getValuesFromSearchParams(studySchema, query),
      studyId: String(study.id),
    },
  })

  const handleFoundError = useCallback(
    (field: keyof StudyInputs, error: FieldError) => {
      setError(field, error)
    },
    [setError]
  )

  const { errors } = useFormErrorHydration<StudyInputs>({
    schema: studySchema,
    formState,
    onFoundError: handleFoundError,
  })

  const { defaultValues } = formState

  // Watch & update the character count for the "Further information" textarea
  const furtherInformationText = watch('furtherInformation') ?? ''
  const remainingCharacters =
    furtherInformationText.length >= TEXTAREA_MAX_CHARACTERS
      ? 0
      : TEXTAREA_MAX_CHARACTERS - furtherInformationText.length

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
            {study.sponsorOrgName ?? '-'}
          </span>
          <span className="govuk-heading-m text-primary">
            <span className="govuk-visually-hidden">Study short title: </span>
            {study.shortStudyTitle ?? '-'}
          </span>

          <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

          <div className="govuk-inset-text">
            {study.studyRoute === 'Commercial' ? COMMERCIAL_GUIDANCE_TEXT : NON_COMMERCIAL_GUIDANCE_TEXT}
          </div>

          <Form
            action=""
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
                hint="Changes to the study status will be committed to CPMS after manual review."
                label="Study status"
                labelSize="m"
                {...register('status', {
                  setValueAs: (value) => {
                    if (value !== null) return value
                  },
                })}
                disabled
              >
                {studyStatuses.map((status) => (
                  <Radio hint={status.description} key={status.id} label={status.name} value={status.name} />
                ))}
              </RadioGroup>

              {/* Planned opening to recruitment date */}
              <Controller
                control={control}
                name="plannedOpeningDate"
                render={({ field }) => {
                  const { value, onChange, ref, name } = field

                  return (
                    <DateInput
                      errors={errors}
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
                      disabled
                      errors={errors}
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
                name="plannedClosureToRecruitmentDate"
                render={({ field }) => {
                  const { value, onChange, ref, name } = field

                  return (
                    <DateInput
                      disabled
                      errors={errors}
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
                name="actualClosureToRecruitmentDate"
                render={({ field }) => {
                  const { value, onChange, ref, name } = field

                  return (
                    <DateInput
                      disabled
                      errors={errors}
                      label="Actual closure to recruitment date"
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
                disabled
                errors={errors}
                hint="Changes to the UK recruitment target will be committed to CPMS after manual review. "
                inputClassName="govuk-input--width-10"
                label="UK recruitment target"
                labelSize="m"
                type="number"
                {...register('recruitmentTarget', {
                  setValueAs: (value) => {
                    if (value === '' || Number.isNaN(Number(value))) return undefined

                    return Number(value)
                  },
                })}
              />

              {/* Further information */}
              <Textarea
                defaultValue={defaultValues?.furtherInformation}
                disabled
                errors={errors}
                hint="If needed, provide further context or justification for changes made above."
                label="Further information"
                labelSize="m"
                remainingCharacters={remainingCharacters}
                {...register('furtherInformation')}
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

export const getServerSideProps = withServerSideProps(Roles.SponsorContact, (context, session) => {
  const studyId = context.query.studyId

  if (!studyId) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }

  return {
    props: {
      user: session.user,
      query: context.query,
      study: {
        id: studyId as string,
        // Temporary until data is pulled through
        shortStudyTitle: 'Study to test safety/efficacy of CIT treatment in NSCLC patients' as string | undefined,
        sponsorOrgName: 'F. Hoffmann-La Roche Ltd (FORTREA DEVELOPMENT LIMITED)' as string | undefined,
        studyRoute: 'Commercial' as 'Commercial' | 'Not Commercial',
      },
    },
  }
})
