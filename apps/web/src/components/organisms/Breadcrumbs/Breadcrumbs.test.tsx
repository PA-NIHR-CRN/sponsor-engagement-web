import mockRouter from 'next-router-mock'

import { render } from '@/config/TestUtils'

import Breadcrumbs from './Breadcrumbs'

describe('Breadcrumbs', () => {
  beforeEach(() => {
    mockRouter.asPath = '/section/page/subpage'
  })

  it(`displays all breadcrumbs when 'indexesToOmit' is not provided`, () => {
    const { getAllByRole } = render(<Breadcrumbs />)

    const breadcrumbItems = getAllByRole('listitem')

    expect(breadcrumbItems).toHaveLength(3)
    expect(breadcrumbItems[0]).toHaveTextContent('section')
    expect(breadcrumbItems[1]).toHaveTextContent('page')
    expect(breadcrumbItems[2]).toHaveTextContent('subpage')
  })

  it(`displays a subset of the breadcrumbs when 'indexesToOmit' is  provided`, () => {
    const { getAllByRole } = render(<Breadcrumbs indexesToOmit={[0, 2]} />)

    const breadcrumbItems = getAllByRole('listitem')

    expect(breadcrumbItems).toHaveLength(1)
    expect(breadcrumbItems[0]).toHaveTextContent('page')
  })

  it(`overrides breadcrumb labels when 'getLabelOverrides' is provided`, () => {
    const { getAllByRole } = render(
      <Breadcrumbs
        getLabelOverrides={(index) => {
          if (index === 1) return 'My page'

          if (index === 2) return 'My subpage'

          return undefined
        }}
      />
    )

    const breadcrumbItems = getAllByRole('listitem')

    expect(breadcrumbItems[1]).toHaveTextContent('My page')
    expect(breadcrumbItems[2]).toHaveTextContent('My subpage')
  })

  it('generates correct hrefs for each breadcrumb', () => {
    const { getAllByRole } = render(<Breadcrumbs />)

    const breadcrumbLinks = getAllByRole('link')

    expect(breadcrumbLinks[0]).toHaveAccessibleName('Navigate to section')
    expect(breadcrumbLinks[0]).toHaveAttribute('href', '/section')

    expect(breadcrumbLinks[1]).toHaveAccessibleName('Navigate to page')
    expect(breadcrumbLinks[1]).toHaveAttribute('href', '/section/page')

    expect(breadcrumbLinks[2]).toHaveAccessibleName('Navigate to subpage')
    expect(breadcrumbLinks[2]).toHaveAttribute('href', '/section/page/subpage')
  })
})
