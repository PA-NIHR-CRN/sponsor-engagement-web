import type { Options } from '@contentful/rich-text-react-renderer'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import type { Document } from '@contentful/rich-text-types'
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types'
import Link from 'next/link'
import type { ReactNode } from 'react'
import React from 'react'

import { List, ListItem } from '../../../components/molecules'

interface TypographyProps {
  children: ReactNode
}

interface LinkEntryProps {
  text: string
  url: string
}

interface RichTextRendererProps {
  children: Document
}

function Bold({ children }: TypographyProps) {
  return <span className="font-bold">{children}</span>
}

function Text({ children }: TypographyProps) {
  return <p>{children}</p>
}

const headingVariants = ['xl', 'l', 'm', 's']

function Heading({ level, children }: { level: 2 | 3 | 4; children: ReactNode }) {
  const Tag = `h${level}` as const
  return <Tag className={`govuk-heading-${headingVariants[level - 1]}`}>{children}</Tag>
}

function LinkEntry({ text, url }: LinkEntryProps) {
  return (
    <Link aria-label="(Opens in new tab)" className="govuk-link" href={url} rel="noopener noreferrer" target="_blank">
      {text}
    </Link>
  )
}

const options: Options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <Bold>{text}</Bold>,
  },
  renderNode: {
    [BLOCKS.UL_LIST]: (node, children: ReactNode) => <List>{children}</List>,
    [BLOCKS.OL_LIST]: (node, children: ReactNode) => <List as="ol">{children}</List>,
    [BLOCKS.LIST_ITEM]: (node, children: ReactNode) => <ListItem className="[&>p]:mb-0">{children}</ListItem>,
    [BLOCKS.PARAGRAPH]: (node, children: ReactNode) => <Text>{children}</Text>,
    [BLOCKS.HEADING_2]: (node, children: ReactNode) => <Heading level={2}>{children}</Heading>,
    [BLOCKS.HEADING_3]: (node, children: ReactNode) => <Heading level={3}>{children}</Heading>,
    [BLOCKS.HEADING_4]: (node, children: ReactNode) => <Heading level={4}>{children}</Heading>,
    [INLINES.HYPERLINK]: (node, children: ReactNode) => (
      <LinkEntry text={children ? (children as string) : ''} url={node.data.uri as string} />
    ),
  },
}
export function RichTextRenderer({ children }: RichTextRendererProps) {
  return <>{documentToReactComponents(children, options)}</>
}
