import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@nihr-ui/frontend'
import clsx from 'clsx'
import type { FirstType } from 'database'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { type ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FieldError } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import { DateInput, Fieldset, Form, Radio, RadioGroup } from '@/components/atoms'
import type { DateInputValue } from '@/components/atoms/Form/DateInput/types'
import { Select } from '@/components/atoms/Form/Select/Select'
import { Textarea } from '@/components/atoms/Form/Textarea/Textarea'
import { TextInput } from '@/components/atoms/Form/TextInput/TextInput'
import { RequestSupport } from '@/components/molecules'
import { RootLayout } from '@/components/organisms'
import { Roles } from '@/constants'
import { TEXTAREA_MAX_CHARACTERS } from '@/constants/forms'
import { useFormErrorHydration } from '@/hooks/useFormErrorHydration'
import { getStudyById, getStudyTitlesForOrgs } from '@/lib/studies'
import { getStudyFirstByStudyId } from '@/lib/studyFirsts'
import { type ReportFirstInputs, reportFirstSchema } from '@/utils/schemas/reportFirst.schema'
import { withServerSideProps } from '@/utils/withServerSideProps'

export type ReportFirstProps = InferGetServerSidePropsType<typeof getServerSideProps>

interface StudyFirstApiResponse {
  first: ReportFirstProps['initialFirst'] | null
}

interface StudyTitle { id: number; shortTitle: string }

function isStudyTitleArray(value: unknown): value is StudyTitle[] {
  return (
    Array.isArray(value) &&
    value.every((v) => {
      if (typeof v !== 'object' || v === null) return false
      const obj = v as { id?: unknown; shortTitle?: unknown }
      return typeof obj.id === 'number' && typeof obj.shortTitle === 'string'
    })
  )
}

const EMPTY_DATE: DateInputValue = { day: '', month: '', year: '' }

function isSafeReturnUrl(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
}

const renderBackLink = (returnUrl: string) => (
  <div className="ml-8 govuk-!-padding-top-3">
    <Container>
      <Link className="govuk-back-link govuk-!-font-size-19 font-light" href={returnUrl}>
        Back
      </Link>
    </Container>
  </div>
)

const toDateParts = (date: string | Date): DateInputValue => {
  const d = typeof date === 'string' ? new Date(date) : date
  return {
    day: String(d.getDate()).padStart(2, '0'),
    month: String(d.getMonth() + 1).padStart(2, '0'),
    year: String(d.getFullYear()),
  }
}

const normaliseDateValue = (input?: DateInputValue | null): DateInputValue => ({
  day: input?.day ?? '',
  month: input?.month ?? '',
  year: input?.year ?? '',
})

const buildDefaultValues = (
  studyId: string,
  first: ReportFirstProps['initialFirst']
): ReportFirstInputs => ({
  studyId: studyId || '',
  type: first?.type as FirstType,
  firstAt: first?.firstAt ? toDateParts(first.firstAt) : EMPTY_DATE,
  siteName: first?.siteName ?? '',
  piTitle: first?.piTitle ?? '',
  piFullName: first?.piFullName ?? '',
  piEmail: first?.piEmail ?? '',
})

async function fetchStudyFirst(studyId: string): Promise<StudyFirstApiResponse['first']> {
  const res = await fetch(`/api/study-first?studyId=${encodeURIComponent(studyId)}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })

  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Failed to load first record (${res.status})`)

  const data = (await res.json()) as StudyFirstApiResponse
  return data.first ?? null
}

