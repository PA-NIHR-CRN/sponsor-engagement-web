import type { ReactElement } from 'react'
import { Container } from '@nihr-ui/frontend'
import { zodResolver } from '@hookform/resolvers/zod'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getServerSession } from 'next-auth/next'
import { NextSeo } from 'next-seo'
import { useForm } from 'react-hook-form'
import clsx from 'clsx'
import Link from 'next/link'
import { RootLayout } from '../../../components/Layout/RootLayout'
import { authOptions } from '../../api/auth/[...nextauth]'
import { SIGN_IN_PAGE } from '../../../constants/routes'
import { GetSupport } from '../../../components/molecules'
import { getStudyById } from '../../../lib/studies'
import { Checkbox, CheckboxGroup, Fieldset, Form, Radio, RadioGroup } from '../../../components/atoms'
import type { AssessmentInputs } from '../../../utils/schemas/assessment.schema'
import { assessmentSchema } from '../../../utils/schemas/assessment.schema'
import { prismaClient } from '../../../lib/prisma'
import { Textarea } from '../../../components/atoms/Form/Textarea/Textarea'
import { TEXTAREA_MAX_CHARACTERS } from '../../../constants/forms'

export type AssessmentProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Assessment({ study, statuses, furtherInformation, returnUrl }: AssessmentProps) {
  const { register, formState, setError, watch, handleSubmit } = useForm<AssessmentInputs>({
    resolver: zodResolver(assessmentSchema),
    // defaultValues: getValuesFromSearchParams(feedbackSchema, query),
  })

  const errors = {}

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

          <Form
            action="/api/forms/assessment"
            handleSubmit={handleSubmit}
            method="post"
            onError={(message: string) => {
              setError('root.serverError', {
                type: '400',
                message,
              })
            }}
          >
            {/* <ErrorSummary errors={errors} /> */}

            <Fieldset>
              {/* Status */}
              <RadioGroup
                defaultValue=""
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
                <Link className="govuk-button govuk-button--secondary" href={returnUrl}>
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

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session?.user) {
      return {
        redirect: {
          destination: SIGN_IN_PAGE,
        },
      }
    }

    if (session.user.roles.length === 0) {
      return {
        redirect: {
          destination: '/',
        },
      }
    }

    const studyId = context.query.studyId

    if (!studyId) {
      throw new Error('Cannot assess a study if no study id exists!')
    }

    const [study, statusRefData, furtherInformationRefData] = await prismaClient.$transaction([
      getStudyById(Number(studyId)),
      prismaClient.sysRefAssessmentStatus.findMany(),
      prismaClient.sysRefAssessmentFurtherInformation.findMany({
        orderBy: [{ sortOrder: 'asc' }],
        where: {
          isDeleted: false,
        },
      }),
    ])

    if (!study) {
      throw new Error('Missing study data')
    }

    return {
      props: {
        user: session.user,
        study,
        statuses: statusRefData.map(({ id, name, description }) => ({ id, name, description })),
        furtherInformation: furtherInformationRefData.map(({ id, name }) => ({ id, name })),
        returnUrl: context.query.returnUrl === 'studies' ? '/studies' : `/studies/${study.id}`,
      },
    }
  } catch (error) {
    return {
      redirect: {
        destination: '/500',
      },
    }
  }
}
