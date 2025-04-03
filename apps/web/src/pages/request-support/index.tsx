import type { Document } from '@contentful/rich-text-types'
import { Container } from '@nihr-ui/frontend'
import type { GetServerSidePropsContext } from 'next'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import type { ReactElement } from 'react'

import { RootLayout } from '@/components/organisms'
import { getBporFooter, getPage } from '@/lib/contentful/contentfulService'
import { RichTextRenderer } from '@/utils/Renderers/RichTextRenderer/RichTextRenderer'

export interface RequestSupportProps {
  returnPath?: string
  content?: {
    richText?: Document
  }
  footerContent?: {
    richText?: Document
  }
}

export default function RequestSupport({ returnPath, content, footerContent }: RequestSupportProps) {
  if (!content || !footerContent) return null
  return (
    <Container>
      <NextSeo title="Request NIHR RDN support" />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <div>
            {content.richText ? <RichTextRenderer>{content.richText}</RichTextRenderer> : 'No page content available'}
          </div>
          {returnPath ? (
            <Link className="govuk-button govuk-!-margin-top-2" href={returnPath}>
              Return to previous page
            </Link>
          ) : null}
          <div>
            {footerContent.richText ? (
              <RichTextRenderer>{footerContent.richText}</RichTextRenderer>
            ) : (
              'No BPoR text available'
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}

RequestSupport.getLayout = function getLayout(page: ReactElement) {
  return <RootLayout user={null}>{page}</RootLayout>
}
export const getServerSideProps = async ({ query }: GetServerSidePropsContext) => {
  const [entry, footerEntry] = await Promise.all([getPage(), getBporFooter()])
  return {
    props: {
      returnPath: query.returnPath || null,
      content: entry?.fields || null,
      footerContent: footerEntry?.fields || null,
    },
  }
}
