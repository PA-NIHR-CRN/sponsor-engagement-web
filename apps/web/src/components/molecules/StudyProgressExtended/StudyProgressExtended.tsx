import clsx from "clsx";
import Link from 'next/link';
import React from "react";

import { Status } from '@/@types/studies';
import { ProgressBar, progressBarColor } from "@/components/atoms/ProgressBar/ProgressBar";
import { pluraliseDays } from '@/utils/pluralise';

interface StudyProgressExtendedProps {
    regulatoryApprovalDate: Date | null;
    studyStatus: string;
    willRecruitWithinTimeline: boolean;
    showBorder?: boolean;
    showTitle?: boolean;
    titleSize?: 's' | 'm' | 'l';
    titleClassName?: string;
    showTimeframeHint?: boolean;
    showDates?: boolean;
    showMoreDetails?: boolean;
    optedOutText?: string;
    moreDetailsHref?: string;
}

export const StudyProgressExtended: React.FC<StudyProgressExtendedProps> = (
    {
        regulatoryApprovalDate,
        studyStatus,
        willRecruitWithinTimeline,
        moreDetailsHref,
        showBorder = true,
        showTitle = true,
        titleSize = 'm',
        titleClassName,
        showTimeframeHint = true,
        showDates = true,
        showMoreDetails = true,
        optedOutText = "No expectation to achieve the first participant in 90 days"
    }) => {

    const inSetupStatuses = [
        Status.InSetup,
        Status.InSetupPendingNHSPermission,
        Status.InSetupApprovalReceived,
        Status.InSetupPendingApproval,
        Status.InSetupNHSPermissionReceived
    ];

    if (
        !inSetupStatuses.includes(studyStatus as Status) ||
        regulatoryApprovalDate === null
    ) {
        return null;
    }

    const today = new Date();
    const totalDays = 90;
    const endDate = new Date(regulatoryApprovalDate);
    endDate.setDate(endDate.getDate() + totalDays);

    const elapsedDays = Math.ceil(
        (today.getTime() - regulatoryApprovalDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const daysRemaining = Math.max(totalDays - elapsedDays, 0);

    const progressLabel =
        elapsedDays >= totalDays
            ? `Over target by ${elapsedDays - totalDays} ${pluraliseDays(elapsedDays - totalDays)}`
            : `${daysRemaining} ${pluraliseDays(daysRemaining)} remaining`;

    function GetStudyProgressColor(daysSinceAssessmentDue: number) {
        if (daysSinceAssessmentDue >= totalDays) {
            return progressBarColor.Error;
        }
        return progressBarColor.Warning;
    }

    const divClass = showBorder ? "progress-summary border-grey-50 border-b-2 border-t-2 govuk-!-margin-bottom-4" : "progress-summary";

    return (
        <div className={divClass}>

            {showTitle ? <h3 className={clsx(`govuk-heading-${titleSize}`, 'govuk-!-margin-bottom-1 govuk-!-margin-top-4 p-0', titleClassName)}>
                    Progress of study setup
                </h3> : null}

            {willRecruitWithinTimeline ? (
                <div>
                    {showTimeframeHint ? <span className="govuk-body-s text-darkGrey block govuk-!-margin-bottom-2">
                            Based on the latest UK approvals data between the start and end dates
                        </span> : null}
                    <ProgressBar className="govuk-!-width-full" color={GetStudyProgressColor(elapsedDays)} max={totalDays}
                        value={elapsedDays} />

                    <div className="flex justify-between">
                        <div className="flex flex-col">
                            <span
                        className={`govuk-body-s govuk-!-margin-bottom-0 ${daysRemaining === 0 ? "govuk-error-message text-red-600" : ""
                                    }`}>
                                {progressLabel}
                            </span>
                            {showDates ? <span className="govuk-body-s text-darkGrey">
                                    UK approval date: {regulatoryApprovalDate.toLocaleDateString('en-GB')}
                                </span> : null}
                        </div>

                        <div className="flex flex-col text-right">
                    <span className="govuk-body-s govuk-!-margin-bottom-0 text-darkGrey">
                                {elapsedDays} / {totalDays} Days
                            </span>
                            {showDates ? <span className="govuk-body-s text-darkGrey">
                                    End date: {endDate.toLocaleDateString('en-GB')}
                                </span> : null}
                        </div>
                    </div>
                </div>
            ) :
                <div>
                    <span className="govuk-body-s text-darkGrey block govuk-!-margin-bottom-2">
                        {optedOutText}
                    </span>
                </div>
            }

            {showMoreDetails && moreDetailsHref ? <span className="govuk-body-m block govuk-!-margin-bottom-4">
                    <Link href={moreDetailsHref}>
                        More details
                    </Link>
                </span> : null}
        </div>
    );
};