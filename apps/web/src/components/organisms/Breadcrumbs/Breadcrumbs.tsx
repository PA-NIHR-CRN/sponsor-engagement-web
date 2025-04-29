import { Container } from '@nihr-ui/frontend/index'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { getBreadcrumbItems } from './utils'

export type BreadcrumbConfig = Pick<BreadcrumbsProps, 'showBreadcrumb'>

interface BreadcrumbsProps {
  showBreadcrumb?: boolean
}

export interface Breadcrumb {
  label: string
  href: string
}

function Breadcrumbs({ showBreadcrumb }: BreadcrumbsProps) {
  const router = useRouter()
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([])

  useEffect(() => {
    const currentPagePath = router.asPath
    const pathItems = currentPagePath.split('/')
    pathItems.shift()

    const breadcrumbItems = getBreadcrumbItems(pathItems, currentPagePath)

    setBreadcrumbs(breadcrumbItems)
  }, [router.asPath])

  return showBreadcrumb ? (
    <div className="ml-8 govuk-!-padding-top-3">
      <Container>
        <nav aria-label="Breadcrumb" className="govuk-breadcrumbs">
          <ol className="govuk-breadcrumbs__list">
            {breadcrumbs.map(({ label, href }) => {
              return (
                <li className="govuk-breadcrumbs__list-item" key={label.split('').join('-')}>
                  <Link aria-label={`Navigate to ${label} page`} className="govuk-breadcrumbs__link" href={href}>
                    {label}
                  </Link>
                </li>
              )
            })}
          </ol>
        </nav>
      </Container>
    </div>
  ) : null
}

export default Breadcrumbs
