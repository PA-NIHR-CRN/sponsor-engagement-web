import { Container } from '@nihr-ui/frontend'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { type ReactElement } from 'react'

import { RootLayout } from '@/components/organisms'
import { RequestSupport } from '@/components/molecules'
import { PAGE_TITLE } from '@/constants/editStudyForm'
import { formatDate, constructDateStrFromParts } from '@/utils/date'
import { useClosureDraft } from '@/context/closureDraftContext'
import { mapCPMSStatusToFormStatus } from '@/lib/studies'

export default function ClosureReviewPage() {
    const router = useRouter()
    const { draft } = useClosureDraft()

    const studyId = draft.studyId
    const editStep1Href = `/studies/${studyId}/edit`
    const editStep2Href = `/studies/${studyId}/closure`

    const formatDateParts = (parts?: any | null) => {
        const iso = constructDateStrFromParts(parts ?? null, true)
        return iso ? formatDate(iso, 'slash') : '-'
    }

    const yesNoLabel = (val?: 'YES' | 'NO') => {
        if (val === 'YES') return 'Yes'
        if (val === 'NO') return 'No'
        return '-'
    }

    return (
        <Container>
            <NextSeo title="Study Progress Review - Review your closure details" />

            <div className="lg:flex lg:gap-6">
                <div className="w-full">
                    <h1 className="govuk-heading-l govuk-!-margin-bottom-4">Closure of study</h1>

                    <span className="govuk-body-m text-darkGrey">
                        <span className="govuk-visually-hidden">Study sponsor: </span>
                        Ensure all information is correct before submitting. You must select “Submit and close” at the end for any action to take place.
                    </span>
                    <h2 className='govuk-heading-m govuk-!-margin-top-4'>Overview</h2>
                    <dl className="govuk-summary-list">
                        {/* 1) Status */}
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Status</dt>
                            <dd className="govuk-summary-list__value">{mapCPMSStatusToFormStatus(draft.status!) ?? '-'}</dd>
                            <dd className="govuk-summary-list__actions">
                                <Link className="govuk-link" href={editStep1Href}>
                                    Edit<span className="govuk-visually-hidden"> status</span>
                                </Link>
                            </dd>
                        </div>

                        {/* 2) Actual UK closure date */}
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Actual UK closure to recruitment date</dt>
                            <dd className="govuk-summary-list__value">{formatDateParts(draft.actualClosureDate)}</dd>
                            <dd className="govuk-summary-list__actions">
                                <Link className="govuk-link" href={editStep1Href}>
                                    Edit<span className="govuk-visually-hidden"> actual UK closure to recruitment date</span>
                                </Link>
                            </dd>
                        </div>

                        {/* 3) Final recruitment total correct */}
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Final recruitment total correct</dt>
                            <dd className="govuk-summary-list__value">{yesNoLabel(draft.isFinalRecruitmentTotalCorrect)}</dd>
                            <dd className="govuk-summary-list__actions">
                                <Link className="govuk-link" href={editStep2Href}>
                                    Edit<span className="govuk-visually-hidden"> final recruitment total correct</span>
                                </Link>
                            </dd>
                        </div>

                        {/* 4) Performance expectations (+ nested explanation if provided) */}
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Performance expectations</dt>
                            <dd className="govuk-summary-list__value">
                                <p className="govuk-body govuk-!-margin-bottom-1">{yesNoLabel(draft.didPerformanceDeliverInline)}</p>

                                {draft.performanceNoReason ? (
                                    <p className="govuk-body-s govuk-!-margin-bottom-0 text-darkGrey">
                                        "{draft.performanceNoReason}"
                                    </p>
                                ) : null}
                            </dd>
                            <dd className="govuk-summary-list__actions">
                                <Link className="govuk-link" href={editStep2Href}>
                                    Edit<span className="govuk-visually-hidden"> performance expectations</span>
                                </Link>
                            </dd>
                        </div>

                        {/* 5) Further information (ONLY Step 2’s) */}
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Further information</dt>
                            <dd className="govuk-summary-list__value">{draft.furtherInformation?.trim() || '-'}</dd>
                            <dd className="govuk-summary-list__actions">
                                <Link className="govuk-link" href={editStep2Href}>
                                    Edit<span className="govuk-visually-hidden"> further information</span>
                                </Link>
                            </dd>
                        </div>

                        {/* 6) UK recruitment target */}
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">UK recruitment target</dt>
                            <dd className="govuk-summary-list__value">{draft.recruitmentTarget ?? '-'}</dd>
                            <dd className="govuk-summary-list__actions">
                                <Link className="govuk-link" href={editStep1Href}>
                                    Edit<span className="govuk-visually-hidden"> UK recruitment target</span>
                                </Link>
                            </dd>
                        </div>

                        {/* 7) Actual UK opening date */}
                        <div className="govuk-summary-list__row">
                            <dt className="govuk-summary-list__key">Actual UK opening to recruitment date</dt>
                            <dd className="govuk-summary-list__value">{formatDateParts(draft.actualOpeningDate)}</dd>
                            <dd className="govuk-summary-list__actions">
                                <Link className="govuk-link" href={editStep1Href}>
                                    Edit<span className="govuk-visually-hidden"> actual UK opening to recruitment date</span>
                                </Link>
                            </dd>
                        </div>

                        {/* 8) Planned UK closure date */}
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

                    <div className="govuk-button-group govuk-!-margin-top-6">

                        <button
                            type="button"
                            className="govuk-button"
                            onClick={() => router.push(`/studies/${studyId}/closure/confirmation`)}
                        >
                            Submit and close study
                        </button>


                        <Link className="govuk-button govuk-button--secondary" href={`/studies/${studyId}`}>
                            Cancel
                        </Link>
                    </div>
                </div>

                <div className="lg:min-w-[300px] lg:max-w-[300px]">
                    <RequestSupport showCallToAction sticky />
                </div>
            </div>
        </Container>
    )
}

ClosureReviewPage.getLayout = function getLayout(page: ReactElement, { user }: any) {
    return (
        <RootLayout
            breadcrumbConfig={{ showBreadcrumb: true }}
            heading={PAGE_TITLE}
            user={user}
        >
            {page}
        </RootLayout>
    )
}