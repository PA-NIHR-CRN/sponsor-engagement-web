import type { Breadcrumb } from './Breadcrumbs'
import { breadcrumbsConfig } from './config'

const getBreadcrumbLabel = (href: string) => {
  for (const key in breadcrumbsConfig) {
    const keyWithRegex = key.replace(/\[[^/]+\]/g, '([^/]+)')
    const regex = new RegExp(`^${keyWithRegex}$`)

    if (href.slice(1).match(regex)) {
      return breadcrumbsConfig[key]
    }
  }
}

export const getBreadcrumbItems = (pathItems: string[], currentPath: string) => {
  const breadcrumbs: Breadcrumb[] = []

  pathItems.forEach((_, index) => {
    const href = `/${pathItems.slice(0, index + 1).join('/')}`
    const label = getBreadcrumbLabel(href)

    if (label && href !== currentPath) {
      breadcrumbs.push({ label, href })
    }
  })

  return breadcrumbs
}
