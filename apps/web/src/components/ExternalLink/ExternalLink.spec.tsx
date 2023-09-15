import { render, screen } from '@/config/test-utils'

import { ExternalLink } from './ExternalLink'

test('External link', () => {
  render(<ExternalLink href="http://mock-site-url">Mock site name</ExternalLink>)

  const link = screen.getByRole('link', { name: 'Mock site name (Opens in a new window)' })

  expect(link).toHaveAttribute('target', '_blank')
  expect(link).toHaveAttribute('href', 'http://mock-site-url')
})
