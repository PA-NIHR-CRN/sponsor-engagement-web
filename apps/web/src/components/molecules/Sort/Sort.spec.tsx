import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import type { FormEvent } from 'react'
import React from 'react'
import { Sort } from './Sort'

test('Sorting', async () => {
  const onSubmitSpy = jest.fn().mockImplementation((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  })

  render(
    <form id="test-form" onSubmit={onSubmitSpy}>
      <Sort defaultOrder="updated" form="test-form" />
    </form>
  )

  const select = screen.getByRole('combobox', { name: 'Sort by' })
  const options = screen.getAllByRole('option')

  expect(options.map((option) => option.textContent)).toEqual([
    'Alphabetical (ascending)',
    'Alphabetical (descending)',
    'Recently updated',
    'Recently published',
  ])

  // Default sort order is set
  expect((options[2] as HTMLOptionElement).selected).toBe(true)

  // Change sort order via selecting an option
  await userEvent.selectOptions(select, 'Alphabetical (descending)')
  expect((options[1] as HTMLOptionElement).selected).toBe(true)
  expect(onSubmitSpy).toHaveBeenCalled()

  // Change sort order via submit button
  jest.clearAllMocks()
  const button = screen.getByRole('button', { name: 'Submit' })
  await userEvent.click(button)
  expect(onSubmitSpy).toHaveBeenCalled()
})
