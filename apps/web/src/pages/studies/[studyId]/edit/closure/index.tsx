import { Container } from '@nihr-ui/frontend'
import { logger } from '@nihr-ui/logger'
import clsx from 'clsx'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { type ReactElement, useEffect, useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'

import { ErrorSummary, Fieldset, Form, Radio, RadioGroup } from '@/components/atoms'
import { Textarea } from '@/components/atoms/Form/Textarea/Textarea'
import { TextInput } from '@/components/atoms/Form/TextInput/TextInput'
import { RequestSupport } from '@/components/molecules'
import { RootLayout } from '@/components/organisms'
import { Roles } from '@/constants'
import { PAGE_TITLE } from '@/constants/editStudyForm'
import { getStudyById } from '@/lib/studies'
import { withServerSideProps } from '@/utils/withServerSideProps'
import { ClosureDraftProvider, useClosureDraft } from '@/context/closureDraftContext'
import { TEXTAREA_MAX_CHARACTERS } from '@/constants/forms'
import { closureDraftStorageKey } from '@/utils/storageKeys'

export type ClosureOfStudyProps = InferGetServerSidePropsType<typeof getServerSideProps>

type YesNo = 'YES' | 'NO'

type ClosureOfStudyFormValues = {
    isFinalRecruitmentTotalCorrect?: YesNo
    correctedRecruitmentTotal?: string
    didPerformanceDeliverInline?: YesNo
    performanceNoReason?: string
    furtherInformation?: string
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

export default function ClosureOfStudy({ study }: ClosureOfStudyProps) {
    const router = useRouter()
    const { draft, setDraft } = useClosureDraft()

    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    useEffect(() => {
        if (!mounted) return

        const expectedId = String(study.id)
        const hasDraftForStudy = draft?.studyId && String(draft.studyId) === expectedId

        if (!hasDraftForStudy) {
            router.replace(`/studies/${study.id}/edit`)
        }
    }, [draft?.studyId, mounted, router, study.id])

    const defaultValues: ClosureOfStudyFormValues = useMemo(
        () => ({
            isFinalRecruitmentTotalCorrect: draft.isFinalRecruitmentTotalCorrect,
            correctedRecruitmentTotal: draft.correctedRecruitmentTotal ?? '',
            didPerformanceDeliverInline: draft.didPerformanceDeliverInline,
            performanceNoReason: draft.performanceNoReason ?? '',
            furtherInformation: draft.furtherInformation ?? '',
        }),
        [
            draft.correctedRecruitmentTotal,
            draft.didPerformanceDeliverInline,
            draft.furtherInformation,
            draft.isFinalRecruitmentTotalCorrect,
            draft.performanceNoReason,
        ]
    )

    const { control, setValue, register, handleSubmit, formState, watch } = useForm<ClosureOfStudyFormValues>({
        defaultValues,
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    })


    const performanceAnswer = useWatch({ control, name: 'didPerformanceDeliverInline' })
    const recruitmentAnswer = useWatch({ control, name: 'isFinalRecruitmentTotalCorrect' })

    useEffect(() => {
        if (performanceAnswer === 'YES') {
            setValue('performanceNoReason', '', { shouldDirty: true, shouldTouch: true })
        }
    }, [performanceAnswer, setValue])

    useEffect(() => {
        if (recruitmentAnswer === 'YES') {
            setValue('correctedRecruitmentTotal', '', { shouldDirty: true, shouldTouch: true })
        }
    }, [recruitmentAnswer, setValue])

    const furtherInformationText = watch('furtherInformation') ?? ''
    const remainingCharacters =
        furtherInformationText.length >= TEXTAREA_MAX_CHARACTERS
            ? 0
            : TEXTAREA_MAX_CHARACTERS - furtherInformationText.length

    const performanceNoText = watch('performanceNoReason') ?? ''
    const remainingPerformanceNoCharacters =
        performanceNoText.length >= TEXTAREA_MAX_CHARACTERS
            ? 0
            : TEXTAREA_MAX_CHARACTERS - performanceNoText.length

    const showLoadingState = formState.isSubmitting

    const onNext = handleSubmit(async (values) => {
        const correctedRecruitmentTotal = (values.correctedRecruitmentTotal ?? '').replace(/\D/g, '')

        setDraft((prev) => ({
            ...prev,
            studyId: prev.studyId,
            cpmsId: prev.cpmsId,

            isFinalRecruitmentTotalCorrect: values.isFinalRecruitmentTotalCorrect,
            correctedRecruitmentTotal,
            didPerformanceDeliverInline: values.didPerformanceDeliverInline,
            performanceNoReason: values.performanceNoReason,
            furtherInformation: values.furtherInformation,
        }))

        await router.push(`/studies/${study.id}/edit/closure/review`)
    })

    const onCancel = () => {
        sessionStorage.removeItem(closureDraftStorageKey(study.id))
        router.push(`/studies/${study.id}`)
    }

    return (
        <Container>
            <NextSeo title="Study Progress Review - Closure of study" />

            <div className="lg:flex lg:gap-6">
                <div className="w-full">
                    <h2 className="govuk-heading-l govuk-!-margin-bottom-6">
                        <span className="govuk-visually-hidden">Page title: </span>
                        Closure of study
                    </h2>

                    <span className="govuk-body-m mb-0 text-darkGrey">
                        <span className="govuk-visually-hidden">Study sponsor: </span>
                        {study.organisationsByRole?.CRO ?? study.organisationsByRole?.CTU ?? study.organisationsByRole?.Sponsor ?? '-'}
                    </span>

                    <span className="govuk-heading-m text-primary">
                        <span className="govuk-visually-hidden">Study short title: </span>
                        {study.shortTitle || '-'}
                    </span>

                    <dl className="govuk-summary-list govuk-summary-list--no-border govuk-!-margin-top-6 govuk-!-margin-bottom-6">
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">UK recruitment target</dt>
                            <dd className="govuk-summary-list__value">{study.sampleSize ?? '-'}</dd>
                        </div>

                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Final recruitment total UK</dt>
                            <dd className="govuk-summary-list__value">{study.totalRecruitmentToDate ?? '-'}</dd>
                        </div>
                    </dl>

                    <Form action="#" handleSubmit={handleSubmit} method="post" onError={() => { }}>

                        <ErrorSummary errors={{}} />

                        <Fieldset>
                            <Controller
                                control={control}
                                name="isFinalRecruitmentTotalCorrect"
                                render={({ field }) => (
                                    <RadioGroup
                                        errors={{}}
                                        label="Is final recruitment total correct?"
                                        labelSize="m"
                                        name={field.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value as YesNo)}
                                        defaultValue={field.value}
                                    >
                                        <Radio label="Yes" value="YES" />
                                        <Radio label="No" value="NO" />
                                    </RadioGroup>
                                )}
                            />

                            <Controller
                                control={control}
                                name="correctedRecruitmentTotal"
                                render={({ field }) => (
                                    <TextInput
                                        errors={{}}
                                        inputClassName="govuk-input--width-10"
                                        label="If 'No' please provide the correct number"
                                        labelSize="m"
                                        inputMode="numeric"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            field.onChange(e.target.value.replace(/\D/g, ''))
                                        }}
                                        value={field.value ?? ''}
                                        name={field.name}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="didPerformanceDeliverInline"
                                render={({ field }) => (
                                    <RadioGroup
                                        errors={{}}
                                        label="Did the UK performance deliver inline with expectations?"
                                        labelSize="m"
                                        name={field.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(e.target.value as YesNo)}
                                        defaultValue={field.value}
                                    >
                                        <Radio label="Yes" value="YES" />
                                        <Radio label="No" value="NO" />
                                    </RadioGroup>
                                )}
                            />

                            <Textarea
                                errors={{}}
                                label="If 'No' please briefly explain why"
                                hint="If needed, provide further context or justification for changes made above."
                                labelSize="m"
                                required={false}
                                defaultValue=''
                                maxLength={TEXTAREA_MAX_CHARACTERS}
                                remainingCharacters={remainingPerformanceNoCharacters}
                                {...register('performanceNoReason')}
                            />

                            <Textarea
                                errors={{}}
                                label="Further information (optional)"
                                hint="If needed, provide further context or justification for changes made above."
                                labelSize="m"
                                required={false}
                                defaultValue=''
                                maxLength={TEXTAREA_MAX_CHARACTERS}
                                remainingCharacters={remainingCharacters}
                                {...register('furtherInformation')}
                            />

                            <div className="govuk-button-group">
                                <button
                                    type="button"
                                    className={clsx('govuk-button', { 'pointer-events-none': showLoadingState })}
                                    onClick={onNext}
                                >
                                    Next
                                </button>


                                <button
                                    type="button"
                                    className="govuk-button govuk-button--secondary"
                                    onClick={onCancel}
                                >
                                    Cancel
                                </button>

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

ClosureOfStudy.getLayout = function getLayout(page: ReactElement, { user, study }: ClosureOfStudyProps) {
    return (
        <ClosureDraftProvider studyId={study.id.toString()}>
            <RootLayout breadcrumbConfig={{ showBreadcrumb: true }} heading={PAGE_TITLE} user={user}>
                {page}
            </RootLayout>
        </ClosureDraftProvider>
    )
}

export const getServerSideProps = withServerSideProps([Roles.SponsorContact], async (context, session) => {
    const userOrganisationIds = session.user?.organisations.map((userOrg) => userOrg.organisationId)

    const { data: study } = await getStudyById(Number(context.query.studyId), userOrganisationIds)

    if (!study) {
        return {
            redirect: { destination: '/404' },
        }
    }

    logger.info('Closure of study: retrieved study with studyId: %s', context.query.studyId)

    return {
        props: {
            user: session.user,
            study,
            heading: PAGE_TITLE,
        },
    }
})