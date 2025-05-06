import mockRouter from 'next-router-mock'

import { render } from '@/config/TestUtils'

import Breadcrumbs from './Breadcrumbs'

describe('Breadcrumbs', () => {
  beforeEach(() => {
    mockRouter.pathname = '/studies/[studyId]/edit'
    mockRouter.query = { studyId: '121' }
  })

  it('does not display breadcrumb, when "showBreadcrumb" is false', () => {
    const { queryByRole } = render(<Breadcrumbs />)
    expect(queryByRole('navigation')).toBeNull()
  })

  it('displays the correct breadcrumbs (excluding the current page)', () => {
    const { getAllByRole } = render(<Breadcrumbs showBreadcrumb />)

    const breadcrumbItems = getAllByRole('listitem')

    expect(breadcrumbItems).toHaveLength(2)
    expect(breadcrumbItems[0]).toHaveTextContent('All studies')
    expect(breadcrumbItems[1]).toHaveTextContent('Study details')
  })

  it('generates correct hrefs for each breadcrumb', () => {
    const { getAllByRole } = render(<Breadcrumbs showBreadcrumb />)

    const breadcrumbLinks = getAllByRole('link')

    expect(breadcrumbLinks[0]).toHaveAccessibleName('Navigate to All studies page')
    expect(breadcrumbLinks[0]).toHaveAttribute('href', '/studies')

    expect(breadcrumbLinks[1]).toHaveAccessibleName('Navigate to Study details page')
    expect(breadcrumbLinks[1]).toHaveAttribute('href', '/studies/121')
  })
})
