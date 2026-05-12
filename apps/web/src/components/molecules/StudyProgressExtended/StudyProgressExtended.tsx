import Link from 'next/link';
import React from "react";

import { Status } from '@/@types/studies';
import { ProgressBar, progressBarColor } from "@/components/atoms/ProgressBar/ProgressBar";
import { pluraliseDays } from '@/utils/pluralise';

interface StudyProgressExtendedProps {
    hraApprovalDate: Date | null;
    studyStatus: string;
    willRecruitWithinTimeline: boolean;
    moreDetailsHref?: string;
}

export const StudyProgressExtended: React.FC<StudyProgressExtendedProps> = ({ hraApprovalDate, studyStatus, willRecruitWithinTimeline, moreDetailsHref }) => {
    
    const inSetupStatuses = [
        Status.InSetup,
        Status.InSetupPendingNHSPermission,
        Status.InSetupApprovalReceived,
        Status.InSetupPendingApproval,
        Status.InSetupNHSPermissionReceived
    ];

    if (
        !inSetupStatuses.includes(studyStatus as Status) ||
        hraApprovalDate === null ||
        !willRecruitWithinTimeline
    ) {
        return null;
    }
    
    const today = new Date();
    const totalDays = 90;
    const endDate = new Date(hraApprovalDate);
    endDate.setDate(endDate.getDate() + totalDays);

    const elapsedDays = Math.ceil(
        (today.getTime() - hraApprovalDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const daysRemaining = Math.max(totalDays - elapsedDays, 0);

    const progressLabel =
        elapsedDays >= totalDays
            ? `OVER TARGET by ${elapsedDays - totalDays} ${pluraliseDays(elapsedDays - totalDays)}`
            : `${daysRemaining} ${pluraliseDays(daysRemaining)} remaining`;

    function GetStudyProgressColor(daysSinceAssessmentDue: number) {
        if (daysSinceAssessmentDue >= totalDays) {
            return progressBarColor.Error;
        }
        return progressBarColor.Warning;
    }

    return (
        <div className="border-grey-50 border-b-2 border-t-2 govuk-!-margin-bottom-4">
            <h3 className="govuk-heading-m govuk-!-margin-bottom-1 govuk-!-margin-top-4 p-0">
                Progress of study setup
            </h3>

            <span className="govuk-body-s text-darkGrey block govuk-!-margin-bottom-2">
                Based on the latest data from HRA approval from start date to end date
            </span>

            <ProgressBar className="govuk-!-width-full" color={GetStudyProgressColor(elapsedDays)} max={totalDays}
                value={elapsedDays} />

            <div className="flex justify-between">
                <div className="flex flex-col">
                    <span
                        className={`govuk-body-s govuk-!-font-weight-bold govuk-!-margin-bottom-2 ${daysRemaining === 0 ? "govuk-error-message text-red-600" : ""
                            }`}>
                        {progressLabel}
                    </span>

                    <span className="govuk-body-s govuk-!-font-weight-bold text-darkGrey">
                        HRA approval date: {hraApprovalDate.toLocaleDateString('en-GB')}
                    </span>
                </div>

                <div className="flex flex-col text-right">
                    <span className="govuk-body-s govuk-!-font-weight-bold govuk-!-margin-bottom-2 text-darkGrey">
                        {elapsedDays} / {totalDays} Days
                    </span>
                    <span className="govuk-body-s govuk-!-font-weight-bold text-darkGrey">
                        End date: {endDate.toLocaleDateString('en-GB')}
                    </span>
                </div>
            </div>

            {moreDetailsHref ? <span className="govuk-body-m block govuk-!-margin-bottom-4">
                <Link href={moreDetailsHref}>
                    More details
                </Link>
            </span> : null}

        </div>
    );
};
