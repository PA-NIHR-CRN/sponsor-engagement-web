import Link from 'next/link'

import { Card } from '@/components/atoms'
import Tag from '@/components/atoms/Tag/Tag'
import TagCollection from '../../TagCollection/TagCollection'
import {StudyProgressExtended} from "@/components/molecules";
import { capitaliseFirstLetter } from '@/utils/capitalise';
import { FirstMedal } from '@/components/atoms/FirstMedal/FirstMedal';

export interface StudyListProps {
  sponsorOrgName?: string
  supportOrgName?: string
  shortTitle: string
  studyHref: string
  lastAssessmentDate?: string
  daysSinceAssessmentDue: number | null
  trackStatus?: string
  trackStatusHref?: string
  dataUpdatesRequired: boolean
  irasId: string | null
  regulatoryApprovalDate: Date | null
  studyStatus: string,
  willRecruitWithinTimeline : boolean
  firstType?: string | null
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
  dataUpdatesRequired,
  irasId,
  regulatoryApprovalDate,
  studyStatus, 
  willRecruitWithinTimeline,
  firstType
}: StudyListProps) {
  const hasAssessmentDue = daysSinceAssessmentDue !== null

  const daysDueText = hasAssessmentDue
    ? (() => {
      const days = daysSinceAssessmentDue || 1;
      return `Assessment due for ${days} day${days > 1 ? 's' : ''}`;
    })()
    : '';

  return (
    <Card>

      {(hasAssessmentDue || dataUpdatesRequired) ? <Tag className='absolute top-0 right-0' text="Needs action" /> : null}

      <div className="sm:flex sm:items-stretch sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
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

          <div className="sm:flex sm:justify-between lg:justify-normal sm:gap-3">
            <div className="lg:min-w-[320px]">
              <strong className="govuk-heading-s govuk-!-margin-bottom-0">
                Last sponsor assessment
              </strong>
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
              ...(hasAssessmentDue ? [{ text: daysDueText }] : []),
              ...(dataUpdatesRequired ? [{ text: 'Data updates required' }] : []),
            ]}
          />

          <div className="lg:min-w-[320px] govuk-!-margin-top-3 min-h-[72px]">
            <div className="max-w-[600px]">
              <StudyProgressExtended 
                regulatoryApprovalDate={regulatoryApprovalDate}
                willRecruitWithinTimeline={willRecruitWithinTimeline}
                studyStatus={studyStatus}
                showBorder={false}
                showTitle={true}
                titleSize='s'
                titleClassName='text-darkGrey'
                showTimeframeHint={false}
                showDates={false}
                showMoreDetails={false}
              />
            </div>
          </div>
        </div>

        <div className="shrink-0 sm:w-[125px] lg:w-[125px] flex flex-col items-center">
          <div className="flex-1 w-full flex items-center justify-center">
            {firstType ? (
              <div className="text-center govuk-!-margin-top-4">
                <div className="flex justify-center">
                  <FirstMedal className="h-14 w-14 text-yellow-500 block" />
                </div>
                <div className="govuk-body-s govuk-!-margin-top-1 font-bold text-darkGrey">
                  {capitaliseFirstLetter(firstType)} first
                </div>
              </div>
            ) : null}
          </div>

          <div className="w-full flex justify-center">
            <Link
              aria-label={`View study ${shortTitle}`}
              className="govuk-button w-auto govuk-!-margin-bottom-0"
              href={studyHref}
            >
              View study
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}