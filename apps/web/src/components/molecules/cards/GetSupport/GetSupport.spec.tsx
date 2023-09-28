import React from 'react'
import { render, screen } from '@testing-library/react'
import { GetSupport } from './GetSupport'

describe('GetSupport Component', () => {
  test('renders a card with expected content', () => {
    render(<GetSupport />)

    const headingElement = screen.getByText('Get NIHR CRN support')
    const descriptionElement = screen.getByText(
      'Sponsors or their delegates can get NIHR CRN support with their research study at any time.'
    )

    expect(headingElement).toBeInTheDocument()
    expect(descriptionElement).toBeInTheDocument()
  })

  test('renders a "Get support" button with a StartIcon', () => {
    render(<GetSupport />)

    const buttonElement = screen.getByText('Get support')
    const startIconElement = screen.getByTestId('start-icon')

    expect(buttonElement).toBeInTheDocument()
    expect(startIconElement).toHaveAttribute('aria-hidden', 'true')
  })
})
