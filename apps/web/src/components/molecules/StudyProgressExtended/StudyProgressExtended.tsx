import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Status } from '@/@types/studies'
import {ProgressBar, progressBarColor} from "@/components/atoms/ProgressBar/ProgressBar";
import clsx from "clsx";

type StudyProgressExtendedProps = {
    hraApprovalDate: Date | null;
    studyStatus: string;
    willRecruitWithinTimeline: boolean;
    showBorder?: boolean;
    showTitle?: boolean;
    showDates?: boolean;
    showMoreDetails?: boolean;
};

export const StudyProgressExtended: React.FC<StudyProgressExtendedProps> = (
    {hraApprovalDate, studyStatus, willRecruitWithinTimeline, showBorder = true, showTitle = true, 
        showDates = true, showMoreDetails = true }) => {

    const inSetupStatuses = [
        Status.InSetup,
        Status.InSetupPendingNHSPermission,
        Status.InSetupApprovalReceived,
        Status.InSetupPendingApproval,
        Status.InSetupNHSPermissionReceived
    ];

    if (
        !inSetupStatuses.includes(studyStatus as Status) ||
        hraApprovalDate == null ||
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

    const pathname = usePathname();

    const progressLabel =
        elapsedDays >= totalDays
            ? `OVER TARGET by ${elapsedDays - totalDays} days`
            : `${daysRemaining} days remaining`;

    function GetStudyProgressColor(daysSinceAssessmentDue: number) {
        if (daysSinceAssessmentDue >= totalDays) {
            return progressBarColor.Error;
        } else {
            return progressBarColor.Warning;
        }
    }
    
    const divClass = showBorder ? "govuk-!-padding-3 relative bg-white border-grey-120 border border-b-2" : "govuk-!-padding-3";

    return (
        <div className={divClass}>

            {showTitle && (
                <>
                    <h3 className="govuk-heading-m govuk-!-margin-bottom-1 p-0">
                        Progress of study setup
                    </h3>
        
                    <span className="govuk-body-s text-darkGrey block mb-2">
                        Based on the latest data from HRA approval from start date to end date
                    </span>
                </>
                )}

            <ProgressBar className="govuk-!-width-full" max={90} value={elapsedDays}
                         color={GetStudyProgressColor(elapsedDays)}/>

                
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <span
                        className={`govuk-body-s govuk-!-font-weight-bold ${
                            daysRemaining === 0 ? "govuk-error-message text-red-600" : "text-darkGrey"
                        }`}>
                        {progressLabel}
                    </span>
                    {showDates &&(
                        <span className="govuk-body-s govuk-!-font-weight-bold text-darkGrey">
                            HRA approval date: {hraApprovalDate.toLocaleDateString('en-GB')}
                        </span>
                    )}
                </div>
                
                <div className="flex flex-col text-right">
                    <span className="govuk-body-s govuk-!-font-weight-bold text-darkGrey">
                        {elapsedDays} / {totalDays} Days
                    </span>
                    {showDates &&(
                        <span className="govuk-body-s govuk-!-font-weight-bold text-darkGrey">
                            End date: {endDate.toLocaleDateString('en-GB')}
                        </span>
                    )}
                </div>
            </div>

            {showMoreDetails &&(
                <Link href={`${pathname}/configure`}>
                    More details
                </Link>                
            )}
        </div>

    );
};
