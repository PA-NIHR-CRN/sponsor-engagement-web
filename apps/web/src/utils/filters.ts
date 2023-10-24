import type { ParsedUrlQuery } from 'node:querystring'
import type { Filters, OrderType } from '../@types/filters'

export const getFiltersFromQuery = (query: ParsedUrlQuery) => {
  const filters: Filters = {
    page: Number(query.page) || 1,
    ...(query.q && { q: query.q as string }),
    ...(query.order && { order: query.order as OrderType }),
  }

  return filters
}
