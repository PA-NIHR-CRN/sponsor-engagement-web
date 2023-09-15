import React from 'react'
import { FieldErrors } from 'react-hook-form'

import { render } from '@/config/test-utils'

import { ErrorInline } from './ErrorInline'

test('Renders the error message correctly', () => {
  const name = 'exampleField'
  const errors: FieldErrors = {
    exampleField: {
      message: 'This field is required',
      type: 'required',
    },
  }

  const { getByText } = render(<ErrorInline name={name} errors={errors} />)
  const errorMessage = getByText('This field is required')
  expect(errorMessage).toBeInTheDocument()
})

test('Does not render when there are no errors', () => {
  const name = 'exampleField'
  const errors = {}

  const { queryByText } = render(<ErrorInline name={name} errors={errors} />)
  const errorMessage = queryByText('This field is required')
  expect(errorMessage).toBeNull()
})
