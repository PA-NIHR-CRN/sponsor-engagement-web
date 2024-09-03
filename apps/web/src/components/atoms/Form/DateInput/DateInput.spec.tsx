import type { FieldErrors } from 'react-hook-form'

import { render } from '@/config/TestUtils'

import { DateInput } from './DateInput'

const mockOnChange = jest.fn()

const defaultValueState = {
  year: '',
  month: '',
  day: '',
}

test('renders three inputs with correct attributes and no error', () => {
  const legendLabel = 'Date input label'
  const name = 'input-name'
  const errors: FieldErrors = {}
  const { getByLabelText, getByRole, queryByRole } = render(
    <DateInput errors={errors} label={legendLabel} name={name} onChange={mockOnChange} value={defaultValueState} />
  )
  // Legend label
  const fieldset = getByRole('group')
  expect(fieldset).toBeInTheDocument()
  const legend = fieldset.firstChild as HTMLElement
  expect(legend).toBeInTheDocument()
  expect(legend).toHaveTextContent(legendLabel)
  // Day input field
  const dayInput = getByLabelText('Day')
  expect(dayInput).toBeInTheDocument()
  expect(dayInput).toHaveAttribute('name', `${name}-day`)
  expect(dayInput).toHaveValue('')
  // Month input field
  const monthInput = getByLabelText('Month')
  expect(monthInput).toBeInTheDocument()
  expect(monthInput).toHaveAttribute('name', `${name}-month`)
  expect(dayInput).toHaveValue('')
  // Year input field
  const yearInput = getByLabelText('Year')
  expect(yearInput).toBeInTheDocument()
  expect(yearInput).toHaveAttribute('name', `${name}-year`)
  expect(dayInput).toHaveValue('')
  const errorElement = queryByRole('alert')
  expect(errorElement).not.toBeInTheDocument()
})

test('renders three inputs with correct value', () => {
  const value = { year: '2021', month: '09', day: '01' }

  const { getByLabelText } = render(
    <DateInput errors={{}} label="Date input label" name="input-name" onChange={mockOnChange} value={value} />
  )
  // Day input field value
  const dayInput = getByLabelText('Day')
  expect(dayInput).toBeInTheDocument()
  expect(dayInput).toHaveValue(value.day)
  // Month input field value
  const monthInput = getByLabelText('Month')
  expect(monthInput).toBeInTheDocument()
  expect(monthInput).toHaveValue(value.month)
  // Year input field value
  const yearInput = getByLabelText('Year')
  expect(yearInput).toBeInTheDocument()
  expect(yearInput).toHaveValue(value.year)
})

// TODO: Fix error logic
test.skip('renders correctly with errors', () => {
  const errors: FieldErrors = {
    'input-name': {
      message: 'Input error message',
      type: 'required',
    },
  }
  const { getByLabelText, getByText } = render(
    <DateInput
      errors={errors}
      label="Date input label"
      name="input-name"
      onChange={mockOnChange}
      value={defaultValueState}
    />
  )
  const dayInput = getByLabelText('Day')
  expect(dayInput).toHaveValue('')
  expect(dayInput).toHaveAttribute('aria-invalid', 'true')
  // Error message
  const errorElement = getByText('Input error message')
  expect(errorElement).toBeInTheDocument()
})

test('renders correctly in disabled state', () => {
  const { getByLabelText } = render(
    <DateInput
      disabled
      errors={{}}
      label="Date input label"
      name="input-name"
      onChange={mockOnChange}
      value={defaultValueState}
    />
  )

  const dayInput = getByLabelText('Day')
  expect(dayInput).toBeDisabled()
  expect(dayInput).toHaveAttribute('aria-disabled', 'true')

  const monthInput = getByLabelText('Month')
  expect(monthInput).toBeDisabled()
  expect(monthInput).toHaveAttribute('aria-disabled', 'true')

  const yearInput = getByLabelText('Year')
  expect(yearInput).toBeDisabled()
  expect(yearInput).toHaveAttribute('aria-disabled', 'true')
})
