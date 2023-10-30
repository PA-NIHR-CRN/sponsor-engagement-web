import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@nihr-ui/frontend'
import clsx from 'clsx'
import type { getStudyById } from '../../../lib/studies'
import { formatDate } from '../../../utils/date'

export interface AssessmentHistoryProps {
  heading: string
  assessments: ReturnType<typeof getAssessmentHistoryFromStudy>
  firstItemExpanded?: boolean
}

export type Study = NonNullable<Awaited<ReturnType<typeof getStudyById>>['data']>

export function getAssessmentHistoryFromStudy(study: Study) {
  if (study.assessments.length === 0) return []

  return study.assessments.map(({ status, createdAt, createdBy, furtherInformation, id }) => ({
    id,
    status: status.name,
    createdAt: formatDate(createdAt),
    createdBy: createdBy.email,
    furtherInformation: furtherInformation
      .filter(({ furtherInformationText }) => !furtherInformationText)
      .map((match) => match.furtherInformation?.name),
    furtherInformationText: furtherInformation.find(({ furtherInformationText }) => Boolean(furtherInformationText))
      ?.furtherInformationText,
  }))
}

export function AssessmentHistory({ heading, assessments, firstItemExpanded }: AssessmentHistoryProps) {
  return (
    <>
      <h3 className="govuk-heading-m govuk-!-margin-bottom-1 p-0">{heading}</h3>
      {assessments.length > 0 ? (
        <div className="govuk-!-margin-bottom-6">
          {assessments.map((assessment) => (
            <Accordion
              className="w-full"
              defaultValue={
                firstItemExpanded &&
                Boolean(assessments[0].furtherInformation.length) &&
                Boolean(assessments[0].furtherInformationText)
                  ? [String(assessments[0].id)]
                  : []
              }
              key={assessment.id}
              type="multiple"
            >
              <AccordionItem value={String(assessment.id)}>
                <AccordionTrigger
                  sideContent={
                    <span>
                      <strong>{assessment.status}</strong> assessed by {assessment.createdBy}
                    </span>
                  }
                >
                  {assessment.createdAt}
                </AccordionTrigger>
                <AccordionContent indent>
                  {assessment.furtherInformation.length ? (
                    <ul
                      aria-label="Further information"
                      className={clsx('govuk-list govuk-list--bullet govuk-body-s', {
                        'mb-0': !assessment.furtherInformationText,
                      })}
                    >
                      {assessment.furtherInformation.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : null}
                  {assessment.furtherInformationText ? (
                    <p className="govuk-body-s govuk-!-margin-bottom-0">{assessment.furtherInformationText}</p>
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      ) : (
        <p className="govuk-body-s">This study has not had any assessments provided</p>
      )}
    </>
  )
}
