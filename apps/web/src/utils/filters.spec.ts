import type { ParsedUrlQuery } from 'node:querystring'
import { getFiltersFromQuery } from './filters'

describe('getFiltersFromQuery', () => {
  it('returns the correct filters', () => {
    const query: ParsedUrlQuery = {
      page: '2',
      q: 'test search',
      order: 'a-z',
    }

    expect(getFiltersFromQuery(query)).toStrictEqual({
      page: 2,
      q: 'test search',
      order: 'a-z',
    })
  })
})
