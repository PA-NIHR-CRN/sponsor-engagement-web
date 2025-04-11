import { AccordionContent, AccordionItem, AccordionTrigger } from '@nihr-ui/frontend'
import type { LeadAdministrationId } from 'shared-utilities/src/utils/lead-administration-id'

import { StudyUpdateType } from '@/constants'
import { getEditAdmin } from '@/utils/editAdmin'

import { EditHistoryChangeText } from '../EditHistoryChangeText/EditHistoryChangeText'
import type { EditHistory } from '../types'

export function EditHistoryItem({
  id,
  leadAdministrationId,
  studyUpdateType,
  modifiedDate,
  userEmail,
  changes,
}: EditHistory) {
  const [studyUpdateTypeText, studyUpdateTypeVerb] = [
    studyUpdateType === StudyUpdateType.Proposed ? 'Proposed change' : 'Change',
    studyUpdateType === StudyUpdateType.Proposed ? 'submitted by' : 'made by',
  ]
  const updatedByWhoText = userEmail || getEditAdmin(leadAdministrationId as LeadAdministrationId)

  const formattedModifiedDate = new Date(modifiedDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <AccordionItem className="first:border-t" data-testid={`edit-history-accordion-item-${id}`} value={id}>
      <AccordionTrigger
        className="text-sm [&>div]:max-w-[244px]"
        sideContent={
          <span>
            <strong>{studyUpdateTypeText}</strong> {studyUpdateTypeVerb} <strong>{updatedByWhoText}</strong>
          </span>
        }
      >
        Updated on {formattedModifiedDate}
      </AccordionTrigger>
      <AccordionContent className="md:ml-[calc(244px+15px)]">
        <ul aria-label="Change details" className="govuk-list govuk-list--bullet govuk-body-s">
          {changes.map((change) => (
            <EditHistoryChangeText change={change} key={change.columnChanged} />
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  )
}
