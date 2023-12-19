import userEvent from '@testing-library/user-event'
import type { FormEvent } from 'react'
import React from 'react'

import { render, screen } from '@/config/TestUtils'

import { Sort } from './Sort'

test('Sorting', async () => {
  const onSubmitSpy = jest.fn().mockImplementation((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  })

  render(
    <form id="test-form" onSubmit={onSubmitSpy}>
      <Sort defaultOrder="due-assessment" form="test-form" />
    </form>
  )

  const select = screen.getByRole('combobox', { name: 'Sort by' })
  const options = screen.getAllByRole('option')

  expect(options.map((option) => option.textContent)).toEqual([
    'Due assessment',
    'Last Assessment Date (Ascending)',
    'Last Assessment Date (Descending)',
  ])

  // Default sort order is set
  expect((options[0] as HTMLOptionElement).selected).toBe(true)

  // Change sort order via selecting an option
  await userEvent.selectOptions(select, 'Last Assessment Date (Ascending)')
  expect((options[1] as HTMLOptionElement).selected).toBe(true)
  expect(onSubmitSpy).toHaveBeenCalled()

  // Change sort order via submit button
  jest.clearAllMocks()
  const button = screen.getByRole('button', { name: 'Submit' })
  await userEvent.click(button)
  expect(onSubmitSpy).toHaveBeenCalled()
})
