import type { Document } from '@contentful/rich-text-types'
import { BLOCKS } from '@contentful/rich-text-types'
import { NotificationBanner } from '@nihr-ui/frontend'
import type { Entry } from 'contentful'

import type { TypeBannerSkeleton } from '@/@types/generated'
import { render } from '@/config/TestUtils'
import { RichTextRenderer } from '@/utils/Renderers/RichTextRenderer/RichTextRenderer'

import CmsNotificationBanner from './CmsNotificationBanner'

jest.mock('@nihr-ui/frontend', () => ({
  NotificationBanner: jest.fn(({ heading, children }) => (
    <div>
      <h1>{heading}</h1>
      <div>{children}</div>
    </div>
  )),
}))

jest.mock('@/utils/Renderers/RichTextRenderer/RichTextRenderer', () => ({
  RichTextRenderer: jest.fn(({ children }) => <div>{JSON.stringify(children)}</div>),
}))

describe('CmsNotificationBanner', () => {
  it('renders null if entry is null', () => {
    const { container } = render(<CmsNotificationBanner entry={null} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders null if bannerBody is undefined', () => {
    const entry = {
      fields: {
        bannerTitle: 'Test Title',
        bannerBody: undefined,
      },
    } as unknown as Entry<TypeBannerSkeleton>

    const { container } = render(<CmsNotificationBanner entry={entry} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders NotificationBanner with heading and RichTextRenderer', () => {
    const bannerBody: Document = {
      nodeType: BLOCKS.DOCUMENT,
      content: [],
      data: {},
    }

    const entry = {
      fields: {
        bannerTitle: 'Test Title',
        bannerBody,
      },
    } as Entry<TypeBannerSkeleton>

    const { getByText } = render(<CmsNotificationBanner entry={entry} />)
    expect(NotificationBanner).toHaveBeenCalledWith(
      expect.objectContaining({
        heading: 'Test Title',
      }),
      {}
    )
    expect(getByText('Test Title')).toBeInTheDocument()
    expect(RichTextRenderer).toHaveBeenCalledWith(
      expect.objectContaining({
        children: bannerBody,
      }),
      {}
    )
  })
})
