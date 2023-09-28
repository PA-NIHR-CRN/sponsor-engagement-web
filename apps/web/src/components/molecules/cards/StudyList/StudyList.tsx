import Link from 'next/link'
import { Card } from '../../../atoms'

export interface StudyListProps {
  sponsorName: string
  shortTitle: string
  shortTitleHref: string
  lastAsessmentDate: string
  assessmentHref: string
  assessmentDue?: boolean
  trackStatus: 'On' | 'Off'
  trackStatusHref: string
  indication: string
}

export function StudyList({
  sponsorName,
  shortTitle,
  shortTitleHref,
  assessmentHref,
  assessmentDue,
  trackStatus,
  trackStatusHref,
  lastAsessmentDate,
  indication,
}: StudyListProps) {
  return (
    <Card>
      {assessmentDue ? <span className="govuk-tag govuk-tag--red absolute top-0 right-0">Due</span> : null}

      <div className="md:max-w-[calc(100%-50px)]">
        <div className="text-dark-grey govuk-!-margin-bottom-1 max-w-[calc(100%-45px)] lg:max-w-auto govuk-body-s">
          {sponsorName}
        </div>

        <Link
          className="govuk-link--no-visited-state govuk-heading-s govuk-!-margin-bottom-4 govuk-!-padding-top-0"
          href={shortTitleHref}
        >
          {shortTitle}
        </Link>
      </div>

      <div className="sm:flex sm:justify-between lg:justify-normal sm:gap-3">
        <div className="lg:min-w-[320px]">
          <strong className="govuk-heading-s govuk-!-margin-bottom-0">Last sponsor assessment</strong>
          <p className="govuk-body-s govuk-!-margin-top-1 govuk-!-margin-bottom-0">
            <Link className="govuk-link--no-visited-state" href={trackStatusHref}>
              {trackStatus} track
            </Link>{' '}
            on {lastAsessmentDate}
          </p>
        </div>

        <div className="lg:min-w-[320px]">
          <strong className="govuk-heading-s govuk-!-margin-bottom-0">Study data indicates</strong>
          <p className="govuk-body-s govuk-!-margin-top-1 govuk-!-margin-bottom-0">{indication}</p>
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
