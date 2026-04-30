import React from "react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Status } from '@/@types/studies'


type StudyProgressExtendedProps = {
    hraApprovalDate: Date;
    endDate: Date;
    studyStatus: string;
};

export const StudyProgressExtended: React.FC<StudyProgressExtendedProps> = ({hraApprovalDate, endDate, studyStatus }) => {

    const today = new Date();

    const totalDays = 90;

    const daysPassed = Math.ceil(
        (today.getTime() - hraApprovalDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    const daysRemaining = Math.max(totalDays - daysPassed, 0);

    const pathname = usePathname();

    const progressLabel =
        daysPassed >= totalDays
            ? `OVER TARGET by ${daysPassed - totalDays} days`
            : `${daysRemaining} days remaining`;
    
    // if (studyStatus !== Status.InSetup || !hraApprovalDate) {
    //     return null;
    // }
    
    // CHANGE TO "InSetup" *********************************************************************************************
    if (studyStatus !== Status.OpenToRecruitment) {
        return null;
    }

    return (
        <div className="govuk-!-padding-3 relative bg-white border-grey-120 border border-b-2">
            <h3 className="govuk-heading-m govuk-!-margin-bottom-1 p-0">
                Progress of study setup
            </h3>

            <span className="govuk-body-s text-darkGrey block mb-2">
                Based on the latest data from HRA approval from start date to end date
            </span>
            
            <progress
                id="file"
                value="32"
                max="100"
                className="w-full block"
                style={{ width: "100%" }}
            >
                32%
            </progress>


            <div className="flex justify-between">
                <div className="flex flex-col">
                    <span className="govuk-body-s govuk-!-font-weight-bold text-darkGrey">
                        {progressLabel}
                    </span>
                    <span className="govuk-body-s govuk-!-font-weight-bold text-darkGrey">
                        HRA approval date: {hraApprovalDate.toLocaleDateString('en-GB')}
                    </span>
                </div>
                
                <div className="flex flex-col text-right">
                    <span className="govuk-body-s govuk-!-font-weight-bold text-darkGrey">
                        {totalDays - daysRemaining} / {totalDays} Days
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
