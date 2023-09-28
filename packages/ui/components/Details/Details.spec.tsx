import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import { Details } from './Details'

test('External link', async () => {
  const user = userEvent.setup()

  const { getByRole, getByText } = render(
    <Details heading="Mocked heading" className="mock-class">
      Mocked body text
    </Details>
  )

  expect(getByRole('group')).toHaveClass('mock-class')
  expect(getByText('Mocked heading')).toBeInTheDocument()
  expect(getByText('Mocked body text')).not.toBeVisible()

  await user.click(getByText('Mocked heading'))

  expect(getByText('Mocked body text')).toBeVisible()
})
