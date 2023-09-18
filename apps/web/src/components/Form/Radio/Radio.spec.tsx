import { render } from '@testing-library/react'
import React from 'react'

import { Radio } from './Radio'

test('renders correctly', () => {
  const label = 'Radio Label'
  const value = 'radioValue'
  const id = 'radioId'

  const { getByLabelText } = render(<Radio label={label} value={value} id={id} />)

  const radioElement = getByLabelText(label) as HTMLInputElement
  expect(radioElement).toBeInTheDocument()
  expect(radioElement).toHaveAttribute('type', 'radio')
  expect(radioElement).toHaveAttribute('value', value)
  expect(radioElement).toHaveAttribute('id', id)
  expect(radioElement).not.toBeChecked()

  const labelElement = getByLabelText(label)
  expect(labelElement).toBeInTheDocument()
})
