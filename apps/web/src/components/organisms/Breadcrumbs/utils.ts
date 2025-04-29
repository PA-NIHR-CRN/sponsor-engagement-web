import type { ParsedUrlQuery } from 'node:querystring'

import { breadcrumbsConfig } from '@/config/breadcrumbConfig'

import type { Breadcrumb } from './Breadcrumbs'

const getBreadcrumbLabel = (path: string) => breadcrumbsConfig[path]

const constructHref = (pathItems: string[], query: ParsedUrlQuery) =>
  `/${pathItems
    .map((segment) => {
      if (segment.startsWith('[') && segment.endsWith(']')) {
        const key = segment.slice(1, -1)

        return query[key] ?? segment
      }

      return segment
    })
    .join('/')}`

export const getBreadcrumbItems = (pathname: string, query: ParsedUrlQuery) => {
  const breadcrumbs: Breadcrumb[] = []

  const pathItems = pathname.split('/')
  pathItems.shift()

  pathItems.forEach((_, index) => {
    const partialPathSegments = pathItems.slice(0, index + 1)
    const partialPathURL = partialPathSegments.join('/')

    const href = constructHref(partialPathSegments, query)
    const label = getBreadcrumbLabel(partialPathURL)

    if (label && `/${partialPathURL}` !== pathname) {
      breadcrumbs.push({ label, href })
    }
  })

  return breadcrumbs
}
