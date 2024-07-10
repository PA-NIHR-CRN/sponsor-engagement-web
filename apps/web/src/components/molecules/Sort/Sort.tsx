import { useRef } from 'react'

import type { OrderType } from '../../../@types/filters'

interface SortProps {
  form: string
  defaultOrder?: OrderType
}

export function Sort({ form, defaultOrder }: SortProps) {
  const sortButtonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <label className="govuk-label mb-1 mr-2 md:mb-0" htmlFor="order">
        Sort by
      </label>
      <select
        className="govuk-select w-full md:w-auto"
        defaultValue={defaultOrder}
        form={form}
        id="order"
        name="order"
        onChange={() => sortButtonRef.current?.click()}
      >
        <option value="due-assessment">Due assessment</option>
        <option value="last-assessment-asc">Last Assessment Date (Ascending)</option>
        <option value="last-assessment-desc">Last Assessment Date (Descending)</option>
      </select>
      <button
        className="govuk-button govuk-button--secondary mb-0 ml-3 [.js-enabled_&]:hidden"
        form={form}
        ref={sortButtonRef}
        type="submit"
      >
        Submit
      </button>
    </>
  )
}
