import React from 'react'
import type { FieldErrors } from 'react-hook-form'
import { render } from '@testing-library/react'
import { ErrorInline } from './ErrorInline'

test('Renders the error message correctly', () => {
  const name = 'exampleField'
  const errors: FieldErrors = {
    exampleField: {
      message: 'This field is required',
      type: 'required',
    },
  }

  const { getByText } = render(<ErrorInline errors={errors} name={name} />)
  const errorMessage = getByText('This field is required')
  expect(errorMessage).toBeInTheDocument()
})

test('Does not render when there are no errors', () => {
  const name = 'exampleField'
  const errors = {}

  const { queryByText } = render(<ErrorInline errors={errors} name={name} />)
  const errorMessage = queryByText('This field is required')
  expect(errorMessage).toBeNull()
})
