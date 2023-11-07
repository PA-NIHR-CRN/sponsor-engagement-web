import React from 'react'
import { render, screen } from '@testing-library/react'
import { RequestSupport } from './RequestSupport'

describe('RequestSupport Component', () => {
  test('renders a card with expected content', () => {
    render(<RequestSupport />)

    const headingElement = screen.getByText('Request NIHR CRN support')
    const descriptionElement = screen.getByText(
      'Sponsors or their delegates can request NIHR CRN support with their research study at any time.'
    )

    expect(headingElement).toBeInTheDocument()
    expect(descriptionElement).toBeInTheDocument()
  })

  test('renders a "Request support" button with a StartIcon', () => {
    render(<RequestSupport />)

    const buttonElement = screen.getByText('Request support')
    const startIconElement = screen.getByTestId('start-icon')

    expect(buttonElement).toBeInTheDocument()
    expect(startIconElement).toHaveAttribute('aria-hidden', 'true')
  })
})
