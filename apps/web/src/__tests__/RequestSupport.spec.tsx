import { NextSeo } from 'next-seo'
import { render, screen } from '../config/TestUtils'
import RequestSupport from '../pages/request-support'

jest.mock('next-seo')

describe('RequestSupport Component', () => {
  it('renders page title and heading correctly', () => {
    render(<RequestSupport />)
    expect(NextSeo).toHaveBeenCalledWith({ title: `Request NIHR CRN support` }, {})
    expect(screen.getByRole('heading', { name: /Request NIHR CRN support/i })).toBeInTheDocument()
  })

  it('renders link to local CRN', () => {
    render(<RequestSupport />)
    const link = screen.getByRole('link', { name: /your local CRN/i })
    expect(link).toHaveAttribute('href', 'https://www.nihr.ac.uk/documents/study-support-service-contacts/11921')
  })

  it('renders list items correctly', () => {
    render(<RequestSupport />)

    const listItems = [
      'Supporting study-wide planning activities (e.g. identification of potential sites), support with costing tool (e.g. SoECAT and ICT), etc.',
      'Research delivery advice (e.g. recruitment strategies, regional care pathways and NHS support services, investigators, capabilities, etc.)',
      'Discuss site issues, including study delivery',
      'Advice regarding engagement with local communities',
      'Clinical advice (e.g. assessment of study deliverability in the UK, recommendations of recruitment methods and pathways, study design considerations)',
      'Support to overcome barriers, challenges or other types of requests',
    ]

    expect(screen.getAllByRole('listitem').map((listItem) => listItem.textContent)).toEqual(listItems)
  })

  it('renders link to previous page', () => {
    render(<RequestSupport returnPath="/study/123" />)
    const link = screen.getByRole('link', { name: /Return to previous page/i })
    expect(link).toHaveAttribute('href', '/study/123')
  })

  it('does not render link to previous page if no referer', () => {
    render(<RequestSupport />)
    expect(screen.queryByRole('link', { name: /Return to previous page/i })).not.toBeInTheDocument()
  })
})
