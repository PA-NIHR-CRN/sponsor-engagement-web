export type OrderType = 'due-assessment' | 'last-assessment-asc' | 'last-assessment-desc'

export interface Filters {
  page: number
  q?: string
  order?: OrderType
}

export type FilterKey = keyof Filters
export type FilterValue = Filters[FilterKey]
