import userEvent from '@testing-library/user-event'

import { render, screen } from '@/config/test-utils'

import { Checkbox } from './Checkbox'

test('Checkbox', async () => {
  const onChangeSpy = jest.fn()
  render(
    <Checkbox name="test" value="test" className="custom-class" checked onChange={onChangeSpy}>
      Test Checkbox
    </Checkbox>
  )
  const checkbox = screen.getByLabelText('Test Checkbox')
  expect(checkbox).toBeChecked()
  expect(checkbox).toHaveAttribute('type', 'checkbox')
  expect(checkbox).toHaveAttribute('value', 'test')
  expect(checkbox).toHaveAttribute('value', 'test')
  expect(checkbox.closest('div')).toHaveClass('custom-class')
  await userEvent.click(checkbox)
  expect(onChangeSpy).toHaveBeenCalled()
})
