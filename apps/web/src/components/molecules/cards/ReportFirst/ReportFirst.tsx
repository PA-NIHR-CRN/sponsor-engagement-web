import type { Document } from '@contentful/rich-text-types'
import { StartIcon } from '@nihr-ui/frontend'
import clsx from 'clsx'
import type { Entry } from 'contentful'

import type { TypeSetPageSkeleton } from '@/@types/generated/TypeSetPage'
import { Card } from '@/components/atoms'
import { ContentfulEntries } from '@/constants/contentful/entries'
import { REPORT_FIRSTS_PAGE } from '@/constants/routes'
import { mapDynamicPageContent } from '@/lib/contentful/contentfulUtils'
import { RichTextRenderer } from '@/utils/Renderers/RichTextRenderer/RichTextRenderer'

interface ReportFirstProps {
    showAsStartButton?: boolean
    studyId?: number
    reportaFirstContentfulContent: Entry<TypeSetPageSkeleton> | null;
}


export function ReportFirst({ showAsStartButton = false, studyId, reportaFirstContentfulContent }: ReportFirstProps) {

    
const reportaFirstContentfulContentFields = reportaFirstContentfulContent?.fields
const reportaFirstPagecontent = mapDynamicPageContent(reportaFirstContentfulContentFields?.pageContent as Entry[])

    return (
        <Card className='mb-4 aside' data-testid="report-first" filled padding={4}>
            <h3 className="govuk-heading-m">
                { reportaFirstContentfulContentFields?.title.toString() }
            </h3>

            <div className="govuk-body">
                <RichTextRenderer>{reportaFirstContentfulContentFields?.guidanceText as Document}</RichTextRenderer>
            </div>

            <a
                aria-label={reportaFirstPagecontent?.get(ContentfulEntries.REPORT_A_FIRST_BOX_BUTTON_ARIA_LABEL)?.toString()}
                className={
                    clsx(
                        'govuk-link nihr-link-lg nihr-link-arrow-left mb-0',
                        { 'govuk-button--start': showAsStartButton }
                    )}
                href={
                studyId
                    ? `${REPORT_FIRSTS_PAGE}?studyId=${studyId}`
                    : REPORT_FIRSTS_PAGE
                }
                rel="noopener noreferrer"
            >
                {reportaFirstPagecontent?.get(ContentfulEntries.REPORT_A_FIRST_BOX_BUTTON)?.toString()}
                {showAsStartButton ? <StartIcon /> : null}
            </a>
        </Card>
    )
}
