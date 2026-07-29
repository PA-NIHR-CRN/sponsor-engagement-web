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
  className?: string
}

interface RichTextRendererProps {
  children: Document
}

function Bold({ children }: TypographyProps) {
  return <strong>{children}</strong>
}

function Text({ children }: TypographyProps) {
  return <p className='govuk-body'>{children}</p>
}

const headingVariants = ['l', 'm', 's', 's', 's', 's']

function Heading({ level, children }: { level: 1 | 2 | 3 | 4 | 5 | 6; children: ReactNode }) {
  const Tag = `h${level}` as const
  return <Tag className={`govuk-heading-${headingVariants[level - 1]}`}>{children}</Tag>
}

export function LinkEntry({ text, url, className }: LinkEntryProps) {
  return (
    <Link
      aria-label={`${text} (opens in new tab)`}
      className={className}
      href={url}
      rel="noopener noreferrer"
      target="_blank"
    >
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
    [BLOCKS.HEADING_1]: (node, children: ReactNode) => <Heading level={1}>{children}</Heading>,
    [BLOCKS.HEADING_2]: (node, children: ReactNode) => <Heading level={2}>{children}</Heading>,
    [BLOCKS.HEADING_3]: (node, children: ReactNode) => <Heading level={3}>{children}</Heading>,
    [BLOCKS.HEADING_4]: (node, children: ReactNode) => <Heading level={4}>{children}</Heading>,
    [BLOCKS.HEADING_5]: (node, children: ReactNode) => <Heading level={5}>{children}</Heading>,
    [BLOCKS.HEADING_6]: (node, children: ReactNode) => <Heading level={6}>{children}</Heading>,
    [BLOCKS.QUOTE]: (node, children: ReactNode) => <div className="govuk-inset-text">{children}</div>,
    [BLOCKS.TABLE]: (node, children: ReactNode) => <table className="govuk-table">{children}</table>,
    [BLOCKS.TABLE_ROW]: (node, children: ReactNode) => <tr className="govuk-table__row">{children}</tr>,
    [BLOCKS.TABLE_CELL]: (node, children: ReactNode) => <td className="govuk-govuk-table__cell">{children}</td>,
    [BLOCKS.TABLE_HEADER_CELL]: (node, children: ReactNode) => <th className="govuk-table__header">{children}</th>,
    [INLINES.HYPERLINK]: (node, children: ReactNode) => (
      <LinkEntry className="govuk-link" text={children ? (children as string) : ''} url={node.data.uri as string} />
    ),
  },
}
export function RichTextRenderer({ children }: RichTextRendererProps) {
  return <>{documentToReactComponents(children, options)}</>
}
