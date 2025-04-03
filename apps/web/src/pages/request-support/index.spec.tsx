import type { Document } from '@contentful/rich-text-types'
import { BLOCKS } from '@contentful/rich-text-types'

import { render } from '@/config/TestUtils'
import { RichTextRenderer } from '@/utils/Renderers/RichTextRenderer/RichTextRenderer'

import RequestSupport from './index'

jest.mock('@nihr-ui/frontend', () => ({
  Container: jest.fn(({ children }) => <div>{children}</div>),
}))

jest.mock('@/utils/Renderers/RichTextRenderer/RichTextRenderer', () => ({
  RichTextRenderer: jest.fn(({ children }) => <div>{JSON.stringify(children)}</div>),
}))

describe('RequestSupportPage', () => {
  it('renders null if content and footerContent are null', () => {
    const { container } = render(<RequestSupport content={undefined} footerContent={undefined} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders null if if content.richText and footerContent.richText are undefined', () => {
    const { container } = render(
      <RequestSupport content={{ richText: undefined }} footerContent={{ richText: undefined }} />
    )
    expect(container).toBeEmptyDOMElement()
  })

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

  it('renders return link when returnPath is provided', () => {
    const content: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [],
      data: {},
    }

    const footerContent: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [],
      data: {},
    }

    const { getByText } = render(
      <RequestSupport
        content={{ richText: content }}
        footerContent={{ richText: footerContent }}
        returnPath="/previous"
      />
    )

    const link = getByText('Return to previous page')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/previous')
  })
})
