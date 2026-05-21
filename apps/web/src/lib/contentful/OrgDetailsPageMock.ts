import { BLOCKS } from '@contentful/rich-text-types'
import type { Entry } from 'contentful'

import type { TypeSetLabelSkeleton } from '@/@types/generated'

export const OrgDetailsPageMock: Entry<TypeSetLabelSkeleton> = {
  metadata: {
    tags: [
      {
        sys: {
          type: 'Link',
          linkType: 'Tag',
          id: 'sponsorEngagement',
        },
      },
    ],
    concepts: [],
  },
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: 'space-id',
      },
    },
    id: 'org-details-id',
    type: 'Entry',
    createdAt: '2026-04-22T10:17:31.605Z',
    updatedAt: '2026-04-23T11:23:15.793Z',
    environment: {
      sys: {
        id: 'uat',
        type: 'Link',
        linkType: 'Environment',
      },
    },
    revision: 3,
    contentType: {
      sys: {
        type: 'Link',
        linkType: 'ContentType',
        id: 'setLabel',
      },
    },
    locale: 'en-GB',
  },
  fields: {
    key: 'set-organisation-details-manage-ponsor-contact-instructions-section',
    content: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value:
                'Invite new sponsor contacts to this organisation, allowing them to view all studies for this organisation and provide assessments. If the user has not accessed the tool previously, they will be asked to set up an NIHR Identity Gateway account so they can access this service.',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
  },
}
