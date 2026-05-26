import type { ParsedUrlQuery } from 'node:querystring'

import type { Filters, OrderType, StatusFilter } from '../@types/filters'

const ALLOWED_STATUSES: StatusFilter[] = ['in-setup', 'open', 'suspended']

const toStringArray = (value: string | string[] | undefined): string[] => {
  if (!value) return []
  return Array.isArray(value) ? value : [value]
}

const isAllowedStatus = (value: string): value is StatusFilter =>
  ALLOWED_STATUSES.includes(value as StatusFilter)

export const getFiltersFromQuery = (query: ParsedUrlQuery): Filters => {
  const filters: Filters = {
    page: Number(query.page) || 1,
    ...(query.q && { q: query.q as string }),
    ...(query.order && { order: query.order as OrderType }),
  }

  const status = toStringArray(query.status as any).filter(isAllowedStatus)

  if (status.length) {
    filters.status = status
  }

  return filters
}