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
        <div className="govuk-form-group govuk-!-margin-bottom-0">
                        <h1 className="govuk-label-wrapper">
                            <label className="govuk-label govuk-visually-hidden" htmlFor="keyword">
                                Search information across the NIHR
                            </label>
                        </h1>
                        <div className="search-wrapper">
                                <input className="govuk-input govuk-!-margin-bottom-0 nihr-input__search" id="keyword" name="q"
                                 onChange={(event) => {
                      const next = event.target.value
                      setSearchInputText(next)

                      // Reset results when search input is emptied
                      if (filters.q && next.trim() === '') {
                        onChange()
                      }
                    }}
                    type="text"
                    value={searchInputText} />
                                <button className="search-button" type="submit" value="Update results" />
                        </div>
                    </div>


                </div>
              </div>
            </div>
            <div className='govuk-grid-column-one-half flex justify-end'>
              {hasExtraFilters ? (
                  <button
                    aria-controls={extraPanelId}
                    aria-expanded={filtersOpen}
                    className="govuk-button govuk-button--secondary mb-0 h-[50px] whitespace-nowrap"
                    onClick={() => { setFiltersOpen((v) => !v); }}
                    type="button"
                  >
                    {filtersOpen ? 'Hide filters' : 'Show filters'}
                  </button>
                ) : null}
            </div>
          </div>
        </div>

        {hasExtraFilters ? (
          <div
            aria-hidden={!filtersOpen}
            className={clsx('govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-4', !filtersOpen && 'hidden')}
            id={extraPanelId}
          >
            {renderExtraFilters({
              onChange,
              isOpen: filtersOpen,
              close: () => { setFiltersOpen(false); },
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