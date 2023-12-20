import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { usePagination } from 'react-use-pagination'

import { generateTruncatedPagination } from '@/utils/pagination'

interface PaginationProps {
  initialPage: number
  initialPageSize: number
  totalItems: number
  className?: string
}

export function Pagination({ initialPage, initialPageSize, totalItems, className }: PaginationProps) {
  const { currentPage, totalPages, setNextPage, setPreviousPage, setPage, nextEnabled, previousEnabled } =
    usePagination({
      initialPage,
      initialPageSize,
      totalItems,
    })

  const router = useRouter()

  /* Ensure client-side state is kept in sync with the URL */
  useEffect(() => {
    if (router.query.page) {
      setPage(Number(router.query.page) - 1) // Subtract 1 for zero array indexing
      return
    }
    setPage(0)
  }, [router.query.page, setPage])

  /* Skip rendering if there's only one page */
  if (totalItems <= initialPageSize) return null

  const pages = generateTruncatedPagination(totalPages, currentPage + 1)

  return (
    <nav aria-label="results" className={clsx('govuk-pagination', className)} role="navigation">
      {previousEnabled ? (
        <div className="govuk-pagination__prev">
          <Link
            className="govuk-link govuk-pagination__link govuk-link--no-visited-state"
            href={{
              pathname: router.pathname,
              query: { ...router.query, page: currentPage },
            }}
            onClick={setPreviousPage}
            rel="prev"
          >
            <svg
              aria-hidden="true"
              className="govuk-pagination__icon govuk-pagination__icon--prev"
              focusable="false"
              height="13"
              viewBox="0 0 15 13"
              width="15"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z" />
            </svg>
            <span className="govuk-pagination__link-title">Previous</span>
          </Link>
        </div>
      ) : null}
      <ul className="govuk-pagination__list">
        {pages.map((page, index) => {
          const active = Number(page) - 1 === currentPage
          return (
            <li
              className={clsx('govuk-pagination__item', {
                'govuk-pagination__item--current': active,
                'govuk-pagination__item--ellipses': page === '...',
              })}
              // eslint-disable-next-line react/no-array-index-key -- no unique key available
              key={index}
            >
              {page === '...' ? (
                '⋯'
              ) : (
                <Link
                  aria-current={active ? 'page' : undefined}
                  aria-label={`Page ${page}`}
                  className="govuk-link govuk-pagination__link govuk-link--no-visited-state"
                  href={{
                    pathname: router.pathname,
                    query: { ...router.query, page },
                  }}
                  onClick={() => {
                    setPage(Number(page) - 1)
                  }}
                >
                  {page}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
      {nextEnabled ? (
        <div className="govuk-pagination__next">
          <Link
            className="govuk-link govuk-pagination__link govuk-link--no-visited-state"
            href={{
              pathname: router.pathname,
              query: { ...router.query, page: currentPage + 2 },
            }}
            onClick={setNextPage}
            rel="next"
          >
            <span className="govuk-pagination__link-title">Next</span>{' '}
            <svg
              aria-hidden="true"
              className="govuk-pagination__icon govuk-pagination__icon--next"
              focusable="false"
              height="13"
              viewBox="0 0 15 13"
              width="15"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z" />
            </svg>
          </Link>
        </div>
      ) : null}
    </nav>
  )
}
