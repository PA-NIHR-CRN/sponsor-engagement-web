import { render } from '@testing-library/react'
import React from 'react'
import { Checkbox } from './Checkbox'

test('renders correctly', () => {
  const label = 'Checkbox Label'
  const value = 'checkboxValue'
  const id = 'checkboxId'

  const { getByLabelText } = render(<Checkbox id={id} label={label} value={value} />)

  const checkboxElement = getByLabelText(label) as HTMLInputElement
  expect(checkboxElement).toBeInTheDocument()
  expect(checkboxElement).toHaveAttribute('type', 'checkbox')
  expect(checkboxElement).toHaveAttribute('value', value)
  expect(checkboxElement).toHaveAttribute('id', id)
  expect(checkboxElement).not.toBeChecked()

  const labelElement = getByLabelText(label)
  expect(labelElement).toBeInTheDocument()
})
