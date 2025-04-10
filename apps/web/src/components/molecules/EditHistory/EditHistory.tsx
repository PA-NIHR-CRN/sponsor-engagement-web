import { Accordion, Details } from '@nihr-ui/frontend'

import { EditHistoryItem } from './EditHistoryItem/EditHistoryItem'
import type { EditHistory } from './types'

export interface EditHistoryProps {
  editHistoryItems: EditHistory[]
  idToAutoExpand?: string
  error?: boolean
  leadAdministrationId: number | null
}

export function EditHistory({ editHistoryItems, idToAutoExpand, error, leadAdministrationId }: EditHistoryProps) {
  return (
    <Details heading="View edit history" open={Boolean(idToAutoExpand)}>
      <Accordion defaultValue={[idToAutoExpand ?? '']} type="multiple">
        {editHistoryItems.map((editHistory) => (
          <EditHistoryItem
            changes={editHistory.changes}
            id={editHistory.id}
            key={editHistory.id}
            leadAdministrationId={leadAdministrationId}
            modifiedDate={editHistory.modifiedDate}
            studyUpdateType={editHistory.studyUpdateType}
            userEmail={editHistory.userEmail}
          />
        ))}
        {editHistoryItems.length === 0 && !error ? <span className="text-sm">There is no edit history.</span> : null}
        {error ? <p className="govuk-error-message">There&apos;s been an error fetching edit history.</p> : null}
      </Accordion>
    </Details>
  )
}
