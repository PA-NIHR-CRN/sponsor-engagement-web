import { BLOCKS } from '@contentful/rich-text-types'
import type { Entry } from 'contentful'

import type { TypeGenericRichTextLinksOnlySkeleton, TypeGenericRichTextSkeleton, TypeGenericTextSkeleton, TypeSetPageSkeleton } from '@/@types/generated'



const pageContentmock: (Entry<TypeGenericRichTextLinksOnlySkeleton | TypeGenericRichTextSkeleton | TypeGenericTextSkeleton>)[] | undefined = 
[
      {
        metadata: {
          tags: [
            {
              sys: {
                type: "Link",
                linkType: "Tag",
                id: "sponsorEngagement",
              },
            },
          ],
          concepts: [
          ],
        },
        sys: {
          space: {
            sys: {
              type: "Link",
              linkType: "Space",
              id: "r6iretd2k4co",
            },
          },
          id: "3MTwZ0jQloWJauXa9pBD8J",
          type: "Entry",
          createdAt: "2026-06-24T15:37:55.486Z",
          updatedAt: "2026-06-24T15:37:55.486Z",
          environment: {
            sys: {
              id: "uat",
              type: "Link",
              linkType: "Environment",
            },
          },
          revision: 1,
          contentType: {
            sys: {
              type: "Link",
              linkType: "ContentType",
              id: "genericText",
            },
          },
          locale: "en-GB",
        },
        fields: {
          contentTitle: "set-studies-list-report-a-first-button",
          text: "Report a First",
        },
      },
]


export const reportAFirstBoxMock: Entry<TypeSetPageSkeleton> = 
{
  metadata: {
    tags: [
      {
        sys: {
          type: "Link",
          linkType: "Tag",
          id: "sponsorEngagement",
        },
      },
    ],
    concepts: [
    ],
  },
  sys: {
    space: {
      sys: {
        type: "Link",
        linkType: "Space",
        id: "r6iretd2k4co",
      },
    },
    id: "4alXVJX42mf7sEzesNbaw8",
    type: "Entry",
    createdAt: "2026-06-24T15:38:39.202Z",
    updatedAt: "2026-06-24T15:38:39.202Z",
    environment: {
      sys: {
        id: "uat",
        type: "Link",
        linkType: "Environment",
      },
    },
    revision: 1,
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "setPage",
      },
    },
    locale: "en-GB",
  },
  fields: {
    entryTitle: "SET, Report a first Box",
    title: "First Global/ European Participant",
    guidanceText: {
      data: {},
      content: [
        {
          data: {
          },
          content: [
            {
              data: {
              },
              marks: [
              ],
              value: "Report where the UK has achieved the first global or European participant",
              nodeType: "text",
            },
          ],
          nodeType: BLOCKS.PARAGRAPH,
        },
      ],
      nodeType: BLOCKS.DOCUMENT,
    },
    pageContent: pageContentmock,
    key: "set-studies-report-a-first-box",
  },
}

