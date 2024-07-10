import { render, screen } from '@testing-library/react'

import { Button } from './Button'

test('Button', () => {
  render(<Button>Welcome</Button>)
  const button = screen.getByRole('button', { name: 'Welcome' })
  expect(button).toHaveClass('govuk-button')
})

test('Button (Secondary)', () => {
  render(<Button secondary>Welcome</Button>)
  const button = screen.getByRole('button', { name: 'Welcome' })
  expect(button).toHaveClass('govuk-button--secondary')
})

test('Button (Warning)', () => {
  render(<Button warning>Welcome</Button>)
  const button = screen.getByRole('button', { name: 'Welcome' })
  expect(button).toHaveClass('govuk-button--warning')
})
