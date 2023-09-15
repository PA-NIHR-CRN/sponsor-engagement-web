import { render } from '@testing-library/react'
import { FieldErrors } from 'react-hook-form'

import { Radio } from '../Radio/Radio'
import { RadioGroup } from './RadioGroup'

test('Renders correctly without errors or hint', () => {
  const label = 'Radio Group Label'
  const name = 'radioGroup'
  const errors: FieldErrors = {}
  const defaultValue = 'option2'

  const { getByLabelText, getByRole } = render(
    <RadioGroup label={label} name={name} errors={errors} defaultValue={defaultValue}>
      <Radio value="option1" label="option1" />
      <Radio value="option2" label="option2" />
      <Radio value="option3" label="option3" />
    </RadioGroup>
  )

  const labelElement = getByRole('group', { name: label })
  expect(labelElement).toBeInTheDocument()

  const radioElement = getByLabelText('option2') as HTMLInputElement
  expect(radioElement).toBeInTheDocument()
  expect(radioElement).toHaveAttribute('type', 'radio')
  expect(radioElement).toHaveAttribute('value', 'option2')
  expect(radioElement).toHaveAttribute('name', name)
  expect(radioElement).toHaveAttribute('id', 'radioGroup-1')
  expect(radioElement).toHaveAttribute('aria-invalid', 'false')
  expect(radioElement).toBeChecked()
})

test('Renders correctly with errors and hint', () => {
  const label = 'Radio Group Label'
  const name = 'radioGroup'
  const errors: FieldErrors = {
    radioGroup: {
      message: 'Radio group error message',
      type: 'required',
    },
  }
  const hint = 'Radio group hint'
  const defaultValue = 'option3'

  const { getByLabelText, getByText, getByRole } = render(
    <RadioGroup label={label} name={name} errors={errors} hint={hint} defaultValue={defaultValue}>
      <Radio value="option1" label="option1" />
      <Radio value="option2" label="option2" />
      <Radio value="option3" label="option3" />
    </RadioGroup>
  )

  const labelElement = getByRole('group', { name: label })
  expect(labelElement).toBeInTheDocument()

  const radioElement = getByLabelText('option3') as HTMLInputElement
  expect(radioElement).toBeInTheDocument()
  expect(radioElement).toHaveAttribute('type', 'radio')
  expect(radioElement).toHaveAttribute('value', 'option3')
  expect(radioElement).toHaveAttribute('name', name)
  expect(radioElement).toHaveAttribute('id', 'radioGroup-2')
  expect(radioElement).toHaveAttribute('aria-invalid', 'true')
  expect(radioElement).toBeChecked()

  const errorElement = getByText('Radio group error message')
  expect(errorElement).toBeInTheDocument()

  const hintElement = getByText(hint)
  expect(hintElement).toBeInTheDocument()
})
