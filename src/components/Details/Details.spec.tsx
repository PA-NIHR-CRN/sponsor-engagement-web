import userEvent from '@testing-library/user-event'

import { render, screen } from '@/config/test-utils'

import { Details } from './Details'

test('External link', async () => {
  const user = userEvent.setup()

  render(
    <Details heading="Mocked heading" className="mock-class">
      Mocked body text
    </Details>
  )

  expect(screen.getByRole('group')).toHaveClass('mock-class')
  expect(screen.getByText('Mocked heading')).toBeInTheDocument()
  expect(screen.getByText('Mocked body text')).not.toBeVisible()

  await user.click(screen.getByText('Mocked heading'))

  expect(screen.getByText('Mocked body text')).toBeVisible()
})
