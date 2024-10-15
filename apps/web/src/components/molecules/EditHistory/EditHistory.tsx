import { Accordion, Details } from '@nihr-ui/frontend'

import { EditHistoryItem } from './EditHistoryItem/EditHistoryItem'
import type { getEditHistory } from './utils'

export interface EditHistoryProps {
  editHistoryItems: Awaited<ReturnType<typeof getEditHistory>>
  idToAutoExpand?: string
  errorMessage?: string
}

export function EditHistory({ editHistoryItems, idToAutoExpand, errorMessage }: EditHistoryProps) {
  return (
    <Details heading="View edit history" open={Boolean(idToAutoExpand)}>
      <Accordion defaultValue={[idToAutoExpand ?? '']} type="multiple">
        {editHistoryItems.map((editHistory) => (
          <EditHistoryItem
            changes={editHistory.changes}
            id={editHistory.id}
            key={editHistory.id}
            modifiedDate={editHistory.modifiedDate}
            studyUpdateType={editHistory.studyUpdateType}
            userEmail={editHistory.userEmail}
          />
        ))}
        {editHistoryItems.length === 0 ? <span className="text-sm">There is no edit history.</span> : null}
        {errorMessage ? <span className="text-sm">{errorMessage}</span> : null}
      </Accordion>
    </Details>
  )
}
