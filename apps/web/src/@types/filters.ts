export type OrderType = 'updated' | 'published' | 'a-z' | 'z-a' | 'highest-population' | 'lowest-population'

export interface Filters {
  page: number
  q?: string
  order?: OrderType
}

export type FilterKey = keyof Filters
export type FilterValue = Filters[FilterKey]
