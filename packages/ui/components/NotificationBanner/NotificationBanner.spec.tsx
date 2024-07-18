import React from 'react'
import { render } from '@testing-library/react'

import { NotificationBanner } from './NotificationBanner'

describe('NotificationBanner Component', () => {
  describe('Rendering the banner', () => {
    test('renders with given heading and content', () => {
      const { getByText } = render(<NotificationBanner heading="Test Heading">Test Content</NotificationBanner>)

      expect(getByText('Test Heading')).toBeInTheDocument()
      expect(getByText('Test Content')).toBeInTheDocument()
    })

    test('renders with default Important prefix when success is false', () => {
      const { getByText } = render(<NotificationBanner heading="Test Heading">Test Content</NotificationBanner>)
      expect(getByText('Important')).toBeInTheDocument()
    })

    test('renders with Success prefix when success is true', () => {
      const { getByText } = render(
        <NotificationBanner success heading="Test Heading">
          Test Content
        </NotificationBanner>
      )
      expect(getByText('Success')).toBeInTheDocument()
    })

    test('renders rich text when richText prop is true', () => {
      const { getByText } = render(
        <NotificationBanner isRichText heading="Test Heading">
          Test Content
        </NotificationBanner>
      )

      const richTextContent = getByText('Test Content')
      expect(richTextContent).toBeInTheDocument()

      expect(richTextContent.parentElement?.tagName).not.toBe('p')
    })
  })

  describe('Component roles and styles', () => {
    test('has role alert when success is true', () => {
      const { getByRole } = render(
        <NotificationBanner success heading="Test Heading">
          Test Content
        </NotificationBanner>
      )
      expect(getByRole('alert')).toBeInTheDocument()
    })

    test('has role region when success is false', () => {
      const { getByRole } = render(<NotificationBanner heading="Test Heading">Test Content</NotificationBanner>)
      expect(getByRole('region')).toBeInTheDocument()
    })

    test('applies provided className', () => {
      const { getByRole } = render(
        <NotificationBanner className="test-class" heading="Test Heading">
          Test Content
        </NotificationBanner>
      )
      expect(getByRole('region')).toHaveClass('test-class')
    })

    test('applies govuk-notification-banner--success class when success is true', () => {
      const { getByRole } = render(
        <NotificationBanner success heading="Test Heading">
          Test Content
        </NotificationBanner>
      )
      expect(getByRole('alert')).toHaveClass('govuk-notification-banner--success')
    })
  })
})