export default function ReportFirst({
  studies,
  initialStudyId,
  initialFirst,
  returnUrl,
  isStudyLocked,
  study,
}: Readonly<ReportFirstProps>) {
  const router = useRouter()

  // Ensure studies is safe (prevents "any" member access lint issues)
  const safeStudies = useMemo<StudyTitle[]>(() => (isStudyTitleArray(studies) ? studies : []), [studies])

  const [isFetchingFirst, setIsFetchingFirst] = useState(false)

  const defaultValues = useMemo(
    () => buildDefaultValues(initialStudyId, initialFirst),
    [initialStudyId, initialFirst]
  )

  const { control, register, reset, setError, handleSubmit, formState, watch } =
    useForm<ReportFirstInputs>({
      resolver: zodResolver(reportFirstSchema),
      defaultValues,
    })

  useEffect(() => {
    reset(defaultValues, { keepDirty: false, keepErrors: false, keepTouched: false })
  }, [defaultValues, reset])

  const siteNameText = watch('siteName')
  const remainingCharacters = useMemo(() => {
    return siteNameText.length >= TEXTAREA_MAX_CHARACTERS
      ? 0
      : TEXTAREA_MAX_CHARACTERS - siteNameText.length
  }, [siteNameText])

  const handleFoundError = useCallback(
    (field: keyof ReportFirstInputs, error: FieldError) => {
      setError(field, error)
    },
    [setError]
  )

  const { errors } = useFormErrorHydration<ReportFirstInputs>({
    schema: reportFirstSchema,
    formState,
    onFoundError: handleFoundError,
  })

  const requestSeq = useRef(0)

  const handleStudyChange = useCallback(
    async (nextStudyId: string) => {
      const seq = ++requestSeq.current
      setIsFetchingFirst(true)

      try {
        if (!nextStudyId) {
          reset(buildDefaultValues('', null), {
            keepDirty: false,
            keepErrors: false,
            keepTouched: false,
          })

          await router.replace(
            { pathname: router.pathname, query: { returnUrl: returnUrl } },
            undefined,
            { shallow: true }
          )
          return
        }

        const first = await fetchStudyFirst(nextStudyId)
        if (seq !== requestSeq.current) return

        reset(buildDefaultValues(nextStudyId, first), {
          keepDirty: false,
          keepErrors: false,
          keepTouched: false,
        })

        await router.replace(
          { pathname: router.pathname, query: { returnUrl: returnUrl, studyId: nextStudyId } },
          undefined,
          { shallow: true }
        )
      } catch {
        if (seq !== requestSeq.current) return

        reset(buildDefaultValues(nextStudyId, null), {
          keepDirty: false,
          keepErrors: false,
          keepTouched: false,
        })

        await router.replace(
          { pathname: router.pathname, query: { returnUrl: returnUrl, studyId: nextStudyId } },
          undefined,
          { shallow: true }
        )
      } finally {
        if (seq === requestSeq.current) setIsFetchingFirst(false)
      }
    },
    [reset, router, returnUrl]
  )

  const supportOrgName = study ? (study.organisationsByRole.CRO ?? study.organisationsByRole.CTU) : null

  return (
    <Container>
      <Form
        action={`/api/forms/reportFirst?returnUrl=${encodeURIComponent(returnUrl)}`}
        handleSubmit={handleSubmit}
        method="post"
        onError={(message: string) => {
          // ✅ no any casts needed
          setError('root', { type: 'server', message })
        }}
      >
        <NextSeo title="Report a First" />

        <div className="lg:flex lg:gap-6">
          <div className="w-full">
            <h2 className="govuk-heading-l govuk-!-margin-bottom-6">
              Report a &apos;First&apos;
            </h2>

            {study ? (
              <>
                <div className="govuk-body-s govuk-!-margin-bottom-0 text-darkGrey">
                  <span className="govuk-visually-hidden">Study sponsor: </span>
                  {study.organisationsByRole.Sponsor}
                  {supportOrgName ? ` (${supportOrgName})` : null}
                </div>

                <h3 className="govuk-heading-m govuk-!-margin-bottom-6">
                  <span className="govuk-visually-hidden">Study title: </span>
                  {study.shortTitle}
                </h3>
              </>
            ) : null}

            <p className="govuk-body govuk-!-margin-bottom-6">
              Reporting a first helps us capture key study milestones quickly and accurately. Your direct
              submission reduces follow‑up emails, improves data quality, and ensures important achievements
              - such as global or European firsts - are recorded and linked to wider systems in real time.
            </p>

            <Fieldset>
              {!isStudyLocked ? (
                <Controller
                  control={control}
                  name="studyId"
                  render={({ field }) => (
                    <Select
                      errors={errors}
                      label="Select study"
                      labelSize="m"
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={(e) => {
                        const nextStudyId = e.target.value
                        field.onChange(nextStudyId)
                        void handleStudyChange(nextStudyId)
                      }}
                      options={[
                        <option key="placeholder" value="">
                          Select a study
                        </option>,
                        ...safeStudies.map((s) => (
                          <option key={s.id} value={String(s.id)}>
                            {s.shortTitle}
                          </option>
                        )),
                      ]}
                      required
                      value={field.value}
                    />
                  )}
                />
              ) : null}

              <RadioGroup errors={errors} label="Type of First" labelSize="m" {...register('type')}>
                <Radio hint="The UK has consented the first participant in a global study." label="Global" value="global" />
                <Radio hint="The UK has consented the first participant in a European study." label="European" value="european" />
              </RadioGroup>

              <Controller
                control={control}
                name="firstAt"
                render={({ field }) => (
                  <DateInput
                    errors={errors}
                    hint="The date the first participant was consented to the study"
                    label="First patient / First visit"
                    name={field.name}
                    onChange={field.onChange}
                    ref={field.ref}
                    required
                    value={normaliseDateValue(field.value)}
                  />
                )}
              />

              <Textarea
                {...register('siteName')}
                defaultValue=""
                errors={errors}
                hint="Name of site that consented the first global/European participant"
                label="Site name"
                labelSize="m"
                maxLength={TEXTAREA_MAX_CHARACTERS}
                remainingCharacters={remainingCharacters}
                required
              />

              <h3 className="govuk-heading-m govuk-!-margin-bottom-4 govuk-!-margin-top-8">
                Principal Investigator Details
              </h3>

              <TextInput errors={errors} label="Title" labelSize="m" {...register('piTitle')} />
              <TextInput errors={errors} label="Full name" labelSize="m" {...register('piFullName')} />
              <TextInput errors={errors} label="Email address" labelSize="m" {...register('piEmail')} />

              <div className="govuk-button-group">
                <button
                  className={clsx('govuk-button', {
                    'pointer-events-none': formState.isSubmitting || isFetchingFirst,
                  })}
                  disabled={formState.isSubmitting || isFetchingFirst}
                  type="submit"
                >
                  Submit
                </button>

                <Link className="govuk-button govuk-button--secondary" href={returnUrl}>
                  Go back
                </Link>
              </div>
            </Fieldset>
          </div>

          <div className="lg:min-w-[300px] lg:max-w-[300px]">
            <RequestSupport showCallToAction sticky />
          </div>
        </div>
      </Form>
    </Container>
  )
}

