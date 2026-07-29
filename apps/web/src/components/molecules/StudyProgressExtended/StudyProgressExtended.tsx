import clsx from "clsx";
import type { Entry } from 'contentful';
import Link from 'next/link';
import React from "react";

import type { TypeSetPageSkeleton } from '@/@types/generated';
import { Status } from '@/@types/studies';
import { ProgressBar, progressBarColor } from "@/components/atoms/ProgressBar/ProgressBar";
import { ContentfulEntries } from '@/constants/contentful/entries';
import { mapDynamicPageContent } from '@/lib/contentful/contentfulUtils';
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
    moreDetailsHref?: string;
    progressBarPageContent: Entry<TypeSetPageSkeleton> | null;
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
        progressBarPageContent,
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
    const progressBarPageContentFields = progressBarPageContent ? progressBarPageContent.fields : null
    const pageContentFields = progressBarPageContentFields?.pageContent ? mapDynamicPageContent(progressBarPageContentFields.pageContent as Entry[]) : null;

    const progressLabel =
        elapsedDays >= totalDays
            ? `${pageContentFields?.get(ContentfulEntries.PROGRESS_BAR_OVER_TARGET)?.toString()} ${elapsedDays - totalDays} ${pluraliseDays(elapsedDays - totalDays)}`
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
                    {progressBarPageContentFields?.title.toString()}
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
                                    {pageContentFields?.get(ContentfulEntries.PROGRESS_BAR_HRA_APPROVAL_DATE)?.toString()} {regulatoryApprovalDate.toLocaleDateString('en-GB')}
                                </span> : null}
                        </div>

                        <div className="flex flex-col text-right">
                    <span className="govuk-body-s govuk-!-margin-bottom-0 text-darkGrey">
                                {elapsedDays} / {totalDays} Days
                            </span>
                            {showDates ? <span className="govuk-body-s text-darkGrey">
                                    {pageContentFields?.get(ContentfulEntries.PROGRESS_BAR_END_DATE)?.toString()} {endDate.toLocaleDateString('en-GB')}
                                </span> : null}
                        </div>
                    </div>
                </div>
            ) :
                <div>
                    <span className="govuk-body-s text-darkGrey block govuk-!-margin-bottom-2">
                        {pageContentFields?.get(ContentfulEntries.PROGRESS_BAR_OPT_OUT)?.toString()}
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