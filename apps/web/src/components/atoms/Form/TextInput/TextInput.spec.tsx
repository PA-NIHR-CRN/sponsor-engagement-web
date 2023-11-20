import { render } from '@testing-library/react'
import React from 'react'
import type { FieldErrors } from 'react-hook-form'
import { TextInput } from './TextInput'

test('renders correctly without errors or hint', () => {
  const label = 'Input Label'
  const name = 'inputName'
  const errors: FieldErrors = {}
  const defaultValue = ''

  const { getByLabelText, queryByRole } = render(
    <TextInput defaultValue={defaultValue} errors={errors} label={label} name={name} />
  )

  const inputElement = getByLabelText(label)
  expect(inputElement).toBeInTheDocument()
  expect(inputElement).toHaveAttribute('type', 'text')
  expect(inputElement).toHaveValue(defaultValue)
  expect(inputElement).toHaveAttribute('aria-invalid', 'false')

  const errorElement = queryByRole('alert')
  expect(errorElement).not.toBeInTheDocument()
})

test('renders correctly with errors and hint', () => {
  const label = 'Input Label'
  const name = 'inputName'
  const errors: FieldErrors = {
    inputName: {
      message: 'Input error message',
      type: 'required',
    },
  }
  const hint = 'Input hint'
  const defaultValue = ''

  const { getByLabelText, getByText } = render(
    <TextInput defaultValue={defaultValue} errors={errors} hint={hint} label={label} name={name} />
  )

  const inputElement = getByLabelText(label)
  expect(inputElement).toBeInTheDocument()
  expect(inputElement).toHaveAttribute('type', 'text')
  expect(inputElement).toHaveValue(defaultValue)
  expect(inputElement).toHaveAttribute('aria-invalid', 'true')

  const errorElement = getByText('Input error message')
  expect(errorElement).toBeInTheDocument()

  const hintElement = getByText(hint)
  expect(hintElement).toBeInTheDocument()
})

test('renders with custom attributes', () => {
  const label = 'Input Label'
  const name = 'inputName'

  const { getByLabelText } = render(<TextInput label={label} name={name} type="password" />)

  const inputElement = getByLabelText(label)
  expect(inputElement).toBeInTheDocument()
  expect(inputElement).toHaveAttribute('type', 'password')
})
