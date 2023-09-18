import userEvent from '@testing-library/user-event'
import mockRouter from 'next-router-mock'

import { act, render, screen, within } from '@/config/test-utils'

import { Header } from './Header'

jest.mock('next/router', () => require('next-router-mock'))

test('Displays the header', () => {
  render(<Header heading="Test Heading" />)

  // Skip link
  expect(screen.getByText('Skip to main content')).toHaveAttribute('href', '#main-content')

  // Logo link
  const frfLogoLink = screen.getByRole('link', {
    name: 'Go to the Find, Recruit and Follow-up homepage',
  })
  expect(frfLogoLink).toHaveAttribute('href', '/')

  // Logo image
  const logo = screen.getByAltText('National Institute for Health and Care Research logo')
  expect(logo).toBeInTheDocument()
  expect(logo).toHaveAttribute('height', '18')
  expect(logo).toHaveAttribute('width', '154')

  // Menu trigger button
  expect(screen.getByRole('button', { name: 'Show navigation menu' })).toBeInTheDocument()

  // Menu fallback link
  const link = screen.getByRole('link', { name: 'Menu' })
  expect(link).toHaveAttribute('href', '/browse')
  expect(link).toHaveClass('js-disabled-show')
})

test('Shows the navigation menu when clicking the menu icon', async () => {
  const user = userEvent.setup()

  render(<Header heading="Test Heading" />)

  const trigger = screen.getByRole('button', { name: 'Show navigation menu' })
  const closedMenu = screen.queryByRole('navigation', { name: 'Navigation menu' })

  expect(trigger).toHaveAttribute('aria-expanded', 'false')
  expect(closedMenu).not.toBeInTheDocument()

  await user.click(trigger)

  expect(trigger).toHaveAttribute('aria-expanded', 'true')

  const openMenu = screen.getByRole('navigation', { name: 'Navigation menu' })
  expect(openMenu).toBeVisible()

  // 1st column
  expect(within(openMenu).getByText('Discover more with the Find, Recruit and Follow-up website')).toBeInTheDocument()

  // 2nd column
  expect(within(openMenu).getByRole('link', { name: 'View data service providers' })).toHaveAttribute(
    'href',
    '/providers'
  )
  expect(
    within(openMenu).getByText(
      'Discover more about the different data service providers within Find, Recruit and Follow-up'
    )
  ).toBeInTheDocument()

  expect(within(openMenu).getByRole('link', { name: 'Contact research support' })).toHaveAttribute(
    'href',
    '/contact-research-support'
  )
  expect(
    within(openMenu).getByText(
      'Get in touch with research support professionals who can help you understand which services might be suitable for your study'
    )
  ).toBeInTheDocument()

  // 3rd column
  expect(within(openMenu).getByRole('link', { name: 'Data service providers' })).toHaveAttribute(
    'href',
    '/data-service-providers'
  )
  expect(
    within(openMenu).getByText(
      'Information for organisations offering Find, Recruit and Follow-up data services to researchers and life sciences companies'
    )
  ).toBeInTheDocument()

  expect(within(openMenu).getByRole('link', { name: 'Research support colleagues' })).toHaveAttribute(
    'href',
    '/research-support'
  )
  expect(
    within(openMenu).getByText(
      'Information for colleagues within the various research support organisations across the UK'
    )
  ).toBeInTheDocument()

  // 4th column
  expect(within(openMenu).getByRole('link', { name: 'Provide feedback' })).toHaveAttribute('href', '/feedback')
  expect(within(openMenu).getByText('Your feedback on our service would be invaluable')).toBeInTheDocument()
})

test('Toggle the navigation menu by keyboard keys', async () => {
  const user = userEvent.setup()

  render(<Header heading="Test Heading" />)

  const trigger = screen.getByRole('button', { name: 'Show navigation menu' })
  trigger.focus()

  expect(screen.queryByRole('navigation', { name: 'Navigation menu' })).not.toBeInTheDocument()

  // Open with enter key
  await user.keyboard('{Enter}')
  expect(screen.getByRole('navigation', { name: 'Navigation menu' })).toBeInTheDocument()

  // Close with enter key
  await user.keyboard('{Enter}')
  expect(screen.queryByRole('navigation', { name: 'Navigation menu' })).not.toBeInTheDocument()

  // Open with space key
  await user.keyboard(' ')
  expect(screen.getByRole('navigation', { name: 'Navigation menu' })).toBeInTheDocument()

  // Close with space key
  await user.keyboard(' ')
  expect(screen.queryByRole('navigation', { name: 'Navigation menu' })).not.toBeInTheDocument()
})

test('Hide the navigation menu when clicking away from the menu', async () => {
  const user = userEvent.setup()

  render(
    <>
      <Header heading="Test Heading" />
      <p>Outside</p>
    </>
  )

  await user.click(screen.getByRole('button', { name: 'Show navigation menu' }))

  const menu = screen.getByRole('navigation', { name: 'Navigation menu' })
  expect(menu).toBeVisible()

  await user.click(screen.getByText('Outside'))
  expect(menu).not.toBeVisible()
})

test('Hide the navigation menu when changing page', async () => {
  const user = userEvent.setup()

  render(<Header heading="Test Heading" />)

  await user.click(screen.getByRole('button', { name: 'Show navigation menu' }))

  const menu = screen.getByRole('navigation', { name: 'Navigation menu' })

  expect(menu).toBeVisible()

  // Simulate route change
  act(() => {
    mockRouter.push('/feedback')
  })

  expect(menu).not.toBeVisible()
})
