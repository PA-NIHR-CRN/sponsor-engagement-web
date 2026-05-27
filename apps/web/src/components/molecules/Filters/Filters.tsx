import { Button } from '@nihr-ui/frontend'
import SearchIcon from '@nihr-ui/frontend/components/Icons/SearchIcon'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useEffect, useId, useRef, useState } from 'react'

import type { Filters } from '@/@types/filters'
import { Card } from '@/components/atoms'

import type { OnFilterChange } from './useFilters'
import { useFilters } from './useFilters'

export interface FiltersProps {
  filters: Filters
  onFilterChange?: OnFilterChange
  searchLabel: string
  renderExtraFilters?: (args: {
    onChange: () => void
    isOpen: boolean
    close: () => void
  }) => React.ReactNode
}

export function Filters({ filters, onFilterChange, searchLabel, renderExtraFilters }: Readonly<FiltersProps>) {
  const formRef = useRef<HTMLFormElement | null>(null)
  const { onChange, onSubmit } = useFilters(formRef, onFilterChange)
  const [searchInputText, setSearchInputText] = useState(filters.q ?? '')
  const { pathname } = useRouter()

  const [filtersOpen, setFiltersOpen] = useState(false)
  const extraPanelId = useId()

  const hasExtraFilters = typeof renderExtraFilters === 'function'

  useEffect(() => {
    if (!filters.q) setSearchInputText('')
  }, [filters.q])

  return (
    <Card className={clsx('bg-white')} data-testid="filters-card" filled id="filters" padding={0}>
      <h2 className="govuk-visually-hidden" id="filter-by">
        Filter by
      </h2>

      <form
        action={pathname}
        aria-labelledby="filter-by"
        id="filters-form"
        method="get"
        onSubmit={onSubmit}
        ref={formRef}
        role="search"
      >
        {/* Keyword */}
        <div className="govuk-form-group mb-3">
          <label className="govuk-label mb-2" htmlFor="keyword">
            {searchLabel}
          </label>

          <div className="govuk-grid-row">
            <div className="govuk-grid-column-one-half">
              <div className="flex items-start gap-2">
                <div className="table w-full">
                  <input
                    className="govuk-input govuk-input h-[50px] border-2 border-black p-2"
                    id="keyword"
                    name="q"
                    onChange={(event) => {
                      const next = event.target.value
                      setSearchInputText(next)

                      // Reset results when search input is emptied
                      if (filters.q && next.trim() === '') {
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
            <div className='govuk-grid-column-one-half flex justify-end'>
              {hasExtraFilters ? (
                  <button
                    type="button"
                    className="govuk-button govuk-button--secondary mb-0 h-[50px] whitespace-nowrap"
                    aria-expanded={filtersOpen}
                    aria-controls={extraPanelId}
                    onClick={() => setFiltersOpen((v) => !v)}
                  >
                    {filtersOpen ? 'Hide filters' : 'Show filters'}
                  </button>
                ) : null}
            </div>
          </div>
        </div>

        {hasExtraFilters && filtersOpen ? (
          <div id={extraPanelId} className="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-4">
            {renderExtraFilters({
              onChange,
              isOpen: filtersOpen,
              close: () => setFiltersOpen(false),
            })}
          </div>
        ) : null}

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