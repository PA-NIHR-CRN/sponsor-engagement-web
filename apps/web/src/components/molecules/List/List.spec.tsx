import { render, within } from '@/config/TestUtils'

import { List, ListItem } from './List'

describe('List unit tests', () => {
  test('Unordered list', () => {
    const { getByText, getByRole } = render(
      <List aria-label="mock-list" className="custom-class" heading="mock-list">
        <ListItem>Test item 1</ListItem>
        <ListItem>Test item 2</ListItem>
      </List>
    )
    expect(getByText('mock-list')).toHaveAttribute('aria-hidden')
    const list = getByRole('list', { name: 'mock-list' })
    expect(list).toHaveClass('custom-class', 'govuk-list', 'govuk-list--bullet')
    expect(list.tagName).toBe('UL')

    const listItems = within(list).getAllByRole('listitem')

    expect(listItems).toHaveLength(2)
    expect(listItems[0]).toHaveTextContent('Test item 1')
    expect(listItems[1]).toHaveTextContent('Test item 2')
  })

  test('Ordered list', () => {
    const { queryByText, getByRole } = render(
      <List aria-label="mock-list" as="ol">
        <ListItem>Test item 1</ListItem>
        <ListItem>Test item 2</ListItem>
      </List>
    )
    expect(queryByText('mock-list')).not.toBeInTheDocument()
    const orderedList = getByRole('list', { name: 'mock-list' })
    expect(orderedList.tagName).toBe('OL')
    expect(orderedList).toHaveClass('govuk-list--number')
  })

  test('List item with icon', () => {
    const { getByRole } = render(
      <List>
        <ListItem icon={<span data-testid="mock-icon" />}>Test item 1</ListItem>
      </List>
    )

    const list = getByRole('list')
    expect(within(list).getByTestId('mock-icon')).toBeInTheDocument()
  })
})
