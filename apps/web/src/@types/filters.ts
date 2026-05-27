export type OrderType = 'due-assessment' | 'last-assessment-asc' | 'last-assessment-desc'

export type StatusFilter = 'in-setup' | 'open' | 'suspended'

export interface Filters {
  page: number
  q?: string
  status?: StatusFilter[]
  order?: OrderType
}

export type FilterKey = keyof Filters
export type FilterValue = Filters[FilterKey]
