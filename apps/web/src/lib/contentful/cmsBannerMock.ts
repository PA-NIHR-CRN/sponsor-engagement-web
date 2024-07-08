import { BLOCKS } from '@contentful/rich-text-types'
import type { Entry } from 'contentful'

import type { TypeBannerSkeleton } from '@/@types/generated'

export const cmsBannerMock: Entry<TypeBannerSkeleton> = {
  sys: {
    id: 'test-id',
    type: 'Entry',
    createdAt: '0000-00-00T00:00:00.000Z',
    updatedAt: '0000-00-00T00:00:00.000Z',
    locale: 'en-GB',
    contentType: {
      sys: {
        id: 'banner',
        type: 'Link',
        linkType: 'ContentType',
      },
    },
    revision: 1, // Added missing field
    space: {
      sys: {
        id: 'space-id',
        type: 'Link',
        linkType: 'Space',
      },
    },
    environment: {
      sys: {
        id: 'environment-id',
        type: 'Link',
        linkType: 'Environment',
      },
    },
  },
  fields: {
    bannerTitle: 'Test Title',
    bannerBody: { nodeType: BLOCKS.DOCUMENT, content: [], data: {} },
  },
  metadata: {
    tags: [],
  },
}
