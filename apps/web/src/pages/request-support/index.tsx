import { Container } from '@nihr-ui/frontend'
import type { ReactElement } from 'react'
import Link from 'next/link'
import { NextSeo } from 'next-seo'
import type { GetServerSidePropsContext } from 'next'
import { RootLayout } from '../../components/organisms'

export interface RequestSupportProps {
  referer?: string
}

export default function RequestSupport({ referer }: RequestSupportProps) {
  return (
    <Container>
      <NextSeo title="Request NIHR CRN support" />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h1 className="govuk-heading-l">Request NIHR CRN support</h1>
          <p>
            Contact{' '}
            <Link href="https://www.nihr.ac.uk/documents/study-support-service-contacts/11921">your local CRN</Link> if
            you would like to discuss how the NIHR CRN may be able to support you to deliver your study.
          </p>
          <p>
            All NIHR CRN Portfolio studies are able to access the NIHR CRN Study Support Service - a standard national
            framework of support to help you Plan, Place and Perform high quality research.
          </p>
          <p>
            Upon the Sponsor (or delegates) request, the NIHR CRN will work in partnership to support you to overcome
            challenges to the delivery of your study.
          </p>
          <p>Here are some examples (not exhaustive) of how the NIHR CRN can support your study:</p>
          <ul className="govuk-list govuk-list--bullet">
            <li>
              Supporting study-wide planning activities (e.g. identification of potential sites), support with costing
              tool (e.g. SoECAT and ICT), etc.
            </li>
            <li>
              Research delivery advice (e.g. recruitment strategies, regional care pathways and NHS support services,
              investigators, capabilities, etc.)
            </li>
            <li>Discuss site issues, including study delivery</li>
            <li>Advice regarding engagement with local communities</li>
            <li>
              Clinical advice (e.g. assessment of study deliverability in the UK, recommendations of recruitment methods
              and pathways, study design considerations)
            </li>
            <li>Support to overcome barriers, challenges or other types of requests</li>
          </ul>
          {referer ? (
            <Link className="govuk-button govuk-!-margin-top-2" href={referer}>
              Return to previous page
            </Link>
          ) : null}
        </div>
      </div>
    </Container>
  )
}

RequestSupport.getLayout = function getLayout(page: ReactElement) {
  return <RootLayout user={null}>{page}</RootLayout>
}

export const getServerSideProps = ({ req }: GetServerSidePropsContext) => {
  return {
    props: {
      referer: req.headers.referer,
    },
  }
}
