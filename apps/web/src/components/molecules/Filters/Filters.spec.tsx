import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { STUDIES_PAGE } from '../../../constants/routes'
import type { FiltersProps } from './Filters'
import { Filters } from './Filters'

const defaultProps: FiltersProps = {
  filters: { page: 1 },
}

test('Allows searching by keyword', async () => {
  const onFilterChangeSpy = jest.fn()

  render(<Filters {...defaultProps} onFilterChange={onFilterChangeSpy} />)

  const form = screen.getByRole('search', { name: 'Filter by' })
  expect(form).toHaveAttribute('method', 'get')
  expect(form).toHaveAttribute('action', STUDIES_PAGE)
  expect(form).toHaveAttribute('id', 'filters-form')

  const input = screen.getByLabelText('Search study title, protocol number or IRAS ID')
  const submitBtn = screen.getByRole('button', { name: 'Search' })

  await userEvent.type(input, 'Test search')
  await userEvent.click(submitBtn)
  expect(onFilterChangeSpy).toHaveBeenNthCalledWith(1, { q: 'Test search' })
})

test('Allows non-JavaScript users to apply filters', () => {
  render(<Filters {...defaultProps} />)
  expect(screen.getByRole('button', { name: 'Apply filters' })).toBeInTheDocument()
})

test('Allows users with JavaScript to apply filters', async () => {
  const onFilterChangeSpy = jest.fn()

  render(<Filters {...defaultProps} onFilterChange={onFilterChangeSpy} />)

  const input = screen.getByLabelText('Search study title, protocol number or IRAS ID')
  await userEvent.type(input, 'Test search')
  await userEvent.keyboard('{Enter}')

  expect(onFilterChangeSpy).toHaveBeenNthCalledWith(1, { q: 'Test search' })
})

test('Default input states are correct in relation to the currently enabled filters', () => {
  render(
    <Filters
      {...defaultProps}
      filters={{
        q: 'Test search',
        page: 1,
        // TODO: Add filters defaults here in upcoming tickets
      }}
    />
  )

  // Keyword input has correct default value
  expect(screen.getByLabelText('Search study title, protocol number or IRAS ID')).toHaveValue('Test search')
})

test('Clears the search query after the search input is emptied', async () => {
  const onFilterChangeSpy = jest.fn()

  render(
    <Filters
      {...defaultProps}
      filters={{
        q: 'Test search',
        page: 1,
      }}
      onFilterChange={onFilterChangeSpy}
    />
  )

  await userEvent.clear(screen.getByLabelText('Search study title, protocol number or IRAS ID'))

  expect(onFilterChangeSpy).toHaveBeenLastCalledWith({ q: '' })
})
