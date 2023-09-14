import { render, screen } from '@testing-library/react'

import { Container } from './Container'

test('Displays content inside a GDS container', () => {
  render(<Container>Find, Recruit and Follow-up</Container>)

  expect(screen.getByText('Find, Recruit and Follow-up')).toHaveClass('govuk-width-container')
})
