import { render, screen } from '@/config/TestUtils'

import { Footer } from './Footer'

test('Displays the correct links', () => {
  const { getByText } = render(<Footer />)

  // Terms and conditions link
  const termsLink = getByText('Terms and conditions')
  expect(termsLink).toHaveAttribute(
    'href',
    'https://sites.google.com/nihr.ac.uk/rdncc-policies/sponsor-engagement-tool/set-terms-and-conditions'
  )
  expect(termsLink).toHaveAttribute('target', '_blank')
  expect(termsLink).toHaveAttribute('aria-label', 'Terms and conditions (opens in new tab)')

  // Privacy policy link
  const privacyLink = getByText('Privacy policy')
  expect(privacyLink).toHaveAttribute(
    'href',
    'https://sites.google.com/nihr.ac.uk/rdncc-policies/sponsor-engagement-tool/set-privacy-notice'
  )
  expect(privacyLink).toHaveAttribute('target', '_blank')
  expect(privacyLink).toHaveAttribute('aria-label', 'Privacy policy (opens in new tab)')

  // Cookie policy link
  const cookieLink = getByText('Cookie policy')
  expect(cookieLink).toHaveAttribute(
    'href',
    'https://sites.google.com/nihr.ac.uk/rdncc-policies/sponsor-engagement-tool/set-cookie-policy'
  )
  expect(cookieLink).toHaveAttribute('target', '_blank')
  expect(cookieLink).toHaveAttribute('aria-label', 'Cookie policy (opens in new tab)')

  // Accessibility link
  const accessibilityLink = getByText('Accessibility')
  expect(accessibilityLink).toHaveAttribute(
    'href',
    'https://sites.google.com/nihr.ac.uk/rdncc-policies/sponsor-engagement-tool/set-accessibility-statement'
  )
  expect(accessibilityLink).toHaveAttribute('target', '_blank')
  expect(accessibilityLink).toHaveAttribute('aria-label', 'Accessibility (opens in new tab)')

  // Release Notes link
  const releaseNotesLink = getByText('Release notes')
  expect(releaseNotesLink).toHaveAttribute(
    'href',
    'https://sites.google.com/nihr.ac.uk/nihr-sponsor-engagement-tool/se-tool-release-notes'
  )
  expect(releaseNotesLink).toHaveAttribute('target', '_blank')
  expect(releaseNotesLink).toHaveAttribute('aria-label', 'Release notes (opens in new tab)')

  //Displays all footer links and Shaw Trust link
  expect(screen.getAllByRole('link')).toHaveLength(6)
})

test('Displays the Shaw Trust logo and link', () => {
  const { getByRole } = render(<Footer />)

  // Link
  const link = getByRole('link', { name: 'Shaw Trust accessibility website (opens in new tab)' })
  expect(link).toBeInTheDocument()
  expect(link).toHaveAttribute(
    'href',
    'https://www.accessibility-services.co.uk/certificates/nihr-sponsor-engagement-tool/'
  )
  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('rel', 'noreferrer noopener')
  expect(link).toHaveAttribute('aria-label', 'Shaw Trust accessibility website (opens in new tab)')

  // Logo
  const logo = getByRole('img')
  expect(logo).toBeVisible()
  expect(logo).toHaveAttribute('height', '40')
  expect(logo).toHaveAttribute('width', '220')
})
