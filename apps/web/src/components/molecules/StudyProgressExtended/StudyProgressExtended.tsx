import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Status } from '@/@types/studies'
import {ProgressBar, progressBarColor} from "@/components/atoms/ProgressBar/ProgressBar";

type StudyProgressExtendedProps = {
    hraApprovalDate: Date;
    studyStatus: string;
};

export const StudyProgressExtended: React.FC<StudyProgressExtendedProps> = ({hraApprovalDate, studyStatus }) => {

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
    
    // TODO: Change to "InSetup" *********************************************************************************************
    // if (studyStatus !== Status.InSetup || !hraApprovalDate) {
    //     return null;
    // }
    //
    if (studyStatus !== Status.OpenToRecruitment) {
        return null;
    }
    // *************************************************************************************************************************

    function GetStudyProgressColor(daysSinceAssessmentDue: number) {
        if (daysSinceAssessmentDue >= totalDays) {
            return progressBarColor.Error;
        } else {
            return progressBarColor.Warning;
        }
    }

    return (
        <div className="govuk-!-padding-3 relative bg-white border-grey-120 border border-b-2">
            <h3 className="govuk-heading-m govuk-!-margin-bottom-1 p-0">
                Progress of study setup
            </h3>

            <span className="govuk-body-s text-darkGrey block mb-2">
                Based on the latest data from HRA approval from start date to end date
            </span>

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

                    <span className="govuk-body-s govuk-!-font-weight-bold text-darkGrey">
                        HRA approval date: {hraApprovalDate.toLocaleDateString('en-GB')}
                    </span>
                </div>
                
                <div className="flex flex-col text-right">
                    <span className="govuk-body-s govuk-!-font-weight-bold text-darkGrey">
                        {elapsedDays} / {totalDays} Days
                    </span>
                    <span className="govuk-body-s govuk-!-font-weight-bold text-darkGrey">
                        End date: {endDate.toLocaleDateString('en-GB')}
                    </span>
                </div>
            </div>

            <Link href={`${pathname}/configure`}>
                More details
            </Link>

        </div>
    );
};
