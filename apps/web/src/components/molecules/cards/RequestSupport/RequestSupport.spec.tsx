import React from 'react'
import { render, screen } from '@testing-library/react'
import mockRouter from 'next-router-mock'
import { SUPPORT_PAGE } from '../../../../constants/routes'
import { RequestSupport } from './RequestSupport'

describe('RequestSupport Component', () => {
  test('renders a card without a call to action', () => {
    render(<RequestSupport />)

    const headingElement = screen.getByText('Request NIHR CRN support')
    const descriptionElement = screen.getByText(
      'Sponsors or their delegates can request NIHR CRN support with their research study at any time. Click into your study for study level support guidance.'
    )

    expect(headingElement).toBeInTheDocument()
    expect(descriptionElement).toBeInTheDocument()

    expect(screen.queryByRole('link', { name: 'Request support' })).not.toBeInTheDocument()
  })

  test('renders a card with a call to action', async () => {
    await mockRouter.push('/study/123')

    render(<RequestSupport showCallToAction />)

    const headingElement = screen.getByText('Request NIHR CRN support')
    const descriptionElement = screen.getByText(
      'Sponsors or their delegates can request NIHR CRN support with their research study at any time.'
    )

    expect(headingElement).toBeInTheDocument()
    expect(descriptionElement).toBeInTheDocument()

    const linkElement = screen.getByRole('link', { name: 'Request support' })
    expect(linkElement).toHaveAttribute('href', `${SUPPORT_PAGE}?returnPath=/study/123`)

    const startIconElement = screen.getByTestId('start-icon')
    expect(startIconElement).toHaveAttribute('aria-hidden', 'true')
  })
})
