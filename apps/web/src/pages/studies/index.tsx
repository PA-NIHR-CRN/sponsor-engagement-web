import type { ReactElement } from 'react'
import { AlertIcon, Container, Details, NotificationBanner } from '@nihr-ui/frontend'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getServerSession } from 'next-auth/next'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'
import { RootLayout } from '../../components/Layout/RootLayout'
import { authOptions } from '../api/auth/[...nextauth]'
import { SIGN_IN_PAGE } from '../../constants/routes'
import { GetSupport, StudyList, Pagination, Sort, Filters, SelectedFilters } from '../../components/molecules'
import { PER_PAGE } from '../../constants'
import { pluraliseStudy } from '../../utils/pluralise'
import { getStudiesForOrgs } from '../../lib/studies'
import { formatDate } from '../../utils/date'
import { isClinicalResearchSponsor } from '../../lib/organisations'
import { useStudies } from '../../hooks/useStudies'
import { getFiltersFromQuery } from '../../utils/filters'
import { Card } from '../../components/atoms'
import 'react-loading-skeleton/dist/skeleton.css'

const renderNotificationBanner = (success: boolean) =>
  success ? (
    <NotificationBanner heading="The study assessment was successfully saved" success>
      Get{' '}
      <Link className="govuk-notification-banner__link" href="/">
        NIHR CRN support
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

  const { isLoading, handleFilterChange } = useStudies()

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

          {/* Search/Filter bar */}
          <div>
            <Filters filters={filters} onFilterChange={handleFilterChange} />
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
                <Sort defaultOrder="updated" form="filters-form" />
              </div>
            </div>
          </div>

          {isLoading ? (
            <Skeleton
              baseColor="var(--colour-grey-10)"
              borderRadius={0}
              className="govuk-!-margin-bottom-3"
              containerTestId="study-skeleton"
              count={5}
              height={152}
              style={{ lineHeight: 'inherit' }}
              width="100%"
            />
          ) : (
            <>
              {studies.length > 0 ? (
                <>
                  <ol aria-label="Studies" className="govuk-list govuk-list--spaced">
                    {studies.map((study) => {
                      const sponsorOrg = study.organisations.find((org) => isClinicalResearchSponsor(org))
                      const supportOrg = study.organisations.find((org) => !isClinicalResearchSponsor(org))
                      return (
                        <li key={study.id}>
                          <StudyList
                            assessmentDue={Boolean(study.isDueAssessment)}
                            assessmentHref={`/assessments/${study.id}?returnUrl=studies`}
                            indications={study.evaluationCategories.map((evalCategory) => evalCategory.indicatorType)}
                            lastAsessmentDate={formatDate(study.assessments[0]?.updatedAt)}
                            shortTitle={study.shortTitle}
                            shortTitleHref={`/studies/${study.id}`}
                            sponsorOrgName={sponsorOrg?.organisation.name}
                            supportOrgName={supportOrg?.organisation.name}
                            trackStatus={study.assessments[0]?.status.name}
                          />
                        </li>
                      )
                    })}
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

    const organisationIds = session.user.organisations.map((userOrg) => userOrg.organisationId)

    const searchParams = new URLSearchParams({
      q: context.query.q ? String(context.query.q) : '',
      page: context.query.page ? String(context.query.page) : '1',
    })

    const initialPage = Number(searchParams.get('page'))
    const searchTerm = searchParams.get('q')

    const studies = await getStudiesForOrgs({
      organisationIds,
      searchTerm,
      currentPage: initialPage,
      pageSize: PER_PAGE,
    })

    const filters = getFiltersFromQuery(context.query)

    return {
      props: {
        user: session.user,
        meta: {
          initialPage,
          initialPageSize: PER_PAGE,
          totalItems: studies.pagination.total,
          totalItemsDue: studies.pagination.totalDue,
        },
        studies: studies.data,
        filters,
      },
    }
  } catch (error) {
    console.error('error', error)
    return {
      redirect: {
        destination: '/500',
      },
    }
  }
}
