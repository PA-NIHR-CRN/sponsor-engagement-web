import Link from 'next/link'

import { Card } from '@/components/atoms'

export interface StudyListProps {
  sponsorOrgName?: string
  supportOrgName?: string
  shortTitle: string
  studyHref: string
  lastAssessmentDate?: string
  daysSinceAssessmentDue: number | null
  trackStatus?: string
  trackStatusHref?: string
  indications?: string[]
  irasId: string | null
}

export function StudyList({
  sponsorOrgName,
  supportOrgName,
  shortTitle,
  studyHref,
  daysSinceAssessmentDue,
  trackStatus,
  trackStatusHref,
  lastAssessmentDate,
  indications,
  irasId,
}: StudyListProps) {
  const daysDueText =
    daysSinceAssessmentDue !== null
      ? `Due for ${daysSinceAssessmentDue || '1'} day${daysSinceAssessmentDue > 1 ? 's' : ''}`
      : ''

  return (
    <Card>
      {daysSinceAssessmentDue !== null ? (
        <>
          <span className="govuk-visually-hidden">{shortTitle} has been</span>
          <span className="govuk-tag govuk-tag--red absolute top-0 right-0 normal-case">{daysDueText}</span>
        </>
      ) : null}

      <div className="md:max-w-[calc(100%-50px)]">
        <div className="text-darkGrey govuk-!-margin-bottom-1 max-w-[calc(100%-45px)] lg:max-w-auto govuk-body-s">
          {sponsorOrgName ?? '-'}
          {Boolean(supportOrgName) && ` (${supportOrgName})`}
        </div>
        <div className="govuk-heading-s govuk-!-margin-bottom-0 govuk-!-padding-top-0 inline-block font-extrabold">
          {shortTitle}
        </div>
        <div className="govuk-body-s govuk-!-margin-bottom-2 govuk-!-padding-top-0">
          IRAS ID: {irasId || 'Not available '}
        </div>
      </div>

      <div className="sm:flex sm:justify-between lg:justify-normal sm:gap-3">
        <div className="lg:min-w-[320px]">
          <strong className="govuk-heading-s govuk-!-margin-bottom-0">Last sponsor assessment</strong>
          <p className="govuk-body-s govuk-!-margin-top-1 govuk-!-margin-bottom-0">
            {trackStatus ? (
              <>
                {trackStatusHref ? (
                  <Link className="govuk-link--no-visited-state" href={trackStatusHref}>
                    {trackStatus}
                  </Link>
                ) : (
                  trackStatus
                )}{' '}
                on {lastAssessmentDate}
              </>
            ) : (
              'None'
            )}
          </p>
        </div>

        <div className="lg:min-w-[320px]">
          <strong className="govuk-heading-s govuk-!-margin-bottom-0">Study data indicates</strong>
          <p className="govuk-body-s govuk-!-margin-top-1 govuk-!-margin-bottom-0">
            {indications?.length ? indications.join(', ') : 'No concerns'}
          </p>
        </div>

        <div className="text-right lg:w-full">
          <Link
            aria-label={`View study ${shortTitle}`}
            className="govuk-button w-auto govuk-!-margin-bottom-0"
            href={studyHref}
          >
            View study
          </Link>
        </div>
      </div>
    </Card>
  )
}
