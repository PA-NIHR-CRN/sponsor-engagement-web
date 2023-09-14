import { render } from '@testing-library/react'
import React from 'react'
import { FieldErrors } from 'react-hook-form'

import { Option, Select } from './Select'

test('Renders correctly without errors or hint', () => {
  const label = 'Select Label'
  const name = 'selectName'
  const errors: FieldErrors = {}
  const defaultValue = 'option2'

  const { getByLabelText } = render(
    <Select label={label} name={name} errors={errors} defaultValue={defaultValue}>
      <Option value="option1">Option 1</Option>
      <Option value="option2">Option 2</Option>
      <Option value="option3">Option 3</Option>
    </Select>
  )

  const selectElement = getByLabelText(label)
  expect(selectElement).toBeInTheDocument()
  expect(selectElement).toHaveValue(defaultValue)
  expect(selectElement).toHaveAttribute('aria-invalid', 'false')
})

test('Renders correctly with errors and hint', () => {
  const label = 'Select Label'
  const name = 'selectName'
  const errors: FieldErrors = {
    selectName: {
      message: 'Select error message',
      type: 'required',
    },
  }
  const hint = 'Select hint'
  const defaultValue = 'option2'

  const { getByLabelText, getByText } = render(
    <Select label={label} name={name} errors={errors} hint={hint} defaultValue={defaultValue}>
      <Option value="option1">Option 1</Option>
      <Option value="option2">Option 2</Option>
      <Option value="option3">Option 3</Option>
    </Select>
  )

  const selectElement = getByLabelText(label)
  expect(selectElement).toBeInTheDocument()
  expect(selectElement).toHaveValue(defaultValue)
  expect(selectElement).toHaveAttribute('aria-invalid', 'true')

  const errorElement = getByText('Select error message')
  expect(errorElement).toBeInTheDocument()

  const hintElement = getByText(hint)
  expect(hintElement).toBeInTheDocument()
})