ReportFirst.getLayout = function getLayout(page: ReactElement, props: ReportFirstProps) {
  const safeReturnUrl = isSafeReturnUrl(props.returnUrl) ? props.returnUrl : '/studies'

  return (
    <RootLayout backLink={renderBackLink(safeReturnUrl)} user={props.user}>
      {page}
    </RootLayout>
  )
}

export const getServerSideProps = withServerSideProps(
  [Roles.SponsorContact],
  async (context, session) => {
    try {
      if (!session.user?.organisations.length) {
        return { redirect: { destination: '/' } }
      }

      const organisationIds = session.user.organisations.map((o) => o.organisationId)

      const studyIdFromQuery = typeof context.query.studyId === 'string' ? context.query.studyId : ''
      const studyIdNumber = Number(studyIdFromQuery)
      const hasStudyIdInQuery =
        Boolean(studyIdFromQuery) && Number.isFinite(studyIdNumber) && studyIdNumber > 0

      if (hasStudyIdInQuery) {
        const studyResult = await getStudyById(studyIdNumber, organisationIds)
        if (!studyResult.data) return { notFound: true }

        const initialStudyId = String(studyResult.data.id)
        const initialFirstResult = await getStudyFirstByStudyId(studyIdNumber, organisationIds)

        return {
          props: {
            user: session.user,
            studies: [],
            initialStudyId,
            isStudyLocked: true,
            study: studyResult.data,
            initialFirst: initialFirstResult.data,
            returnUrl: `/studies/${initialStudyId}/`,
          },
        }
      }

      const studies = await getStudyTitlesForOrgs({ organisationIds })

      const allowedIds = new Set(studies.data.map((s) => String(s.id)))
      const initialStudyId = allowedIds.has(studyIdFromQuery) ? studyIdFromQuery : ''
      const isStudyLocked = Boolean(initialStudyId)

      const initialFirstResult = initialStudyId
        ? await getStudyFirstByStudyId(Number(initialStudyId), organisationIds)
        : { data: null }

      return {
        props: {
          user: session.user,
          studies: studies.data,
          initialStudyId,
          isStudyLocked,
          study: null,
          initialFirst: initialFirstResult.data,
          returnUrl: initialStudyId
              ? `/studies/${initialStudyId}/`
              : '/studies',
        },
      }
    } catch {
      return { redirect: { destination: '/500' } }
    }
  }
)