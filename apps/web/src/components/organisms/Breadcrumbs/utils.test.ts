import { getBreadcrumbItems } from './utils'

describe('getBreadcrumbItems', () => {
  it('should return correct breadcrumb items for path with dynamic segments', () => {
    const pathname = '/studies/[studyId]/assess'

    const result = getBreadcrumbItems(pathname, { studyId: '789', id: '232' })

    expect(result).toEqual([
      { label: 'All studies', href: '/studies' },
      { label: 'Study details', href: '/studies/789' },
    ])
  })

  it('should exclude "currentPath" from breadcrumb items', () => {
    const pathname = '/studies'

    const result = getBreadcrumbItems(pathname, {})

    expect(result).toEqual([])
  })

  it('should return an empty array if no matches found', () => {
    const pathname = '/unknown/path'

    const result = getBreadcrumbItems(pathname, {})

    expect(result).toEqual([])
  })
})
