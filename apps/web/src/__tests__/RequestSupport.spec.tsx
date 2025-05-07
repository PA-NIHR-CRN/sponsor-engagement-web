import type { Document } from '@contentful/rich-text-types'
import { BLOCKS } from '@contentful/rich-text-types'
import { screen } from '@testing-library/react'
import type { GetServerSidePropsContext } from 'next'

import { render } from '@/config/TestUtils'
import RequestSupport, { getServerSideProps } from '@/pages/request-support/index'
import { RichTextRenderer } from '@/utils/Renderers/RichTextRenderer/RichTextRenderer'

jest.mock('@nihr-ui/frontend', () => ({
  Container: jest.fn(({ children }) => <div>{children}</div>),
}))

jest.mock('@/utils/Renderers/RichTextRenderer/RichTextRenderer', () => ({
  RichTextRenderer: jest.fn(({ children }) => <div>{JSON.stringify(children)}</div>),
}))

jest.mock('@/lib/contentful/contentfulService', () => ({
  getPage: jest.fn(),
  getBporFooter: jest.fn(),
}))

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}))

describe('RequestSupportPage', () => {
  it('renders RichTextRenderer for content and footerContent', () => {
    const richTextContent: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [],
      data: {},
    }

    const { getAllByText } = render(
      <RequestSupport content={{ richText: richTextContent }} footerContent={{ richText: richTextContent }} />
    )
    const elements = getAllByText(JSON.stringify(richTextContent))
    expect(elements).toHaveLength(2)
    expect(RichTextRenderer).toHaveBeenCalledWith(expect.objectContaining({ children: richTextContent }), {})
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

describe('getServerSideProps', () => {
  it('redirects to /500 if content and footerContent are missing', async () => {
    const context = {
      query: {},
    } as unknown as GetServerSidePropsContext

    const result = await getServerSideProps(context)

    expect(result).toEqual({
      redirect: {
        destination: '/500',
      },
    })
  })
})
