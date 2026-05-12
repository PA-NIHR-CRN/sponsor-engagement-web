import Link from 'next/link'

import { Card } from '@/components/atoms'
import Tag from '@/components/atoms/Tag/Tag'
import TagCollection from '../../TagCollection/TagCollection'
import {ProgressBar, progressBarColor} from "@/components/atoms/ProgressBar/ProgressBar";
import {StudyProgress} from "@/components/molecules/StudyProgress/StudyProgress";
import dayjs from "dayjs";

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
  hraApprovalDate?: Date | null
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
  hraApprovalDate
}: StudyListProps) {
  const hasAssessmentDue = daysSinceAssessmentDue !== null

  const daysDueText = hasAssessmentDue
    ? (() => {
      const days = daysSinceAssessmentDue || 1;
      return `Assessment due for ${days} day${days > 1 ? 's' : ''}`;
    })()
    : '';

  const excludedIndications = new Set([
    'Recruiting at a lower rate than expected (RTT)',
    'No recruitment in past 6 months',
  ])

  const areUpdatesRequired =
    indications?.some(indication => !excludedIndications.has(indication)) ?? false

  const today = dayjs()
  const daysSinceHraApproval = hraApprovalDate
      ? Math.round(today.diff(hraApprovalDate, 'day', true))
      : null

  return (
    <Card>

      {(hasAssessmentDue || areUpdatesRequired) ? <Tag className='absolute top-0 right-0' text="Needs action" /> : null}

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
          <p className="govuk-body-s govuk-!-margin-top-1 govuk-!-margin-bottom-2">
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
      </div>

      <TagCollection
        tags={[
          ...(hasAssessmentDue
            ? [{ text: daysDueText }]
            : []),
          ...(areUpdatesRequired
            ? [{ text: 'Data updates required' }]
            : []),
        ]}
      />

      <div className="sm:justify-between lg:justify-normal sm:gap-3">
        
        
        <div className="lg:min-w-[320px]">
          <div>
            <StudyProgress elapsedDays={daysSinceHraApproval}/>
          </div>
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
