import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@nihr-ui/frontend'
import clsx from 'clsx'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { type ReactElement } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { Fieldset, Form, Radio, RadioGroup } from '@/components/atoms'
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
import { getStudyByIdFromCPMS } from '@/lib/cpms/studies'
import { getStudyById, mapCPMSStudyToPrismaStudy, updateStudy } from '@/lib/studies'
import { mapStudyToStudyFormInput } from '@/utils/editStudyForm'
import type { EditStudyInputs } from '@/utils/schemas'
import { studySchema } from '@/utils/schemas'
import { withServerSideProps } from '@/utils/withServerSideProps'

export type EditStudyProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function EditStudy({ study }: EditStudyProps) {
  const { register, formState, handleSubmit, control } = useForm<EditStudyInputs>({
    resolver: zodResolver(studySchema),
    defaultValues: {
      ...mapStudyToStudyFormInput(study),
    },
  })

  const { organisationsByRole } = study

  const supportOrgName = organisationsByRole.CRO ?? organisationsByRole.CTU

  const { defaultValues } = formState

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

          <div className="govuk-inset-text">
            {study.route === 'Commercial' ? COMMERCIAL_GUIDANCE_TEXT : NON_COMMERCIAL_GUIDANCE_TEXT}
          </div>

          <Form
            action="/api/forms/editStudy"
            handleSubmit={handleSubmit}
            method="post"
            onError={(error) => {
              //TODO: Temporary until validation and error states are implemented
              console.log('error', error)
            }}
          >
            <input type="hidden" {...register('studyId')} defaultValue={defaultValues?.studyId} />

            <Fieldset>
              {/* Status */}
              <RadioGroup
                defaultValue={defaultValues?.status}
                errors={{}}
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
                  <Radio hint={status.description} key={status.id} label={status.name} value={status.value} />
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
                      errors={{}}
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
                      disabled
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
                      disabled
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

              {/* UK recruitment target */}
              <TextInput
                defaultValue={defaultValues?.recruitmentTarget}
                disabled
                errors={{}}
                hint="Changes to the UK recruitment target will be committed to CPMS after manual review. "
                inputClassName="govuk-input--width-10"
                label="UK recruitment target"
                labelSize="m"
                type="number"
                {...register('recruitmentTarget')}
              />

              {/* Further information */}
              <Textarea
                defaultValue={defaultValues?.furtherInformation}
                disabled
                errors={{}}
                hint="If needed, provide further context or justification for changes made above."
                label="Further information"
                labelSize="m"
                remainingCharacters={0} // TODO: Add functionality in validation & error ticket
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

export const getServerSideProps = withServerSideProps(Roles.SponsorContact, async (context, session) => {
  const seStudyRecord = await getStudyById(Number(context.query.studyId))

  if (!seStudyRecord.data) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }

  const cpmsId = seStudyRecord.data.cpmsId

  if (!cpmsId) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }
  const { study: studyInCPMS } = await getStudyByIdFromCPMS(cpmsId)

  // If there is an error fetching from CPMS, do we want to attempt to get from SE DB before redirecting to 500?
  if (!studyInCPMS) {
    return {
      redirect: {
        destination: '/500',
      },
    }
  }

  const { data: study } = await updateStudy(Number(cpmsId), mapCPMSStudyToPrismaStudy(studyInCPMS))

  if (!study) {
    return {
      redirect: {
        destination: '/500',
      },
    }
  }

  return {
    props: {
      user: session.user,
      study,
    },
  }
})
