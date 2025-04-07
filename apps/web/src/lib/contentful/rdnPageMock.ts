import { BLOCKS } from '@contentful/rich-text-types'
import type { Entry } from 'contentful'

import type { TypePageSkeleton } from '@/@types/generated'

export const rdnPageMock: Entry<TypePageSkeleton> = {
  sys: {
    id: 'test-id-page',
    type: 'Entry',
    createdAt: '0000-00-00T00:00:00.000Z',
    updatedAt: '0000-00-00T00:00:00.000Z',
    locale: 'en-GB',
    contentType: {
      sys: {
        id: 'page',
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
    richText: { nodeType: BLOCKS.DOCUMENT, content: [], data: {} },
  },
  metadata: {
    tags: [],
  },
}
