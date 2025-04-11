import type { LeadAdministrationId } from 'shared-utilities/src/utils/lead-administration-id'

import type { StudyUpdateType } from '@/constants'

export interface EditHistoryChange {
  columnChanged: string
  beforeValue?: string | null
  afterValue?: string | null
}

export interface EditHistory {
  id: string
  leadAdministrationId?: LeadAdministrationId | null
  modifiedDate: string
  userEmail?: string
  studyUpdateType?: StudyUpdateType
  changes: EditHistoryChange[]
}
