import React from 'react'
import type { CardProps } from './Card'
import { Card } from './Card'
import { render } from '@/config/TestUtils'

describe('Card Component', () => {
  const defaultProps: CardProps = {
    children: <div>Card Content</div>,
  }

  test('renders children content', () => {
    const { getByText } = render(<Card {...defaultProps} />)
    const cardContent = getByText('Card Content')
    expect(cardContent).toBeInTheDocument()
  })

  test('applies default padding (3)', () => {
    const { container } = render(<Card {...defaultProps} />)
    const cardElement = container.firstChild as HTMLElement
    expect(cardElement).toHaveClass('govuk-!-padding-3')
  })

  test('applies custom padding', () => {
    const { container } = render(<Card {...defaultProps} padding={2} />)
    const cardElement = container.firstChild as HTMLElement
    expect(cardElement).toHaveClass('govuk-!-padding-2')
  })

  test('applies "filled" style when filled prop is true', () => {
    const { container } = render(<Card {...defaultProps} filled />)
    const cardElement = container.firstChild as HTMLElement
    expect(cardElement).toHaveClass('bg-grey-50')
  })

  test('applies default style when filled prop is false', () => {
    const { container } = render(<Card {...defaultProps} filled={false} />)
    const cardElement = container.firstChild as HTMLElement
    expect(cardElement).toHaveClass('bg-white border-grey-120 border border-b-2')
  })

  test('applies custom className', () => {
    const { container } = render(<Card {...defaultProps} className="custom-class" />)
    const cardElement = container.firstChild as HTMLElement
    expect(cardElement).toHaveClass('custom-class')
  })

  test('applies custom html attributes', () => {
    const { container } = render(<Card {...defaultProps} id="custom-id" />)
    const cardElement = container.firstChild as HTMLElement
    expect(cardElement).toHaveAttribute('id', 'custom-id')
  })
})
