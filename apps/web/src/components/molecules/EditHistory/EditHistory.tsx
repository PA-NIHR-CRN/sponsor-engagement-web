import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Details } from '@nihr-ui/frontend'

import { StudyUpdateType } from '@/constants'

import { getCPMSStudyFieldsLabelText } from './utils'

export interface EditHistoryChange {
  columnChanged: string
  beforeValue: string
  afterValue: string
  id: string
}

export interface EditHistoryItem {
  LSN: string
  modifiedDate: string
  userEmail?: string
  studyUpdateType: StudyUpdateType
  changes: EditHistoryChange[]
}

interface EditHistoryProps {
  editHistories: EditHistoryItem[]
}

export function EditHistoryChangeText({ change }: { change: EditHistoryChange }) {
  const { afterValue, beforeValue, columnChanged } = change

  const columnLabel = getCPMSStudyFieldsLabelText(columnChanged)

  if (beforeValue && afterValue) {
    return (
      <li>
        {columnLabel} from {beforeValue} to {afterValue}
      </li>
    )
  } else if (beforeValue && !afterValue) {
    return (
      <li>
        {columnLabel} {beforeValue} removed
      </li>
    )
  }

  return (
    <li>
      {columnLabel} {afterValue} added
    </li>
  )
}

function EditHistoryItem({
  studyUpdateType,
  modifiedDate,
  userEmail,
  changes,
  value,
}: EditHistoryItem & { value: number }) {
  const [studyUpdateTypeText, studyUpdateTypeVerb] = [
    studyUpdateType === StudyUpdateType.Direct ? 'Change' : 'Proposed change',
    studyUpdateType === StudyUpdateType.Direct ? 'made by' : 'submitted by',
  ]

  const updatedByWhoText = userEmail || 'Updated by RDN'

  const formattedModifiedDate = new Date(modifiedDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <AccordionItem className={`${value === 1 ? 'border-t' : ''}`} value={value.toString()}>
      <AccordionTrigger
        sideContent={
          <span>
            <strong>{studyUpdateTypeText}</strong> {studyUpdateTypeVerb} {updatedByWhoText}
          </span>
        }
      >
        Updated on {formattedModifiedDate}
      </AccordionTrigger>
      <AccordionContent indent>
        <ul aria-label="Change details" className="govuk-list govuk-list--bullet govuk-body-s">
          {changes.map((change) => (
            <EditHistoryChangeText change={change} key={change.id} />
          ))}
        </ul>
      </AccordionContent>
    </AccordionItem>
  )
}

export function EditHistory({ editHistories }: EditHistoryProps) {
  if (editHistories.length === 0) return

  return (
    <Details heading="View edit history">
      <Accordion type="multiple">
        {editHistories.map((editHistory, index) => (
          <EditHistoryItem
            LSN={editHistory.LSN}
            changes={editHistory.changes}
            key={editHistory.LSN}
            modifiedDate={editHistory.modifiedDate}
            studyUpdateType={editHistory.studyUpdateType}
            userEmail={editHistory.userEmail}
            value={index + 1}
          />
        ))}
      </Accordion>
    </Details>
  )
}
