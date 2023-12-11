import React from 'react'
import { Radio } from './Radio'
import { render } from '@/config/TestUtils'

test('renders correctly', () => {
  const label = 'Radio Label'
  const value = 'radioValue'
  const id = 'radioId'

  const { getByLabelText } = render(<Radio id={id} label={label} value={value} />)

  const radioElement = getByLabelText(label) as HTMLInputElement
  expect(radioElement).toBeInTheDocument()
  expect(radioElement).toHaveAttribute('type', 'radio')
  expect(radioElement).toHaveAttribute('value', value)
  expect(radioElement).toHaveAttribute('id', id)
  expect(radioElement).not.toBeChecked()

  const labelElement = getByLabelText(label)
  expect(labelElement).toBeInTheDocument()
})
