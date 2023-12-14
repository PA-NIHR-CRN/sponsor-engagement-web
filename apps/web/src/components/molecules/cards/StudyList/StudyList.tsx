import Link from 'next/link'
import { Card } from '@/components/atoms'

export interface StudyListProps {
  sponsorOrgName?: string
  supportOrgName?: string
  shortTitle: string
  shortTitleHref: string
  assessmentHref: string
  lastAsessmentDate?: string
  assessmentDue?: boolean
  trackStatus?: string
  trackStatusHref?: string
  indications?: string[]
}

export function StudyList({
  sponsorOrgName,
  supportOrgName,
  shortTitle,
  shortTitleHref,
  assessmentHref,
  assessmentDue,
  trackStatus,
  trackStatusHref,
  lastAsessmentDate,
  indications,
}: StudyListProps) {
  return (
    <Card>
      {assessmentDue ? <span className="govuk-tag govuk-tag--red absolute top-0 right-0">Due</span> : null}

      <div className="md:max-w-[calc(100%-50px)]">
        <div className="text-darkGrey govuk-!-margin-bottom-1 max-w-[calc(100%-45px)] lg:max-w-auto govuk-body-s">
          {sponsorOrgName ?? '-'}
          {Boolean(supportOrgName) && ` (${supportOrgName})`}
        </div>

        <Link
          className="govuk-link--no-visited-state govuk-heading-s govuk-!-margin-bottom-4 govuk-!-padding-top-0 inline-block"
          href={shortTitleHref}
        >
          {shortTitle}
        </Link>
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
                on {lastAsessmentDate}
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
          <Link className="govuk-button w-auto govuk-!-margin-bottom-0" href={assessmentHref}>
            Assess
          </Link>
        </div>
      </div>
    </Card>
  )
}
