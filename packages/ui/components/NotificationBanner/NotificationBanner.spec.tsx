import React from 'react'
import { render, screen } from '@testing-library/react'

import { NotificationBanner } from './NotificationBanner'

describe('NotificationBanner Component', () => {
  describe('Rendering the banner', () => {
    test('renders with given heading and content', () => {
      render(<NotificationBanner heading="Test Heading">Test Content</NotificationBanner>)

      expect(screen.getByText('Test Heading')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    test('renders with default Important prefix when success is false', () => {
      render(<NotificationBanner heading="Test Heading">Test Content</NotificationBanner>)
      expect(screen.getByText('Important')).toBeInTheDocument()
    })

    test('renders with Success prefix when success is true', () => {
      render(
        <NotificationBanner success heading="Test Heading">
          Test Content
        </NotificationBanner>
      )
      expect(screen.getByText('Success')).toBeInTheDocument()
    })
  })

  describe('Component roles and styles', () => {
    test('has role alert when success is true', () => {
      render(
        <NotificationBanner success heading="Test Heading">
          Test Content
        </NotificationBanner>
      )
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    test('has role region when success is false', () => {
      render(<NotificationBanner heading="Test Heading">Test Content</NotificationBanner>)
      expect(screen.getByRole('region')).toBeInTheDocument()
    })

    test('applies provided className', () => {
      render(
        <NotificationBanner className="test-class" heading="Test Heading">
          Test Content
        </NotificationBanner>
      )
      expect(screen.getByRole('region')).toHaveClass('test-class')
    })

    test('applies govuk-notification-banner--success class when success is true', () => {
      render(
        <NotificationBanner success heading="Test Heading">
          Test Content
        </NotificationBanner>
      )
      expect(screen.getByRole('alert')).toHaveClass('govuk-notification-banner--success')
    })
  })
})
