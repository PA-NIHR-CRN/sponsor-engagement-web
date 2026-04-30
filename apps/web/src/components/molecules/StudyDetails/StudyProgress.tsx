import type {getStudyById} from '@/lib/studies'
import {ProgressBar, progressBarColor} from "@/components/atoms/ProgressBar/ProgressBar";
import {StudyDetailsProps} from "@/components/molecules";
import clsx from "clsx";

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

function AsDaysString(days: number)
{
    if (days == 1) {
        return "1 day";
    }
    else {
        return days + " days";
    }
        
}

function GetOverdueText(remainingDays: number) {
    
    if (remainingDays < 0) {
        return "OVERDUE by " + AsDaysString(Math.abs(remainingDays)); 
    }    
    else {
        return AsDaysString(remainingDays) + " remaining";
    }
}

export function StudyProgress({elapsedDays}: StudyProgressProps) {
    const remainingDays = maxDaysSinceAssessmentDue - elapsedDays;
    const overdueTextClass = remainingDays < 0 ? "text-red" : "";
    return (
        <div>
            <div>
                <ProgressBar className="govuk-!-width-full" max={90} value={elapsedDays}
                             color={GetStudyProgressColor(elapsedDays)}/>
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
