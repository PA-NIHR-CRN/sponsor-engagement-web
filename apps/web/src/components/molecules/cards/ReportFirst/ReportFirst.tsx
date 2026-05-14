import clsx from 'clsx'
import { StartIcon } from '@nihr-ui/frontend'

import { Card } from '@/components/atoms'
import { REPORT_FIRSTS_PAGE } from '@/constants/routes'

interface ReportFirstProps {
    showAsStartButton?: boolean
    studyId?: number
}

export function ReportFirst({ showAsStartButton = false, studyId }: ReportFirstProps) {
    return (
        <Card className='mb-4' data-testid="report-first" filled padding={4}>
            <h3 className="govuk-heading-m">
                First Global/European Participant
            </h3>

            <p className="govuk-body">
                Report where the UK has achieved the first global or European participant.
            </p>

            <a
                aria-label="Report a first global/european participant"
                className={
                    clsx(
                        'govuk-button mb-0',
                        { 'govuk-button--start': showAsStartButton }
                    )}
                href={
                studyId
                    ? `${REPORT_FIRSTS_PAGE}?studyId=${studyId}`
                    : REPORT_FIRSTS_PAGE
                }
                rel="noopener noreferrer"
            >
                Report a first
                {showAsStartButton && <StartIcon />}
            </a>
        </Card>
    )
}
