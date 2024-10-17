import type { StudyUpdateType } from '@/constants'

export interface EditHistoryChange {
  columnChanged: string
  beforeValue?: string | null
  afterValue?: string | null
}

export interface EditHistory {
  id: string
  modifiedDate: string
  userEmail?: string
  studyUpdateType?: StudyUpdateType
  changes: EditHistoryChange[]
}
