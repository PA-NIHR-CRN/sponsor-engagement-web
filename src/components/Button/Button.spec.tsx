import { render, screen } from '@/config/test-utils'

import { Button } from './Button'

test('Button', () => {
  render(<Button>Welcome</Button>)
  const button = screen.getByRole('button', { name: 'Welcome' })
  expect(button).toHaveClass('govuk-button')
})
