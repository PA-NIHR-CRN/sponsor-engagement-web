import type { FieldErrors } from 'react-hook-form'

import { render } from '@/config/TestUtils'

import { Radio } from '../Radio/Radio'
import { RadioGroup } from './RadioGroup'

test('Renders correctly without errors or hint', () => {
  const label = 'Radio Group Label'
  const name = 'radioGroup'
  const errors: FieldErrors = {}
  const defaultValue = 'option2'

  const { getByLabelText, getByRole } = render(
    <RadioGroup defaultValue={defaultValue} errors={errors} label={label} name={name}>
      <Radio label="option1" value="option1" />
      <Radio label="option2" value="option2" />
      <Radio label="option3" value="option3" />
    </RadioGroup>
  )

  const labelElement = getByRole('radiogroup', { name: label })
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
    <RadioGroup defaultValue={defaultValue} errors={errors} hint={hint} label={label} name={name}>
      <Radio label="option1" value="option1" />
      <Radio label="option2" value="option2" />
      <Radio label="option3" value="option3" />
    </RadioGroup>
  )

  const labelElement = getByRole('radiogroup', { name: label })
  expect(labelElement).toBeInTheDocument()
  expect(labelElement).toHaveAccessibleErrorMessage('Error: Radio group error message')

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

test('Renders correctly in disabled state', () => {
  const label = 'Radio Group Label'
  const name = 'radioGroup'
  const hint = 'Radio group hint'
  const defaultValue = 'option1'

  const { getByLabelText, getByRole } = render(
    <RadioGroup defaultValue={defaultValue} disabled errors={{} as FieldErrors} hint={hint} label={label} name={name}>
      <Radio label="option1" value="option1" />
    </RadioGroup>
  )

  const radioElement = getByLabelText('option1') as HTMLInputElement
  expect(radioElement).toBeInTheDocument()
  expect(radioElement).toHaveAttribute('aria-disabled', 'true')
  expect(radioElement).toBeDisabled()

  const fieldSetElement = getByRole('radiogroup', { name: label })
  expect(fieldSetElement).toBeInTheDocument()
  expect(fieldSetElement).toHaveAttribute('aria-disabled', 'true')
})
