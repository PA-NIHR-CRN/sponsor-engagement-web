import mockRouter from 'next-router-mock'

import { act, render, screen, within } from '@/config/test-utils'

import Pagination from './Pagination'

test('No results', () => {
  render(<Pagination initialPage={0} initialPageSize={0} totalItems={0} />)

  const pagination = screen.queryByRole('navigation', { name: 'results' })
  expect(pagination).not.toBeInTheDocument()
})

test('No page set - defaults to first page', () => {
  mockRouter.push('')

  render(<Pagination initialPage={0} initialPageSize={4} totalItems={5} />)

  // Pagination
  const pagination = screen.getByRole('navigation', { name: 'results' })
  expect(pagination).toBeInTheDocument()

  // Prev Link (hidden when on first page)
  expect(within(pagination).queryByRole('link', { name: 'Previous' })).not.toBeInTheDocument()

  // Page 1 Link
  expect(within(pagination).getByRole('link', { name: 'Page 1' })).toHaveAttribute('href', '?page=1')
  expect(within(pagination).getByRole('link', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')

  // Page 2 Link
  expect(within(pagination).getByRole('link', { name: 'Page 2' })).toHaveAttribute('href', '?page=2')
  expect(within(pagination).getByRole('link', { name: 'Page 2' })).not.toHaveAttribute('aria-current')

  // Next Link
  expect(within(pagination).getByRole('link', { name: 'Next' })).toHaveAttribute('href', '?page=2')
})

test('First page set', () => {
  mockRouter.push('?page=1')

  render(<Pagination initialPage={0} initialPageSize={4} totalItems={5} />)

  // Pagination
  const pagination = screen.getByRole('navigation', { name: 'results' })
  expect(pagination).toBeInTheDocument()

  // Prev Link (hidden when on first page)
  expect(within(pagination).queryByRole('link', { name: 'Previous' })).not.toBeInTheDocument()

  // Page 1 Link
  expect(within(pagination).getByRole('link', { name: 'Page 1' })).toHaveAttribute('href', '?page=1')
  expect(within(pagination).getByRole('link', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')

  // Page 2 Link
  expect(within(pagination).getByRole('link', { name: 'Page 2' })).toHaveAttribute('href', '?page=2')
  expect(within(pagination).getByRole('link', { name: 'Page 2' })).not.toHaveAttribute('aria-current')

  // Next Link
  expect(within(pagination).getByRole('link', { name: 'Next' })).toHaveAttribute('href', '?page=2')
})

test('Last page set', async () => {
  mockRouter.push('?page=2')

  render(<Pagination initialPage={1} initialPageSize={4} totalItems={5} />)

  // Pagination
  const pagination = screen.getByRole('navigation', { name: 'results' })
  expect(pagination).toBeInTheDocument()

  // Prev Link
  expect(within(pagination).getByRole('link', { name: 'Previous' })).toHaveAttribute('href', '?page=1')

  // Page 1 Link
  expect(within(pagination).getByRole('link', { name: 'Page 1' })).toHaveAttribute('href', '?page=1')
  expect(within(pagination).getByRole('link', { name: 'Page 1' })).not.toHaveAttribute('aria-current')

  // Page 2 Link
  expect(within(pagination).getByRole('link', { name: 'Page 2' })).toHaveAttribute('href', '?page=2')
  expect(within(pagination).getByRole('link', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page')

  // Next Link (hidden when on last page)
  expect(within(pagination).queryByRole('link', { name: 'Next' })).not.toBeInTheDocument()
})

test('Forward/back updates the set page', async () => {
  mockRouter.push('?page=1')

  render(<Pagination initialPage={1} initialPageSize={4} totalItems={5} />)

  const pagination = screen.getByRole('navigation', { name: 'results' })

  expect(within(pagination).getByRole('link', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')
  expect(within(pagination).getByRole('link', { name: 'Page 2' })).not.toHaveAttribute('aria-current')

  // Simulate route change to page 2
  act(() => {
    mockRouter.push('?page=2')
  })

  expect(within(pagination).getByRole('link', { name: 'Page 1' })).not.toHaveAttribute('aria-current')
  expect(within(pagination).getByRole('link', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page')

  // Simulate back button
  act(() => {
    mockRouter.push('?page=1')
  })

  expect(within(pagination).getByRole('link', { name: 'Page 1' })).toHaveAttribute('aria-current', 'page')
  expect(within(pagination).getByRole('link', { name: 'Page 2' })).not.toHaveAttribute('aria-current')
})
