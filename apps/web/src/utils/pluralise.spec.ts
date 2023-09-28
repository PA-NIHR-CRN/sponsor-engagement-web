import { pluralise, pluraliseStudy } from './pluralise'

test('Pluralises text correctly', () => {
  expect(pluralise('Search result', 0)).toBe('Search results')
  expect(pluralise('Search result', 1)).toBe('Search result')
  expect(pluralise('Search result', 2)).toBe('Search results')
})

test('Pluralises "study" correctly', () => {
  expect(pluraliseStudy(0)).toBe('studies')
  expect(pluraliseStudy(1)).toBe('study')
  expect(pluraliseStudy(2)).toBe('studies')
})
