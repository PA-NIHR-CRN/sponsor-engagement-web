import mockRouter from 'next-router-mock'
import type { Filters } from '../../../@types/filters'
import { STUDIES_PAGE } from '../../../constants/routes'
import { SelectedFilters } from './SelectedFilters'
import { render, screen } from '@/config/TestUtils'

test('Displays selected filters with correct links', () => {
  const mockFilters: Filters = {
    page: 2,
    order: 'a-z',
    q: 'test',
  }

  void mockRouter.push(STUDIES_PAGE)

  mockRouter.query = {
    page: '2',
    q: 'test',
  }

  render(<SelectedFilters filters={mockFilters} />)

  expect(screen.getByRole('list', { name: 'Selected filters' })).toBeInTheDocument()

  screen.getAllByText(/Clear filter:/).forEach((el) => {
    expect(el).toHaveClass('govuk-visually-hidden')
  })

  // TODO add additional features here in future filter work

  // Keyword
  expect(screen.getByRole('link', { name: 'Clear filter: test' })).toHaveAttribute('href', '/studies?page=2')

  // Order is not shown as a filter
  expect(screen.queryByText('a-z')).not.toBeInTheDocument()

  // Clear filters link
  expect(screen.getByRole('link', { name: 'Clear all filters' })).toHaveAttribute('href', '/studies')
})

test('Does not show selected filters panel if no filters selected', () => {
  const mockFilters: Filters = {
    page: 2,
    order: 'a-z',
  }

  render(<SelectedFilters filters={mockFilters} />)

  expect(screen.queryByRole('list', { name: 'Selected filters' })).not.toBeInTheDocument()
})
