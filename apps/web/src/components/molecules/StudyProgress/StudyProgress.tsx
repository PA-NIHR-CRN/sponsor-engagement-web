import {ProgressBar, progressBarColor} from "@/components/atoms/ProgressBar/ProgressBar";
import clsx from "clsx";

export interface StudyProgressProps {
    elapsedDays: number
    textClassName?: string
    overduePhrase?: string
}

function GetStudyProgressColor(daysSinceAssessmentDue: number, firstParticipantTargetDays: number) {
    if (daysSinceAssessmentDue >= firstParticipantTargetDays) {
        return progressBarColor.Error;
    } else {
        return progressBarColor.Warning;
    }
}

function GetFirstParticipantTargetDays()
{
    const target = process.env.NEXT_PUBLIC_FIRST_PARTICIPANT_TARGET_DAYS as string;
    return target && target.length > 0 ? Number(target) : 90;
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

function GetOverdueText(overduePhrase: string, remainingDays: number) {
    
    if (remainingDays < 0) {
        return overduePhrase + " by " + AsDaysString(Math.abs(remainingDays)); 
    }    
    else {
        return AsDaysString(remainingDays) + " remaining";
    }
}

export function StudyProgress({elapsedDays, textClassName = "govuk-body-s", overduePhrase = "Overdue"}: StudyProgressProps) {
    const firstParticipantTargetDays = GetFirstParticipantTargetDays();
    const remainingDays = firstParticipantTargetDays - elapsedDays;
    const overdueTextClass = remainingDays < 0 ? "text-red" : "";
    return (
        <div>
            <div>
                <ProgressBar className="govuk-!-width-full" max={90} value={elapsedDays}
                             color={GetStudyProgressColor(elapsedDays, firstParticipantTargetDays)}/>
            </div>

            <div className="govuk-grid-row">
                <div className="govuk-grid-column-two-thirds govuk-body-s">
                    <p className={clsx(textClassName, overdueTextClass)}>{GetOverdueText(overduePhrase, remainingDays)}</p>
                </div>
                <div className="govuk-grid-column-one-third text-right">
                    <p className={textClassName}>{elapsedDays} of {firstParticipantTargetDays}</p>
                </div>
            </div>
        </div>
    )
}
