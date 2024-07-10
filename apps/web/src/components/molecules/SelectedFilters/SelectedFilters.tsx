import type { ParsedUrlQuery } from 'node:querystring'

import { CrossIcon } from '@nihr-ui/frontend'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'

import type { FilterKey, Filters, FilterValue } from '@/@types/filters'
import { SELECTABLE_FILTERS } from '@/constants'

export interface SelectedFiltersProps {
  filters: Filters
  isLoading?: boolean
}

const anyFiltersActive = (filters: Filters) =>
  SELECTABLE_FILTERS.map((filterName) => filters[filterName])
    .flat()
    .filter(Boolean).length

const omitFilter = (name: string, query: ParsedUrlQuery, value?: string) => {
  const filters = { ...query }
  if (Array.isArray(filters[name])) {
    filters[name] = (filters[name] as string[]).filter((v) => v !== value)
  } else {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete -- valid
    delete filters[name]
  }
  return filters
}

function SelectedFilter({ children, name, value }: { name: string; value?: string; children: ReactNode }) {
  const { query, pathname } = useRouter()

  return (
    <li>
      <Link
        className="govuk-button govuk-button--secondary text-sm focus:focusable group mb-0 inline-flex items-center border py-[7px] px-2 text-black no-underline focus:focus:outline-none group-[.isLoading]/selected:pointer-events-none group-[.isLoading]/selected:opacity-50"
        href={{ pathname, query: omitFilter(name, query, value) }}
        scroll={false}
      >
        <span className="govuk-visually-hidden">Clear filter:&nbsp;</span>
        {children}
        <CrossIcon className="ml-1 inline group-[:not(.isLoading)]/selected:group-hover:text-black" />
      </Link>
    </li>
  )
}

const renderSelectedFilters = (name: FilterKey, value: FilterValue, index: number) => {
  if (!value) return

  if (Array.isArray(value)) {
    return value.map((subValue) => (
      <SelectedFilter key={name} name={name} value={subValue as string}>
        {subValue}
      </SelectedFilter>
    ))
  }

  return (
    <SelectedFilter key={`${name}-${index}`} name={name}>
      {value}
    </SelectedFilter>
  )
}

export function SelectedFilters({ filters, isLoading }: SelectedFiltersProps) {
  const { pathname } = useRouter()

  if (!anyFiltersActive(filters)) return null

  return (
    <div
      className={clsx(
        { isLoading },
        'govuk-!-margin-top-4 govuk-!-margin-bottom-4 govuk-body-m group/selected',
        'relative flex min-h-[60px] flex-wrap items-center md:flex-nowrap',
        // Bottom border
        'after:absolute after:bottom-[-6px] after:left-0 after:block after:h-[1px] after:w-full after:bg-[var(--colour-grey-120)] after:content-[""]'
      )}
    >
      <strong className="whitespace-nowrap" id="selected-filters">
        Selected filters
      </strong>
      <ul
        aria-labelledby="selected-filters"
        className="order-3 ml-0 mt-2 flex w-full flex-wrap gap-1 md:order-2 md:ml-4 md:mt-0 md:w-auto"
      >
        {Object.keys(filters)
          .filter((filter) => SELECTABLE_FILTERS.includes(filter as keyof Filters))
          .map((filter, i) => renderSelectedFilters(filter as keyof Filters, filters[filter as keyof Filters], i))}
      </ul>
      <div className="order-2 ml-auto whitespace-nowrap pl-1 md:order-3">
        <Link className="govuk-link--no-visited-state govuk-body-s mb-0" href={pathname} scroll={false}>
          Clear all filters
        </Link>
      </div>
    </div>
  )
}
