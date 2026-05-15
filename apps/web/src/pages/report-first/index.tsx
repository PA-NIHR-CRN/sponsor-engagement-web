import { zodResolver } from '@hookform/resolvers/zod'
import { Container } from '@nihr-ui/frontend'
import clsx from 'clsx'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { type ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import type { FieldError } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'

import { DateInput, Fieldset, Form, Radio, RadioGroup } from '@/components/atoms'
import type { DateInputValue } from '@/components/atoms/Form/DateInput/types'
import { Select } from '@/components/atoms/Form/Select/Select'
import { TextInput } from '@/components/atoms/Form/TextInput/TextInput'
import { Textarea } from '@/components/atoms/Form/Textarea/Textarea'
import { RequestSupport } from '@/components/molecules'
import { RootLayout } from '@/components/organisms'
import { Roles } from '@/constants'
import { TEXTAREA_MAX_CHARACTERS } from '@/constants/forms'
import { useFormErrorHydration } from '@/hooks/useFormErrorHydration'
import { getStudyById, getStudyTitlesForOrgs } from '@/lib/studies'
import { getStudyFirstByStudyId } from '@/lib/studyFirsts'
import { reportFirstSchema, type ReportFirstInputs } from '@/utils/schemas/reportFirst.schema'
import { withServerSideProps } from '@/utils/withServerSideProps'
import { FirstType } from 'database'

export type ReportFirstProps = InferGetServerSidePropsType<typeof getServerSideProps>

const EMPTY_DATE: DateInputValue = { day: '', month: '', year: '' }

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

const buildDefaultValues = (
    studyId: string,
    first: ReportFirstProps['initialFirst']
): Partial<ReportFirstInputs> => ({
    studyId: studyId || '',
    type: first?.type as FirstType ?? undefined,
    firstAt: first?.firstAt ? toDateParts(first.firstAt) : EMPTY_DATE,
    siteName: first?.siteName ?? '',
    piTitle: first?.piTitle ?? '',
    piFullName: first?.piFullName ?? '',
    piEmail: first?.piEmail ?? '',
})

type StudyFirstApiResponse = { first: ReportFirstProps['initialFirst'] | null }

export default function ReportFirst({
    studies,
    initialStudyId,
    initialFirst,
    returnUrl,
    isStudyLocked,
    study
}: Readonly<ReportFirstProps>) {
    const router = useRouter()

    const [isFetchingFirst, setIsFetchingFirst] = useState(false)

    const {
        control,
        register,
        reset,
        setError,
        handleSubmit,
        formState,
        watch,
    } = useForm<ReportFirstInputs>({
        resolver: zodResolver(reportFirstSchema),
        defaultValues: buildDefaultValues(initialStudyId, initialFirst) as ReportFirstInputs,
    })

    const previousStudyIdRef = useRef<string>(initialStudyId || '')

    useEffect(() => {
        reset(buildDefaultValues(initialStudyId, initialFirst) as ReportFirstInputs)
        previousStudyIdRef.current = initialStudyId || ''
    }, [initialStudyId, initialFirst, reset])

    const siteNameText = watch('siteName') ?? ''
    const remainingCharacters =
        siteNameText.length >= TEXTAREA_MAX_CHARACTERS ? 0 : TEXTAREA_MAX_CHARACTERS - siteNameText.length

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

    const safeReturnUrl = returnUrl.startsWith('/') ? returnUrl : `/${returnUrl}`

    const fetchStudyFirst = async (studyId: string) => {
        const res = await fetch(`/api/study-first?studyId=${encodeURIComponent(studyId)}`, {
            method: 'GET',
            headers: { Accept: 'application/json' },
        })

        if (!res.ok) {
            throw new Error(`Failed to load first record (${res.status})`)
        }

        const data = (await res.json()) as StudyFirstApiResponse
        return data.first ?? null
    }

    const handleStudyChange = async (nextStudyId: string) => {
        try {
            if (!nextStudyId) {
                reset(buildDefaultValues('', null) as ReportFirstInputs, {
                    keepDirty: false,
                    keepErrors: false,
                    keepTouched: false,
                })
                previousStudyIdRef.current = ''
                await router.replace(
                    { pathname: router.pathname, query: { returnUrl: safeReturnUrl } },
                    undefined,
                    { shallow: true }
                )
                return
            }

            const first = await fetchStudyFirst(nextStudyId)

            reset(buildDefaultValues(nextStudyId, first) as ReportFirstInputs, {
                keepDirty: false,
                keepErrors: false,
                keepTouched: false,
            })

            previousStudyIdRef.current = nextStudyId

            await router.replace(
                { pathname: router.pathname, query: { returnUrl: safeReturnUrl, studyId: nextStudyId } },
                undefined,
                { shallow: true }
            )
        } catch (e: unknown) {
            reset(buildDefaultValues(nextStudyId, null) as ReportFirstInputs, {
                keepDirty: false,
                keepErrors: false,
                keepTouched: false,
            })
            previousStudyIdRef.current = nextStudyId
        } finally {
            setIsFetchingFirst(false)
        }
    }

    return (
        <Container>
            <Form
                action={`/api/forms/reportFirst?returnUrl=${encodeURIComponent(safeReturnUrl)}`}
                handleSubmit={handleSubmit}
                method="post"
                onError={(message: string) => {
                    setError('root' as any, { type: '400', message } as any)
                }}
            >

                <NextSeo title="Report a First" />

                <div className="lg:flex lg:gap-6">
                    <div className="w-full">
                        <h2 className="govuk-heading-l govuk-!-margin-bottom-6">Report a 'First'</h2>

                        {study ? (
                            <>
                                <div className="govuk-body-s govuk-!-margin-bottom-0 text-darkGrey">
                                    <span className="govuk-visually-hidden">Study sponsor: </span>
                                    {study.organisationsByRole.Sponsor}
                                    {(() => {
                                        const supportOrgName = study.organisationsByRole.CRO ?? study.organisationsByRole.CTU
                                        return supportOrgName ? ` (${supportOrgName})` : null
                                    })()}
                                </div>

                                <h3 className="govuk-heading-m govuk-!-margin-bottom-6">
                                    <span className="govuk-visually-hidden">Study title: </span>
                                    {study.shortTitle}
                                </h3>
                            </>
                        ) : null}

                        <p className="govuk-body govuk-!-margin-bottom-6">
                            Reporting a first helps us capture key study milestones quickly and accurately. Your direct submission reduces follow‑up
                            emails, improves data quality, and ensures important achievements - such as global or European firsts - are recorded and
                            linked to wider systems in real time.
                        </p>

                        <Fieldset>
                            {!isStudyLocked ? (
                                <Controller
                                    name="studyId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            name={field.name}
                                            label="Select study"
                                            labelSize="m"
                                            errors={errors}
                                            required
                                            value={field.value ?? ''}
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
                                                ...studies.map((study) => (
                                                    <option key={study.id} value={String(study.id)}>
                                                        {study.shortTitle}
                                                    </option>
                                                )),
                                            ]}
                                        />
                                    )}
                                />) : null}

                            <RadioGroup
                                errors={errors}
                                label="Type of First"
                                labelSize="m"
                                {...register('type')}
                            >
                                <Radio label="Global" value="global" hint="The UK has consented the first participant in a global study." />
                                <Radio label="European" value="european" hint="The UK has consented the first participant in a European study." />
                            </RadioGroup>

                            <Controller
                                name="firstAt"
                                control={control}
                                render={({ field }) => (
                                    <DateInput
                                        label="First patient / First visit"
                                        name="firstAt"
                                        hint="The date the first participant was consented to the study"
                                        errors={errors}
                                        value={field.value as any}
                                        onChange={(value: DateInputValue) => field.onChange(value)}
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

                            <TextInput label="Title" labelSize="m" errors={errors} {...register('piTitle')} />
                            <TextInput label="Full name" labelSize="m" errors={errors} {...register('piFullName')} />
                            <TextInput label="Email address" labelSize="m" errors={errors} {...register('piEmail')} />

                            <div className="govuk-button-group">
                                <button
                                    className={clsx('govuk-button', { 'pointer-events-none': formState.isLoading })}
                                    type="submit"
                                    disabled={isFetchingFirst}
                                >
                                    Submit
                                </button>

                                <Link className="govuk-button govuk-button--secondary" href={safeReturnUrl}>
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
    const safeReturnUrl = (props.returnUrl ?? '/studies').startsWith('/')
        ? (props.returnUrl ?? '/studies')
        : `/${props.returnUrl ?? 'studies'}`

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

            const studyIdFromQuery =
                typeof context.query.studyId === 'string' ? context.query.studyId : ''

            const studyIdNumber = Number(studyIdFromQuery)
            const hasStudyIdInQuery =
                Boolean(studyIdFromQuery) && Number.isFinite(studyIdNumber) && studyIdNumber > 0

            const returnUrlFromQuery =
                typeof context.query.returnUrl === 'string' ? context.query.returnUrl : ''

            const safeReturnUrl =
                returnUrlFromQuery &&
                    returnUrlFromQuery.startsWith('/') &&
                    !returnUrlFromQuery.startsWith('//')
                    ? returnUrlFromQuery
                    : null

            // -------------------------
            // From a study page
            // -------------------------
            if (hasStudyIdInQuery) {
                const studyResult = await getStudyById(studyIdNumber, organisationIds)

                if (!studyResult?.data) {
                    return { notFound: true }
                }

                const initialStudyId = String(studyResult.data.id)
                const isStudyLocked = true

                const initialFirstResult = await getStudyFirstByStudyId(studyIdNumber, organisationIds)

                const returnUrl = safeReturnUrl ?? `/studies/${initialStudyId}/`

                return {
                    props: {
                        user: session.user,
                        studies: [],
                        initialStudyId,
                        isStudyLocked,
                        study: studyResult.data,
                        initialFirst: initialFirstResult.data,
                        returnUrl,
                    },
                }
            }

            // -------------------------
            // From study list page
            // -------------------------
            const studies = await getStudyTitlesForOrgs({ organisationIds })

            const allowedIds = new Set(studies.data.map((s) => String(s.id)))
            const initialStudyId = allowedIds.has(studyIdFromQuery) ? studyIdFromQuery : ''

            const isStudyLocked = Boolean(initialStudyId)

            const initialFirstResult = initialStudyId
                ? await getStudyFirstByStudyId(Number(initialStudyId), organisationIds)
                : { data: null }

            const returnUrl =
                safeReturnUrl ??
                (initialStudyId ? `/studies/${initialStudyId}/` : '/studies')

            return {
                props: {
                    user: session.user,
                    studies: studies.data,
                    initialStudyId,
                    isStudyLocked,
                    study: null,
                    initialFirst: initialFirstResult.data,
                    returnUrl,
                },
            }
        } catch {
            return { redirect: { destination: '/500' } }
        }
    }
)