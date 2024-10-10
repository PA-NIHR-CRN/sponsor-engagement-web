import { Accordion, Details } from '@nihr-ui/frontend'

import type { EditHistoryItemProps } from './EditHistoryItem/EditHistoryItem'
import { EditHistoryItem } from './EditHistoryItem/EditHistoryItem'

export interface EditHistoryChange {
  columnChanged: string
  beforeValue?: string | null
  afterValue?: string | null
  id: string
}

interface EditHistoryProps {
  editHistoryItems: EditHistoryItemProps[]
  lsnToAutoExpand?: string
  errorMessage?: string
}

export function EditHistory({ editHistoryItems, lsnToAutoExpand, errorMessage }: EditHistoryProps) {
  return (
    <Details heading="View edit history" open={Boolean(lsnToAutoExpand)}>
      <Accordion defaultValue={[lsnToAutoExpand ?? '']} type="multiple">
        {editHistoryItems.map((editHistory, index) => (
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
        {editHistoryItems.length === 0 ? <span className="text-sm">There is no edit history.</span> : null}
        {errorMessage ? <span className="text-sm">{errorMessage}</span> : null}
      </Accordion>
    </Details>
  )
}
