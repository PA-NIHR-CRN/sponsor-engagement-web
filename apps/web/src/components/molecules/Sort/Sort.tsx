import { useRef } from 'react'

interface SortProps {
  form: string
  defaultOrder?: 'updated'
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
        <option value="a-z">Alphabetical (ascending)</option>
        <option value="z-a">Alphabetical (descending)</option>
        <option value="updated">Recently updated</option>
        <option value="published">Recently published</option>
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
