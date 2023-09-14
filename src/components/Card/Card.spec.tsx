import { render, screen } from '@/config/test-utils'

import { Card } from './Card'

test('Card', () => {
  render(
    <Card as="section" aria-label="test-card" className="custom-class">
      Test content
    </Card>
  )
  const card = screen.getByRole('region', { name: 'test-card' })
  expect(card).toHaveClass('custom-class')
  expect(card).toHaveTextContent('Test content')
})
