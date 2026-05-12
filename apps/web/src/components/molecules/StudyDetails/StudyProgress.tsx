import clsx from "clsx";

import { ProgressBar, progressBarColor } from "@/components/atoms/ProgressBar/ProgressBar";
import { pluraliseDays } from "@/utils/pluralise";

const maxDaysSinceAssessmentDue = 90

export interface StudyProgressProps {
    elapsedDays: number
}

function GetStudyProgressColor(daysSinceAssessmentDue: number) {
    if (daysSinceAssessmentDue >= maxDaysSinceAssessmentDue) {
        return progressBarColor.Error;
    }
    return progressBarColor.Warning;

}

function GetOverdueText(remainingDays: number) {

    if (remainingDays < 0) {
        return `OVERDUE by ${Math.abs(remainingDays)} ${pluraliseDays(Math.abs(remainingDays))}`;
    }

    return `${remainingDays} ${pluraliseDays(remainingDays)} remaining`;
}

export function StudyProgress({ elapsedDays }: StudyProgressProps) {
    const remainingDays = maxDaysSinceAssessmentDue - elapsedDays;
    const overdueTextClass = remainingDays < 0 ? "text-red" : "";
    return (
        <div>
            <div>
                <ProgressBar className="govuk-!-width-full" color={GetStudyProgressColor(elapsedDays)} max={maxDaysSinceAssessmentDue}
                    value={elapsedDays} />
            </div>

            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds govuk-body-s">
                    <p className={clsx("govuk-body-s", overdueTextClass)}>{GetOverdueText(remainingDays)}</p>
                </div>
                <div className="govuk-grid-column-one-third text-right">
                    <p className="govuk-body-s">{elapsedDays} of {maxDaysSinceAssessmentDue}</p>
                </div>
            </div>
        </div>
    )
}
