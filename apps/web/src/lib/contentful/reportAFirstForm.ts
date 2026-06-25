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
        id: "3dLwiU9LMFN4mN0wpH3zLE",
        type: "Entry",
        createdAt: "2026-06-25T09:12:59.473Z",
        updatedAt: "2026-06-25T09:12:59.473Z",
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
        contentTitle: "set--report-a-first-form--type-of-first--global--guidance",
        text: "The UK has consented the first participant in a global study.",
    },
    },
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
        id: "3ijXX2HHmqQnjdB8xFeKVb",
        type: "Entry",
        createdAt: "2026-06-25T09:24:58.544Z",
        updatedAt: "2026-06-25T09:24:58.544Z",
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
        contentTitle: "set--report-a-first-form--type-of-first--european--guidance",
        text: "The UK has consented the first participant in a European study.",
    },
    },
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
        id: "6MNafm1HflFl3F2JrZdwdL",
        type: "Entry",
        createdAt: "2026-06-25T09:25:46.859Z",
        updatedAt: "2026-06-25T09:25:46.859Z",
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
        contentTitle: "set--report-a-first-form--first-patient-first-visit--guidance",
        text: "The date the first participant was consented to the study",
    },
    },
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
        id: "4ZxLJhwzxEPshBZT1pfoH0",
        type: "Entry",
        createdAt: "2026-06-25T09:57:36.555Z",
        updatedAt: "2026-06-25T09:57:36.555Z",
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
        contentTitle: "set--report-a-first-form--site-name--guidance",
        text: "Name of site that consented the first global/European participant",
    },
    },
    ]   


export const reportAFirstFormMock: Entry<TypeSetPageSkeleton> = 
{
  metadata: {
    tags: [
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
    id: "29qp9IN8pt3R132rcp4CKh",
    type: "Entry",
    createdAt: "2026-06-25T10:46:20.578Z",
    updatedAt: "2026-06-25T10:48:08.296Z",
    environment: {
      sys: {
        id: "uat",
        type: "Link",
        linkType: "Environment",
      },
    },
    publishedVersion: 17,
    revision: 2,
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
    entryTitle: "Set Report a first form.",
    title: "Report a 'First'",
    guidanceText: {
      data: {
      },
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
              value: "Reporting a first helps us capture key study milestones quickly and accurately. Your direct submission reduces follow‑up emails, improves data quality, and ensures important achievements - such as global or European firsts - are recorded and linked to wider systems in real time.",
              nodeType: "text",
            },
          ],
          nodeType: BLOCKS.PARAGRAPH,
        },
      ],
      nodeType: BLOCKS.DOCUMENT,
    },
    pageContent: pageContentmock,
    key: "set--report-a-first-form",
  },
}


