import React from 'react'

import { render } from '@/config/test-utils'

import { Fieldset } from './Fieldset'

test('Renders with legend correctly', () => {
  const legendText = 'Fieldset Legend'
  const { getByText } = render(
    <Fieldset legend={legendText}>
      <div>Fieldset Content</div>
    </Fieldset>
  )

  const legendElement = getByText(legendText)
  expect(legendElement).toBeInTheDocument()

  const fieldsetContent = getByText('Fieldset Content')
  expect(fieldsetContent).toBeInTheDocument()
})

test('Renders without legend correctly', () => {
  const { queryByTestId, getByText } = render(
    <Fieldset>
      <div>Fieldset Content</div>
    </Fieldset>
  )

  const legendElement = queryByTestId('fieldset-legend')
  expect(legendElement).not.toBeInTheDocument()

  const fieldsetContent = getByText('Fieldset Content')
  expect(fieldsetContent).toBeInTheDocument()
})
