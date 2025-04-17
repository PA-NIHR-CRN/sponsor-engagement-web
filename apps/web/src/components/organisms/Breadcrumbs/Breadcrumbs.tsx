import { Container } from '@nihr-ui/frontend/index'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export type BreadcrumbConfig = Pick<BreadcrumbsProps, 'indexesToOmit' | 'getLabelOverrides'> & {
  showBreadcrumb: boolean
}

interface BreadcrumbsProps {
  indexesToOmit?: number[]
  getLabelOverrides?: (index: number) => string | undefined
}

interface Breadcrumb {
  text: string
  href: string
}

function Breadcrumbs({ indexesToOmit = [], getLabelOverrides }: BreadcrumbsProps) {
  const router = useRouter()
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([])

  useEffect(() => {
    const pathItems = router.asPath.split('/')
    pathItems.shift()

    const breadCrumbs = pathItems.map((path, index) => {
      return {
        text: path,
        href: `/${pathItems.slice(0, index + 1).join('/')}`,
      }
    })

    setBreadcrumbs(breadCrumbs)
  }, [router.asPath])

  return (
    <div className="ml-8 govuk-!-padding-top-3">
      <Container>
        <nav aria-label="Breadcrumb" className="govuk-breadcrumbs">
          <ol className="govuk-breadcrumbs__list">
            {breadcrumbs.map(({ text, href }, index) => {
              if (indexesToOmit.includes(index)) return

              const label = getLabelOverrides?.(index) ?? text

              return (
                <li className="govuk-breadcrumbs__list-item" key={text.split('').join('-')}>
                  <Link aria-label={`Navigate to ${label}`} className="govuk-breadcrumbs__link" href={href}>
                    {label}
                  </Link>
                </li>
              )
            })}
          </ol>
        </nav>
      </Container>
    </div>
  )
}

export default Breadcrumbs
