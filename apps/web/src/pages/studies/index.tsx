import { AlertIcon, Container, Details, NotificationBanner } from '@nihr-ui/frontend'
import { logger } from '@nihr-ui/logger'
import type { InferGetServerSidePropsType } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import type { ReactElement } from 'react'

import type { OrderType } from '@/@types/filters'
import { Card } from '@/components/atoms'
import {
  Filters,
  Pagination,
  RequestSupport,
  SelectedFilters,
  Sort,
  StudiesListSkeleton,
  StudyList,
} from '@/components/molecules'
import { RootLayout } from '@/components/organisms'
import { Roles, STUDIES_PER_PAGE } from '@/constants'
import { SUPPORT_PAGE } from '@/constants/routes'
import { useFormListeners } from '@/hooks/useFormListeners'
import { getSponsorOrgName, getSupportOrgName } from '@/lib/organisations'
import { getStudiesForOrgs } from '@/lib/studies'
import { formatDate } from '@/utils/date'
import { getFiltersFromQuery } from '@/utils/filters'
import { pluraliseStudy } from '@/utils/pluralise'
import { withServerSideProps } from '@/utils/withServerSideProps'

const renderNotificationBanner = (success: boolean) =>
  success ? (
    <NotificationBanner heading="The study assessment was successfully saved" success>
      Request{' '}
      <Link className="govuk-notification-banner__link" href={SUPPORT_PAGE}>
        NIHR RDN support
      </Link>{' '}
      for this study.
    </NotificationBanner>
  ) : null

export type StudiesProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Studies({
  studies,
  meta: { totalItems, totalItemsDue, initialPage, initialPageSize },
  filters,
}: StudiesProps) {
  const router = useRouter()

  const { isLoading, handleFilterChange } = useFormListeners()

  const titleResultsText =
    totalItems === 0
      ? `(no matching search results)`
      : `(${totalItems} ${pluraliseStudy(totalItems)}, page ${initialPage} of ${Math.ceil(
          totalItems / initialPageSize
        )})`

  return (
    <Container>
      <NextSeo title={`Study Progress Review - Search results ${titleResultsText}`} />
      <div className="lg:flex lg:gap-6">
        <div className="w-full">
          {renderNotificationBanner(Boolean(router.query.success))}

          <h2 className="govuk-heading-l govuk-!-margin-bottom-4">Assess progress of studies</h2>

          <div className="flex items-center gap-2 govuk-!-margin-bottom-4">
            <AlertIcon />{' '}
            <strong className="govuk-heading-s govuk-!-margin-bottom-0">
              There are {totalItemsDue} studies to assess
            </strong>
          </div>

          <p className="govuk-body">
            The NIHR RDN tracks the progress of research studies in its portfolio using data provided by study teams.
            Sponsors or their delegates need to assess if studies are on or off track and if any NIHR RDN support is
            needed.
          </p>

          <Details className="[&>summary]:text-blue" heading="Why am I being asked to assess studies?">
            <p>NIHR RDN asks sponsors or their delegates to review and assess study progress for UK studies when:</p>
            <ul className="govuk-list govuk-list--bullet">
              <li>A study falls behind the agreed milestones in the UK or</li>
              <li>A study is not recruiting to target in the UK</li>
              <li>
                <strong>And</strong> the last progress assessment from the sponsor is over 3 months old
              </li>
            </ul>
          </Details>

          {/* Search/Filter bar */}
          <div>
            <Filters
              filters={filters}
              onFilterChange={handleFilterChange}
              searchLabel="Search study title, protocol number, IRAS ID or CPMS ID"
            />
          </div>

          <SelectedFilters filters={filters} isLoading={isLoading} />

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
                <Sort defaultOrder={filters.order} form="filters-form" />
              </div>
            </div>
          </div>

          {isLoading ? (
            <StudiesListSkeleton />
          ) : (
            <>
              {studies.length > 0 ? (
                <>
                  <ol aria-label="Studies" className="govuk-list govuk-list--spaced">
                    {studies.map((study) => (
                      <li key={study.id}>
                        <StudyList
                          assessmentDue={Boolean(study.isDueAssessment)}
                          assessmentHref={`/assessments/${study.id}?returnUrl=studies`}
                          indications={study.evaluationCategories
                            .map((evalCategory) => evalCategory.indicatorType)
                            .filter((evalCategory, index, items) => items.indexOf(evalCategory) === index)}
                          lastAsessmentDate={study.lastAssessment ? formatDate(study.lastAssessment.createdAt) : ''}
                          shortTitle={study.shortTitle}
                          shortTitleHref={`/studies/${study.id}`}
                          sponsorOrgName={getSponsorOrgName(study.organisations)}
                          supportOrgName={getSupportOrgName(study.organisations)}
                          trackStatus={study.lastAssessment?.status.name}
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
                </>
              ) : (
                <Card className="text-center bg-white" filled>
                  No studies found
                </Card>
              )}
            </>
          )}
        </div>
        <div className="lg:min-w-[300px] lg:max-w-[300px]">
          <div className="lg:sticky top-4">
            <RequestSupport />
            <Card className="mt-4" filled padding={4}>
              <h3 className="govuk-heading-m">Export Study Data</h3>
              <p>
                This export provides a static download of the information held within the Sponsor Engagement Tools for
                the sponsor / delegate organisation.
              </p>
              <a className="govuk-button mb-0" href="/api/export">
                Download Export
              </a>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  )
}

Studies.getLayout = function getLayout(page: ReactElement, { user }: StudiesProps) {
  return <RootLayout user={user}>{page}</RootLayout>
}

export const getServerSideProps = withServerSideProps(Roles.SponsorContact, async (context, session) => {
  try {
    if (!session.user?.organisations.length) {
      return {
        redirect: {
          destination: '/',
        },
      }
    }

    const organisationIds = session.user.organisations.map((userOrg) => userOrg.organisationId)

    const searchParams = new URLSearchParams({
      q: context.query.q ? String(context.query.q) : '',
      page: context.query.page ? String(context.query.page) : '1',
      order: context.query.order ? String(context.query.order) : 'due-assessment',
    })

    const initialPage = Number(searchParams.get('page'))
    const searchTerm = searchParams.get('q')
    const sortOrder = searchParams.get('order') as OrderType

    const studies = await getStudiesForOrgs({
      organisationIds,
      searchTerm,
      currentPage: initialPage,
      pageSize: STUDIES_PER_PAGE,
      sortOrder,
    })

    const filters = getFiltersFromQuery(context.query)

    return {
      props: {
        user: session.user,
        meta: {
          initialPage,
          initialPageSize: STUDIES_PER_PAGE,
          totalItems: studies.pagination.total,
          totalItemsDue: studies.pagination.totalDue,
        },
        studies: studies.data,
        filters,
      },
    }
  } catch (error) {
    logger.error(error)
    return {
      redirect: {
        destination: '/500',
      },
    }
  }
})
