import React from 'react'
import { FieldErrors } from 'react-hook-form'

import { render } from '@/config/test-utils'

import { ErrorSummary } from './ErrorSummary'

test('Renders the error summary correctly', () => {
  const errors: FieldErrors = {
    field1: {
      message: 'Error message 1',
      type: 'required',
    },
    field2: {
      message: 'Error message 2',
      type: 'required',
    },
  }

  const { getByRole, getByText, getAllByRole } = render(<ErrorSummary errors={errors} />)
  const errorSummary = getByRole('alert')
  expect(errorSummary).toBeInTheDocument()
  expect(getByText('There is a problem')).toBeInTheDocument()
  expect(getByText('Error message 1')).toBeInTheDocument()
  expect(getByText('Error message 2')).toBeInTheDocument()

  const listItems = getAllByRole('listitem')
  expect(listItems).toHaveLength(2)
})

test('Renders a server error when "root" key exists in errors', () => {
  const errors: FieldErrors = {
    root: {
      serverError: {
        type: 'custom',
        message: 'Server error message',
      },
    },
  }

  const { getByRole, getByText, getAllByRole } = render(<ErrorSummary errors={errors} />)
  const errorSummary = getByRole('alert')
  expect(errorSummary).toBeInTheDocument()
  expect(getByText('There is a problem')).toBeInTheDocument()
  expect(getByText('Server error message')).toBeInTheDocument()

  const listItems = getAllByRole('listitem')
  expect(listItems).toHaveLength(1)
})

test('Does not render when there are no errors', () => {
  const errors: FieldErrors = {}

  const { queryByRole, queryAllByRole } = render(<ErrorSummary errors={errors} />)
  const errorSummary = queryByRole('alert')
  expect(errorSummary).not.toBeInTheDocument()

  const listItems = queryAllByRole('listitem')
  expect(listItems).toHaveLength(0)
})
