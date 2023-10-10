import type { ReactElement } from 'react'
import { AlertIcon, Container, Details } from '@nihr-ui/frontend'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getServerSession } from 'next-auth/next'
import { NextSeo } from 'next-seo'
import { RootLayout } from '../../components/Layout/RootLayout'
import { authOptions } from '../api/auth/[...nextauth]'
import { SIGN_IN_PAGE } from '../../constants/routes'
import { GetSupport, StudyList, Pagination, Sort } from '../../components/molecules'
import { PER_PAGE } from '../../constants'
import { pluraliseStudy } from '../../utils/pluralise'
import { getStudiesForOrgs } from '../../lib/studies'
import { formatDate } from '../../utils/date'

export type StudiesProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Studies({
  studies,
  meta: { totalItems, totalItemsDue, initialPage, initialPageSize },
}: StudiesProps) {
  const titleResultsText =
    totalItems === 0
      ? `(no matching search results)`
      : `(${totalItems} ${pluraliseStudy(totalItems)}, page ${initialPage + 1} of ${Math.ceil(
          totalItems / initialPageSize
        )})`

  return (
    <Container>
      <NextSeo title={`Study Progress Review - Search results ${titleResultsText}`} />
      <div className="lg:flex lg:gap-6">
        <div className="w-full">
          <h2 className="govuk-heading-l govuk-!-margin-bottom-4">Assess progress of studies</h2>

          <div className="flex items-center gap-2 govuk-!-margin-bottom-4">
            <AlertIcon />{' '}
            <strong className="govuk-heading-s govuk-!-margin-bottom-0">
              There are {totalItemsDue} studies to assess
            </strong>
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

          {/* Sort bar */}
          <div className="flex-wrap items-center justify-between gap-3 md:flex govuk-!-margin-bottom-4">
            <p className="govuk-heading-s mb-0 whitespace-nowrap">{`${totalItems} ${pluraliseStudy(
              totalItems
            )} found (${totalItemsDue} due for assessment)`}</p>
            <div className="govuk-form-group mt-2 items-center justify-end md:my-0 md:flex">
              {/* Show filters */}
              {/* <div>{showFiltersButton()}</div> */}
              {/* Sort by */}
              <div className="items-center whitespace-nowrap md:flex">
                <Sort defaultOrder="updated" form="filters-form" />
              </div>
            </div>
          </div>

          <ol aria-label="Studies" className="govuk-list govuk-list--spaced">
            {studies.map((study) => (
              <li key={study.id}>
                <StudyList
                  assessmentDue={Boolean(study.isDueAssessment)}
                  assessmentHref={`/assessments/${study.id}?returnUrl=studies`}
                  indications={study.evaluationCategories.map((evalCategory) => evalCategory.indicatorType)}
                  lastAsessmentDate={formatDate(study.assessments[0]?.updatedAt)}
                  shortTitle={study.name}
                  shortTitleHref={`/studies/${study.id}`}
                  sponsorName={study.organisations[0].organisation.name}
                  trackStatus={study.assessments[0]?.status.name}
                  trackStatusHref="/"
                />
              </li>
            ))}
          </ol>

          <Pagination
            className="justify-center"
            initialPage={initialPage}
            initialPageSize={initialPageSize}
            totalItems={totalItems}
          />
        </div>
        <div className="lg:min-w-[300px] lg:max-w-[300px]">
          <GetSupport />
        </div>
      </div>
    </Container>
  )
}

Studies.getLayout = function getLayout(page: ReactElement, { user }: StudiesProps) {
  return <RootLayout user={user}>{page}</RootLayout>
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const session = await getServerSession(context.req, context.res, authOptions)

    if (!session?.user) {
      return {
        redirect: {
          destination: SIGN_IN_PAGE,
        },
      }
    }

    if (session.user.roles.length === 0) {
      return {
        redirect: {
          destination: '/',
        },
      }
    }

    const userOrganisationIds = session.user.organisations.map((org) => org.id)

    const studies = await getStudiesForOrgs(userOrganisationIds, Number(context.query.page) || 1, PER_PAGE)

    return {
      props: {
        user: session.user,
        meta: {
          initialPage: 0,
          initialPageSize: PER_PAGE,
          totalItems: studies.pagination.total,
          totalItemsDue: studies.pagination.totalDue,
        },
        studies: studies.data,
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
