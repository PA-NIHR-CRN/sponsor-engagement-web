import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { usePagination } from 'react-use-pagination'

type PaginationProps = {
  initialPage: number
  initialPageSize: number
  totalItems: number
}

export default function Pagination({ initialPage, initialPageSize, totalItems }: PaginationProps) {
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
      return setPage(Number(router.query.page) - 1)
    }
    return setPage(0)
  }, [router.query.page, setPage])

  /* Skip rendering if there's no content to show */
  if (totalItems === 0) return null

  return (
    <nav className="govuk-pagination" role="navigation" aria-label="results">
      {previousEnabled && (
        <div className="govuk-pagination__prev">
          <Link
            className="govuk-link govuk-pagination__link"
            href={{
              pathname: router.pathname,
              query: { ...router.query, page: currentPage },
            }}
            rel="prev"
            onClick={setPreviousPage}
          >
            <svg
              className="govuk-pagination__icon govuk-pagination__icon--prev"
              xmlns="http://www.w3.org/2000/svg"
              height="13"
              width="15"
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 15 13"
            >
              <path d="m6.5938-0.0078125-6.7266 6.7266 6.7441 6.4062 1.377-1.449-4.1856-3.9768h12.896v-2h-12.984l4.2931-4.293-1.414-1.414z"></path>
            </svg>
            <span className="govuk-pagination__link-title">Previous</span>
          </Link>
        </div>
      )}

      <ul className="govuk-pagination__list">
        {Array(totalPages)
          .fill(null)
          .map((_, index) => {
            const page = index + 1
            const active = index === currentPage
            return (
              <li
                key={index}
                className={clsx('govuk-pagination__item', {
                  'govuk-pagination__item--current bg-navy-100': active,
                })}
              >
                <Link
                  className="govuk-link govuk-pagination__link"
                  href={{
                    pathname: router.pathname,
                    query: { ...router.query, page },
                  }}
                  aria-label={`Page ${page}`}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setPage(index)}
                >
                  {page}
                </Link>
              </li>
            )
          })}
      </ul>

      {nextEnabled && (
        <div className="govuk-pagination__next">
          <Link
            className="govuk-link govuk-pagination__link"
            href={{
              pathname: router.pathname,
              query: { ...router.query, page: currentPage + 2 },
            }}
            rel="next"
            onClick={setNextPage}
          >
            <span className="govuk-pagination__link-title">Next</span>{' '}
            <svg
              className="govuk-pagination__icon govuk-pagination__icon--next"
              xmlns="http://www.w3.org/2000/svg"
              height="13"
              width="15"
              aria-hidden="true"
              focusable="false"
              viewBox="0 0 15 13"
            >
              <path d="m8.107-0.0078125-1.4136 1.414 4.2926 4.293h-12.986v2h12.896l-4.1855 3.9766 1.377 1.4492 6.7441-6.4062-6.7246-6.7266z"></path>
            </svg>
          </Link>
        </div>
      )}
    </nav>
  )
}
