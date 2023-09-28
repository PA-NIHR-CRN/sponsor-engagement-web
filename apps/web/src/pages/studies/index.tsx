import type { ReactElement } from 'react'
import { AlertIcon, Container, Details } from '@nihr-ui/frontend'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getServerSession } from 'next-auth/next'
import { RootLayout } from '../../components/Layout/RootLayout'
import { authOptions } from '../api/auth/[...nextauth]'
import { SIGN_IN_PAGE } from '../../constants/routes'
import { GetSupport, StudyList } from '../../components/molecules'

export type StudiesProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Studies() {
  return (
    <Container>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l govuk-!-margin-bottom-4">Assess progress of studies</h2>

          <div className="flex items-center gap-2 govuk-!-margin-bottom-4">
            <AlertIcon />{' '}
            <strong className="govuk-heading-s govuk-!-margin-bottom-0">There are 4 studies to assess</strong>
          </div>

          <p className="govuk-body">
            The NIHR CRN tracks the progress of research studies in its portfolio using data provided by study teams.
            Sponsors or their delegates need to assess if studies are on or off track and if any NIHR CRN support is
            needed.
          </p>

          <Details className="[&>summary]:text-blue" heading="Why am I being asked to assess studies?">
            <p>NIHR CRN asks sponsors or their delegates to review and assess study progress for UK sites when:</p>
            <ul className="govuk-list govuk-list--bullet">
              <li>A study falls behind the agreed milestones in the UK</li>
              <li>A study is not recruiting to target in the UK</li>
              <li>
                <strong>And</strong> the last progress assessment from the sponsor is over 3 months old
              </li>
            </ul>
          </Details>
        </div>
        <div className="govuk-grid-column-one-third">
          <GetSupport />
        </div>
      </div>

      <ul className="govuk-list govuk-list--spaced">
        <li>
          <StudyList
            assessmentDue
            assessmentHref="/"
            indication="Recruitment concerns"
            lastAsessmentDate="5 May 2023"
            shortTitle="Endothelial senescence in chronic lung disease"
            shortTitleHref="/"
            sponsorName="AstraZenica"
            trackStatus="Off"
            trackStatusHref="/"
          />
        </li>
        <li>
          <StudyList
            assessmentDue
            assessmentHref="/"
            indication="No concerns"
            lastAsessmentDate="8 May 2023"
            shortTitle="A Study to Evaluate the Safety, Tolerability and Immunogenicity of Tau Targeted Vaccines in Participants With Early Alzheimer's Disease"
            shortTitleHref="/"
            sponsorName="Pfizer"
            trackStatus="On"
            trackStatusHref="/"
          />
        </li>
      </ul>
    </Container>
  )
}

Studies.getLayout = function getLayout(page: ReactElement, { user }: StudiesProps) {
  return (
    <RootLayout heading="Assess progress of studies" user={user}>
      {page}
    </RootLayout>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session) {
      return {
        redirect: {
          destination: SIGN_IN_PAGE,
        },
      }
    }

    return {
      props: {
        user: session.user,
      },
    }
  } catch (error) {
    return {
      redirect: {
        destination: '/500',
      },
    }
  }
}
