import { Container } from '@nihr-ui/frontend'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { type ReactElement, useMemo } from 'react'

import { RootLayout } from '@/components/organisms'
import { RequestSupport } from '@/components/molecules'
import { PAGE_TITLE } from '@/constants/editStudyForm'
import { formatDate, constructDateStrFromParts } from '@/utils/date'
import { ClosureDraftProvider, useClosureDraft } from '@/context/closureDraftContext'
import { getStudyById, mapCPMSStatusToFormStatus } from '@/lib/studies'
import type { DateInputValue } from '@/components/atoms/Form/DateInput/types'
import { withServerSideProps } from '@/utils/withServerSideProps'
import { Roles } from '@/constants/auth'
import { closureDraftStorageKey } from '@/utils/storageKeys'
import { ClosureOfStudyProps } from '.'
import { useRouter } from 'next/router'

export default function ClosureReviewPage({ study }: Readonly<ClosureOfStudyProps>) {
    const { draft } = useClosureDraft()
    const router = useRouter()

    const studyId = draft.studyId
    const editStep1Href = `/studies/${studyId}/edit`
    const editStep2Href = `/studies/${studyId}/edit/closure`

    const formatDateParts = (parts?: DateInputValue | null) => {
        const iso = constructDateStrFromParts(parts ?? null, true)
        return iso ? formatDate(iso, 'slash') : '-'
    }

    const yesNoLabel = (val?: 'YES' | 'NO') => {
        if (val === 'YES') return 'Yes'
        if (val === 'NO') return 'No'
        return '-'
    }

    const dateParts = (d?: DateInputValue | null) => ({
        day: d?.day ?? '',
        month: d?.month ?? '',
        year: d?.year ?? '',
    })

    const actualClosure = dateParts(draft.actualClosureDate)
    const actualOpening = dateParts(draft.actualOpeningDate)
    const plannedClosure = dateParts(draft.plannedClosureDate)
    const plannedOpening = dateParts(draft.originalValues?.plannedOpeningDate)
    const estimatedReopening = dateParts(draft.originalValues?.estimatedReopeningDate)

    const originalValuesJson = useMemo(() => {
        try {
            return JSON.stringify(draft.originalValues ?? {})
        } catch {
            return '{}'
        }
    }, [draft.originalValues])

    const onCancel = () => {
        sessionStorage.removeItem(closureDraftStorageKey(study.id))
        router.push(`/studies/${study.id}`)
    }

    return (
        <Container>
            <NextSeo title="Study Progress Review - Review your closure details" />

            <div className="lg:flex lg:gap-6">
                <div className="w-full">
                    <h1 className="govuk-heading-l govuk-!-margin-bottom-4">Closure of study</h1>

                    <span className="govuk-body-m text-darkGrey block">
                        <span className="govuk-visually-hidden">Guidance: </span>{' '}
                        Ensure all information is correct before submitting. You must select “Submit and close” at the end for any
                        action to take place.
                    </span>

                    <h2 className="govuk-heading-m govuk-!-margin-top-4">Overview</h2>

                    <dl className="govuk-summary-list">
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Status</dt>
                            <dd className="govuk-summary-list__value">
                                {draft.status ? mapCPMSStatusToFormStatus(draft.status) : '-'}
                            </dd>
                            <dd className="govuk-summary-list__actions">
                                <Link className="govuk-link" href={editStep1Href}>
                                    Edit<span className="govuk-visually-hidden"> status</span>
                                </Link>
                            </dd>
                        </div>

                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Actual UK closure to recruitment date</dt>
                            <dd className="govuk-summary-list__value">{formatDateParts(draft.actualClosureDate)}</dd>
                            <dd className="govuk-summary-list__actions">
                                <Link className="govuk-link" href={editStep1Href}>
                                    Edit<span className="govuk-visually-hidden"> actual UK closure to recruitment date</span>
                                </Link>
                            </dd>
                        </div>

                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Final recruitment total correct</dt>
                            <dd className="govuk-summary-list__value">
                                <p className="govuk-body govuk-!-margin-bottom-1">{yesNoLabel(draft.isFinalRecruitmentTotalCorrect)}</p>
                                {draft.correctedRecruitmentTotal ? (
                                    <p className="govuk-body-s govuk-!-margin-bottom-0 text-darkGrey">
                                        Corrected recruitment total: {draft.correctedRecruitmentTotal}
                                    </p>
                                ) : null}
                            </dd>
                            <dd className="govuk-summary-list__actions">
                                <Link className="govuk-link" href={editStep2Href}>
                                    Edit<span className="govuk-visually-hidden"> final recruitment total correct</span>
                                </Link>
                            </dd>
                        </div>

                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Performance expectations</dt>
                            <dd className="govuk-summary-list__value">
                                <p className="govuk-body govuk-!-margin-bottom-1">{yesNoLabel(draft.didPerformanceDeliverInline)}</p>

                                {draft.performanceNoReason ? (
                                    <p className="govuk-body-s govuk-!-margin-bottom-0 text-darkGrey">
                                        “{draft.performanceNoReason}”
                                    </p>
                                ) : null}
                            </dd>
                            <dd className="govuk-summary-list__actions">
                                <Link className="govuk-link" href={editStep2Href}>
                                    Edit<span className="govuk-visually-hidden"> performance expectations</span>
                                </Link>
                            </dd>
                        </div>

                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Further information</dt>
                            <dd className="govuk-summary-list__value">{draft.furtherInformation?.trim() || '-'}</dd>
                            <dd className="govuk-summary-list__actions">
                                <Link className="govuk-link" href={editStep2Href}>
                                    Edit<span className="govuk-visually-hidden"> further information</span>
                                </Link>
                            </dd>
                        </div>

                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">UK recruitment target</dt>
                            <dd className="govuk-summary-list__value">{draft.recruitmentTarget ?? '-'}</dd>
                            <dd className="govuk-summary-list__actions">
                                <Link className="govuk-link" href={editStep1Href}>
                                    Edit<span className="govuk-visually-hidden"> UK recruitment target</span>
                                </Link>
                            </dd>
                        </div>

                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Actual UK opening to recruitment date</dt>
                            <dd className="govuk-summary-list__value">{formatDateParts(draft.actualOpeningDate)}</dd>
                            <dd className="govuk-summary-list__actions">
                                <Link className="govuk-link" href={editStep1Href}>
                                    Edit<span className="govuk-visually-hidden"> actual UK opening to recruitment date</span>
                                </Link>
                            </dd>
                        </div>

                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Planned UK closure to recruitment date</dt>
                            <dd className="govuk-summary-list__value">{formatDateParts(draft.plannedClosureDate)}</dd>
                            <dd className="govuk-summary-list__actions">
                                <Link className="govuk-link" href={editStep1Href}>
                                    Edit<span className="govuk-visually-hidden"> planned UK closure to recruitment date</span>
                                </Link>
                            </dd>
                        </div>
                    </dl>

                    <form action="/api/forms/editStudy" method="post" className="govuk-!-margin-top-6">

                        <input type="hidden" name="studyId" value={draft.studyId ?? ''} />
                        <input type="hidden" name="cpmsId" value={draft.cpmsId ?? ''} />
                        <input type="hidden" name="status" value={draft.status ?? ''} />
                        <input type="hidden" name="recruitmentTarget" value={draft.recruitmentTarget ?? ''} />

                        <input type="hidden" name="LSN" value={draft.LSN ?? ''} />
                        <input type="hidden" name="originalValues" value={originalValuesJson} />

                        <input type="hidden" name="actualClosureDate-day" value={actualClosure.day} />
                        <input type="hidden" name="actualClosureDate-month" value={actualClosure.month} />
                        <input type="hidden" name="actualClosureDate-year" value={actualClosure.year} />

                        <input type="hidden" name="actualOpeningDate-day" value={actualOpening.day} />
                        <input type="hidden" name="actualOpeningDate-month" value={actualOpening.month} />
                        <input type="hidden" name="actualOpeningDate-year" value={actualOpening.year} />

                        <input type="hidden" name="plannedClosureDate-day" value={plannedClosure.day} />
                        <input type="hidden" name="plannedClosureDate-month" value={plannedClosure.month} />
                        <input type="hidden" name="plannedClosureDate-year" value={plannedClosure.year} />

                        <input type="hidden" name="plannedOpeningDate-day" value={plannedOpening.day} />
                        <input type="hidden" name="plannedOpeningDate-month" value={plannedOpening.month} />
                        <input type="hidden" name="plannedOpeningDate-year" value={plannedOpening.year} />

                        <input type="hidden" name="estimatedReopeningDate-day" value={estimatedReopening.day} />
                        <input type="hidden" name="estimatedReopeningDate-month" value={estimatedReopening.month} />
                        <input type="hidden" name="estimatedReopeningDate-year" value={estimatedReopening.year} />

                        <input
                            type="hidden"
                            name="isFinalRecruitmentTotalCorrect"
                            value={draft.isFinalRecruitmentTotalCorrect ?? ''}
                        />
                        <input
                            type="hidden"
                            name="correctedRecruitmentTotal"
                            value={draft.correctedRecruitmentTotal ?? ''}
                        />
                        <input
                            type="hidden"
                            name="didPerformanceDeliverInline"
                            value={draft.didPerformanceDeliverInline ?? ''}
                        />
                        <input
                            type="hidden"
                            name="performanceNoReason"
                            value={draft.performanceNoReason ?? ''}
                        />
                        <input
                            type="hidden"
                            name="closureFurtherInformation"
                            value={draft.furtherInformation ?? ''}
                        />

                        <div className="govuk-button-group">
                            <button type="submit" className="govuk-button">
                                Submit and close study
                            </button>

                            <button
                                type="button"
                                className="govuk-button govuk-button--secondary"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                <div className="lg:min-w-[300px] lg:max-w-[300px]">
                    <RequestSupport showCallToAction sticky />
                </div>
            </div>
        </Container>
    )
}

ClosureReviewPage.getLayout = function getLayout(page: ReactElement, { user, study }: any) {
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

    return {
        props: {
            user: session.user,
            study,
            heading: PAGE_TITLE,
        },
    }
})