import { render } from '@/config/TestUtils'

import Warning from './Warning'

describe('Warning component', () => {
  test('renders correctly', () => {
    const { getByText } = render(<Warning>Paragraph of text</Warning>)
    const warningIcon = getByText('!')
    expect(warningIcon).toBeInTheDocument()
    expect(warningIcon).toHaveAttribute('aria-hidden', 'true')

    const warningAssistive = getByText('Warning')
    expect(warningAssistive).toBeInTheDocument()
    expect(warningAssistive).toHaveClass('govuk-visually-hidden')

    const warningChildren = getByText('Paragraph of text')
    expect(warningChildren).toBeInTheDocument()
  })
})
