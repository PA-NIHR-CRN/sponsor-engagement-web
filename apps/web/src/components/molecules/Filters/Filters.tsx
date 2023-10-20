import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import SearchIcon from '@nihr-ui/frontend/components/Icons/SearchIcon'
import { Button } from '@nihr-ui/frontend'
import { Card } from '../../atoms'
import type { Filters } from '../../../@types/filters'
import { STUDIES_PAGE } from '../../../constants/routes'
import type { OnFilterChange } from './useFilters'
import { useFilters } from './useFilters'

export interface FiltersProps {
  filters: Filters
  onFilterChange?: OnFilterChange
}

export function Filters({ filters, onFilterChange }: FiltersProps) {
  const formRef = useRef(null)
  const { onChange, onSubmit } = useFilters(formRef, onFilterChange)
  const [searchInputText, setSearchInputText] = useState(filters.q ?? '')

  useEffect(() => {
    if (!filters.q) setSearchInputText('')
  }, [filters.q])

  return (
    <Card className={clsx('bg-white')} data-testid="filters-card" filled id="filters" padding={0}>
      <h2 className="govuk-visually-hidden" id="filter-by">
        Filter by
      </h2>
      <form
        action={STUDIES_PAGE}
        aria-labelledby="filter-by"
        className=""
        id="filters-form"
        method="get"
        onSubmit={onSubmit}
        ref={formRef}
        role="search"
      >
        {/* Keyword */}
        <div className="govuk-form-group mb-3">
          <label className="govuk-label mb-2" htmlFor="keyword">
            Search study title, protocol number or IRAS ID
          </label>
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-one-half-from-desktop">
              <div className="table w-full">
                <input
                  className="govuk-input govuk-input h-[50px] border-2 border-black p-2"
                  id="keyword"
                  name="q"
                  onChange={(event) => {
                    setSearchInputText(event.target.value)
                    // Reset results when search input is emptied
                    if (filters.q && event.target.value.trim() === '') {
                      onChange()
                    }
                  }}
                  type="text"
                  value={searchInputText}
                />
                <div className="table-cell w-[1%] align-top">
                  <button
                    className="bg-[var(--colour-blue)] text-white active:top-0 focus:shadow-[inset_0_0_0_4px_var(--text-grey)] focus:outline focus:outline-[3px] focus:outline-[var(--focus)] mb-0 w-[50px] h-[50px] flex items-center justify-center text-lg"
                    type="submit"
                  >
                    <span className="govuk-visually-hidden">Search</span>
                    <SearchIcon />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Non-Js filters submission button */}
        <div className="js:hidden border-t border-grey-120 text-center">
          <Button className="w-full" secondary type="submit">
            Apply filters
          </Button>
        </div>
      </form>
    </Card>
  )
}
