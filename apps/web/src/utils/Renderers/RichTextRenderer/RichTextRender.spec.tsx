import { render } from '@/config/TestUtils'

import { mockContent } from './mockContent'
import { RichTextRenderer } from './RichTextRenderer'

test('Rich text renderer', () => {
  const { getByText, getByRole, getAllByRole } = render(<RichTextRenderer>{mockContent}</RichTextRenderer>)

  // Assert that the paragraph node is rendered correctly
  const paragraphElement = getByText('Hello, World!')
  expect(paragraphElement).toBeInTheDocument()

  // Assert that the bold node is rendered correctly
  const boldElement = getByText('Bold text!')
  expect(boldElement).toHaveClass('font-bold')

  // Assert that the unordered list node is rendered correctly
  const unorderedListElement = getByRole('list')
  expect(unorderedListElement).toBeInTheDocument()

  // Assert that the list item nodes are rendered correctly
  const listItemElements = getAllByRole('listitem')
  expect(listItemElements).toHaveLength(2)

  // Assert that the first list item contains the correct text
  const listItem1Element = getByText('List item 1')
  expect(listItem1Element).toBeInTheDocument()

  // Assert that the second list item contains the correct text
  const listItem2Element = getByText('List item 2')
  expect(listItem2Element).toBeInTheDocument()

  // Assert that the heading (level 2) node is rendered
  const h2Element = getByRole('heading', { level: 2, name: 'Heading level 2' })
  expect(h2Element).toBeInTheDocument()
  expect(h2Element).toHaveClass('govuk-heading-l')

  // Assert that the heading (level 3) node is rendered
  const h3Element = getByRole('heading', { level: 3, name: 'Heading level 3' })
  expect(h3Element).toBeInTheDocument()
  expect(h3Element).toHaveClass('govuk-heading-m')

  // Assert that the heading (level 4) node is rendered
  const h4Element = getByRole('heading', { level: 4, name: 'Heading level 4' })
  expect(h4Element).toBeInTheDocument()
  expect(h4Element).toHaveClass('govuk-heading-s')
})
