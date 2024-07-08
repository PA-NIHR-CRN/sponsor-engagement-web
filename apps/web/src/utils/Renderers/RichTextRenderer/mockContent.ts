import type { Document } from '@contentful/rich-text-types'
import { BLOCKS } from '@contentful/rich-text-types'

export const mockContent: Document = {
  nodeType: BLOCKS.DOCUMENT,
  data: {},
  content: [
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'Hello, World!',
          marks: [],
          data: {},
        },
      ],
    },
    {
      nodeType: BLOCKS.PARAGRAPH,
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'Bold text!',
          marks: [{ type: 'bold' }],
          data: {},
        },
      ],
    },
    {
      nodeType: BLOCKS.HEADING_2,
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'Heading level 2',
          marks: [],
          data: {},
        },
      ],
    },
    {
      nodeType: BLOCKS.HEADING_3,
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'Heading level 3',
          marks: [],
          data: {},
        },
      ],
    },
    {
      nodeType: BLOCKS.HEADING_4,
      data: {},
      content: [
        {
          nodeType: 'text',
          value: 'Heading level 4',
          marks: [],
          data: {},
        },
      ],
    },
    {
      nodeType: BLOCKS.UL_LIST,
      data: {},
      content: [
        {
          nodeType: BLOCKS.LIST_ITEM,
          data: {},
          content: [
            {
              nodeType: BLOCKS.PARAGRAPH,
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value: 'List item 1',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
        {
          nodeType: BLOCKS.LIST_ITEM,
          data: {},
          content: [
            {
              nodeType: BLOCKS.PARAGRAPH,
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value: 'List item 2',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
