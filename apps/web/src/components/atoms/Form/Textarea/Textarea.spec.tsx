import { render } from '@testing-library/react'
import React from 'react'
import type { FieldErrors } from 'react-hook-form'
import { Textarea } from './Textarea'

test('Renders correctly without errors or hint', () => {
  const label = 'Textarea Label'
  const name = 'textareaName'
  const errors: FieldErrors = {}
  const defaultValue = ''
  const remainingCharacters = undefined

  const { getByLabelText, queryByText } = render(
    <Textarea
      defaultValue={defaultValue}
      errors={errors}
      label={label}
      name={name}
      remainingCharacters={remainingCharacters}
    />
  )

  const textareaElement = getByLabelText(label)
  expect(textareaElement).toBeInTheDocument()
  expect(textareaElement).toHaveValue(defaultValue)
  expect(textareaElement).toHaveAttribute('aria-invalid', 'false')

  const remainingCharactersElement = queryByText('characters remaining')
  expect(remainingCharactersElement).not.toBeInTheDocument()
})

test('Renders correctly with errors, hint, and remaining characters', () => {
  const label = 'Textarea Label'
  const name = 'textareaName'
  const errors: FieldErrors = {
    textareaName: {
      message: 'Textarea error message',
      type: 'required',
    },
  }
  const hint = 'Textarea hint'
  const defaultValue = ''
  const remainingCharacters = 50

  const { getByLabelText, getByText } = render(
    <Textarea
      defaultValue={defaultValue}
      errors={errors}
      hint={hint}
      label={label}
      name={name}
      remainingCharacters={remainingCharacters}
    />
  )

  const textareaElement = getByLabelText(label)
  expect(textareaElement).toBeInTheDocument()
  expect(textareaElement).toHaveValue(defaultValue)
  expect(textareaElement).toHaveAttribute('aria-invalid', 'true')

  const errorElement = getByText('Textarea error message')
  expect(errorElement).toBeInTheDocument()

  const hintElement = getByText(hint)
  expect(hintElement).toBeInTheDocument()

  const remainingCharactersElement = getByText('You have 50 characters remaining')
  expect(remainingCharactersElement).toBeInTheDocument()
})
