import type {getStudyById} from '@/lib/studies'
import {ProgressBar, progressBarColor} from "@/components/atoms/ProgressBar/ProgressBar";
import {StudyDetailsProps} from "@/components/molecules";

const maxDaysSinceAssessmentDue = 90

export interface StudyProgressProps {
    elapsedDays: number
}

function GetStudyProgressColor(daysSinceAssessmentDue: number) {
    if (daysSinceAssessmentDue >= maxDaysSinceAssessmentDue) {
        return progressBarColor.Error;
    } else {
        return progressBarColor.Warning;
    }
}

function GetOverdueText(remainingDays: number) {
    if (remainingDays == 1) {
        return "1 day remaining";
    } else if (remainingDays <= 0) {
        return "Overdue by " + remainingDays + " days";
    } else {
        return remainingDays + " days remaining";
    }

}

export function StudyProgress({elapsedDays}: StudyProgressProps) {
    const remainingDays = maxDaysSinceAssessmentDue - elapsedDays;
    return (
        <div>
            <div>
                <ProgressBar className="govuk-!-width-full" max={90} value={elapsedDays}
                             color={GetStudyProgressColor(elapsedDays)}/>
            </div>

            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds">
                    <p>{GetOverdueText(remainingDays)}</p>
                </div>
                <div className="govuk-grid-column-one-third text-right">
                    <p>{elapsedDays} of {maxDaysSinceAssessmentDue}</p>
                </div>
            </div>
        </div>
    )
}
