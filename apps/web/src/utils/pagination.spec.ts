import { generateTruncatedPagination } from './pagination'

describe('generateTruncatedPagination', () => {
  test('currentPage at the beginning', () => {
    expect(generateTruncatedPagination(42, 1)).toEqual([1, 2, 3, 4, 5, '...', 42])
  })

  test('currentPage as 4', () => {
    expect(generateTruncatedPagination(42, 4)).toEqual([1, '...', 3, 4, 5, '...', 42])
  })

  test('currentPage in the middle', () => {
    expect(generateTruncatedPagination(42, 5)).toEqual([1, '...', 4, 5, 6, '...', 42])
    expect(generateTruncatedPagination(42, 25)).toEqual([1, '...', 24, 25, 26, '...', 42])
  })

  test('currentPage near the end', () => {
    expect(generateTruncatedPagination(42, 38)).toEqual([1, '...', 37, 38, 39, '...', 42])
  })

  test('currentPage at the end', () => {
    expect(generateTruncatedPagination(42, 42)).toEqual([1, '...', 38, 39, 40, 41, 42])
  })

  test('totalPages less than fixedLength', () => {
    expect(generateTruncatedPagination(5, 3)).toEqual([1, 2, 3, 4, 5])
    expect(generateTruncatedPagination(5, 4)).toEqual([1, 2, 3, 4, 5])
  })
})
