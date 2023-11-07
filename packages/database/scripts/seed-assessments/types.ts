import type { headers } from './constants'

export type AssessmentHeaders = typeof headers
export type AssessmentRow = Record<AssessmentHeaders[number], string>

export interface Assessment {
  cpmsId: number
  status?: 'On track' | 'Off track'
  comment?: string
  createdAt: Date
  createdBy: string
}
