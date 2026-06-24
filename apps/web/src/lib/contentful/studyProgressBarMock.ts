import type { Entry } from 'contentful'

import type { TypeGenericRichTextLinksOnlySkeleton, TypeGenericRichTextSkeleton, TypeGenericTextSkeleton, TypeSetPageSkeleton } from '@/@types/generated'



const pageContentField1mock: (Entry<TypeGenericRichTextLinksOnlySkeleton | TypeGenericRichTextSkeleton | TypeGenericTextSkeleton>)[] | undefined = 
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
            id: "6KkGuxiMQXVI5lkANVO99o",
            type: "Entry",
            createdAt: "2026-06-22T08:02:55.278Z",
            updatedAt: "2026-06-22T08:37:13.312Z",
            environment: {
            sys: {
                id: "uat",
                type: "Link",
                linkType: "Environment",
            },
            },
            revision: 4,
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
            contentTitle: "set-progress-bar-label-over-target",
            text: "Over target by",
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
        id: "DU0FfkXbQGpNzATmlHU4F",
        type: "Entry",
        createdAt: "2026-06-22T08:03:29.694Z",
        updatedAt: "2026-06-22T11:24:43.957Z",
        environment: {
        sys: {
            id: "uat",
            type: "Link",
            linkType: "Environment",
        },
        },
        revision: 3,
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
        contentTitle: "set-progress-bar-opt-out-text",
        text: "No expectation to achieve milestone timeline",
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
        id: "4IIDrgPpWFuZJ7t9U3vl1N",
        type: "Entry",
        createdAt: "2026-06-22T08:05:27.927Z",
        updatedAt: "2026-06-22T08:37:35.005Z",
        environment: {
        sys: {
            id: "uat",
            type: "Link",
            linkType: "Environment",
        },
        },
        revision: 2,
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
        contentTitle: "set-progress-bar-hra-approval-date",
        text: "HRA approval date",
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
        id: "7RTF8uFFtnp5MmwbCgwtz",
        type: "Entry",
        createdAt: "2026-06-22T08:06:13.599Z",
        updatedAt: "2026-06-22T08:37:45.239Z",
        environment: {
        sys: {
            id: "uat",
            type: "Link",
            linkType: "Environment",
        },
        },
        revision: 2,
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
        contentTitle: "set-progress-bar-end-date",
        text: "End date",
    },
    }
]


export const StudyProgressBarMock: Entry<TypeSetPageSkeleton> = 
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
    id: "2HPA4SIRIrsCFdavEq0twC",
    type: "Entry",
    createdAt: "2026-06-22T08:32:54.390Z",
    updatedAt: "2026-06-22T08:38:06.727Z",
    environment: {
      sys: {
        id: "uat",
        type: "Link",
        linkType: "Environment",
      },
    },
    revision: 3,
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
    entryTitle: "SET study progress bar",
    title: "Progress of Study Setup",
    pageContent: pageContentField1mock,
    key: "set-progress-bar",
  },
}

