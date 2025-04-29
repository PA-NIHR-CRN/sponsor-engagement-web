import { getBreadcrumbItems } from './utils'

describe('getBreadcrumbItems', () => {
  it('should return correct breadcrumb items for path with dynamic segments', () => {
    const pathItems = ['studies', '789', 'assess']
    const currentPath = '/studies/789/assess'

    const result = getBreadcrumbItems(pathItems, currentPath)

    expect(result).toEqual([
      { label: 'All studies', href: '/studies' },
      { label: 'Study details', href: '/studies/789' },
    ])
  })

  it('should exclude "currentPath" from breadcrumb items', () => {
    const pathItems = ['studies']
    const currentPath = '/studies'

    const result = getBreadcrumbItems(pathItems, currentPath)

    expect(result).toEqual([])
  })

  it('should return an empty array if no matches found', () => {
    const pathItems = ['unknown', 'path']
    const currentPath = '/unknown/path'

    const result = getBreadcrumbItems(pathItems, currentPath)

    expect(result).toEqual([])
  })
})
