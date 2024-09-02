import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@nihr-ui/frontend'
import clsx from 'clsx'
import Link from 'next/link'
import { type ReactElement, useCallback } from 'react'
import type { FieldError } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import { ErrorSummary, Fieldset, Form, Radio, RadioGroup } from '@/components/atoms'
import { DateInput } from '@/components/atoms/Form/DateInput/DateInput'
import { Textarea } from '@/components/atoms/Form/Textarea/Textarea'
import { TextInput } from '@/components/atoms/Form/TextInput/TextInput'
import Warning from '@/components/atoms/Warning/Warning'
import { RequestSupport } from '@/components/molecules'
import { RootLayout } from '@/components/organisms'
import { useFormErrorHydration } from '@/hooks/useFormErrorHydration'
import type { StudyInputs } from '@/utils/schemas'
import { assessmentSchema, studySchema } from '@/utils/schemas'

import {
  COMMERCIAL_GUIDANCE_TEXT,
  initialValues,
  NON_COMMERCIAL_GUIDANCE_TEXT,
  PAGE_TITLE,
  studyStatuses,
} from './constants'

// Dummy content before retrieving data
const sponsorOrgName: string | undefined = 'F. Hoffmann-La Roche Ltd (FORTREA DEVELOPMENT LIMITED)'
const shortStudyTitle: string | undefined = 'Study to test safety/efficacy of CIT treatment in NSCLC patients'
const studyRoute: 'Commercial' | 'Not Commercial ' = 'Commercial'
const studyId = '10633'

export default function EditStudyPage() {
  const { register, formState, setError, handleSubmit, getValues } = useForm<StudyInputs>({
    resolver: zodResolver(studySchema),
    defaultValues: { ...initialValues, studyId: String(studyId) },
  })

  const handleFoundError = useCallback(
    (field: keyof StudyInputs, error: FieldError) => {
      setError(field, error)
    },
    [setError]
  )

  const { errors } = useFormErrorHydration<StudyInputs>({
    schema: assessmentSchema,
    formState,
    onFoundError: handleFoundError,
  })

  const { defaultValues } = formState

  console.log({ values: getValues() })
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
            {sponsorOrgName ?? '-'}
          </span>
          <span className="govuk-heading-m text-primary">
            <span className="govuk-visually-hidden">Study short title: </span>
            {shortStudyTitle ?? '-'}
          </span>

          <hr className="govuk-section-break govuk-section-break--l govuk-section-break--visible" />

          <div className="govuk-inset-text">
            {studyRoute === 'Commercial' ? COMMERCIAL_GUIDANCE_TEXT : NON_COMMERCIAL_GUIDANCE_TEXT}
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

            <Fieldset>
              {/* Status */}
              <RadioGroup
                defaultValue={defaultValues?.status}
                errors={errors}
                hint="Changes to the study status will be committed to CPMS after manual review."
                label="Study status"
                labelSize="m"
                {...register('status')}
              >
                {studyStatuses.map((status) => (
                  <Radio hint={status.description} key={status.id} label={status.name} value={status.name} />
                ))}
              </RadioGroup>

              {/* Planned opening to recruitment date */}
              <DateInput
                errors={errors}
                label="Planned opening to recruitment date"
                {...register('plannedOpeningDate', {})}
              />

              {/* Actual opening to recruitment date */}
              <DateInput
                errors={errors}
                label="Actual opening to recruitment date"
                {...register('actualOpeningDate')}
              />

              {/* Planned closure to recruitment date */}
              <DateInput
                errors={errors}
                label="Planned closure to recruitment date"
                {...register('plannedClosureToRecruitmentDate')}
              />

              {/* Actual closure to recruitment date */}
              <DateInput
                errors={errors}
                label="Actual closure to recruitment date"
                {...register('actualClosureToRecruitmentDate')}
              />

              <TextInput
                // defaultValue={String(defaultValues?.recruitmentTarget)}
                errors={errors}
                hint="Changes to the UK recruitment target will be committed to CPMS after manual review. "
                label="UK recruitment target"
                labelSize="m"
                {...register('recruitmentTarget', {
                  setValueAs: (v: string) => parseInt(v),
                })}
              />

              <Textarea
                defaultValue={defaultValues?.furtherInformation}
                errors={errors}
                hint="If needed, provide further context or justification for changes made above."
                label="Further information"
                labelSize="m"
                {...register('furtherInformation')}
              />

              <Warning>
                It may a few seconds for the CPMS record to update. Please stay on this page until redirected.
              </Warning>

              <div className="govuk-button-group">
                <button className={clsx('govuk-button', { 'pointer-events-none': formState.isLoading })} type="submit">
                  Update
                </button>
                <Link className="govuk-button govuk-button--secondary" href={`/studies/${studyId}`}>
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

EditStudyPage.getLayout = function getLayout(page: ReactElement) {
  return <RootLayout heading={PAGE_TITLE}>{page}</RootLayout>
}
