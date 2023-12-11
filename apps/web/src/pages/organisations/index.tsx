import type { ReactElement } from 'react'
import { Container, Table } from '@nihr-ui/frontend'
import type { InferGetServerSidePropsType } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import { logger } from '@nihr-ui/logger'
import { withServerSideProps } from '@/utils/withServerSideProps'
import { getStudyOrganisations } from '@/lib/organisations'
import { ORGANISATIONS_PER_PAGE, Roles } from '@/constants'
import { pluraliseOrganisation } from '@/utils/pluralise'
import { Filters, OrganisationsListSkeleton, Pagination, SelectedFilters } from '@/components/molecules'
import { Card } from '@/components/atoms'
import { useFormListeners } from '@/hooks/useFormListeners'
import { getFiltersFromQuery } from '@/utils/filters'
import { RootLayout } from '@/components/organisms'

export type OrganisationsProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Organisations({
  organisations,
  meta: { totalItems, initialPage, initialPageSize },
  filters,
}: OrganisationsProps) {
  const titleResultsText =
    totalItems === 0
      ? `(no matching search results)`
      : `(${totalItems} ${pluraliseOrganisation(totalItems)}, page ${initialPage} of ${Math.ceil(
          totalItems / initialPageSize
        )})`

  const { isLoading, handleFilterChange } = useFormListeners()

  return (
    <Container>
      <NextSeo title={`Sponsor organisations - Search results ${titleResultsText}`} />
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-two-thirds">
          <h2 className="govuk-heading-l">Manage sponsor contacts</h2>
          <p className="govuk-body">Add and remove contacts for sponsor organisations.</p>

          {/* Search/Filter bar */}
          <div>
            <Filters filters={filters} onFilterChange={handleFilterChange} searchLabel="Search organisation name" />
          </div>

          <SelectedFilters filters={filters} isLoading={isLoading} />

          <div className="flex-wrap items-center justify-between gap-3 md:flex govuk-!-margin-bottom-4">
            <p className="govuk-heading-s mb-0 whitespace-nowrap">{`${totalItems} ${pluraliseOrganisation(
              totalItems
            )} found`}</p>
          </div>

          {isLoading ? (
            <OrganisationsListSkeleton />
          ) : (
            <>
              {organisations.length > 0 ? (
                <>
                  <Table className="govuk-!-margin-bottom-3">
                    <Table.Caption className="govuk-visually-hidden">Manage sponsor organisations</Table.Caption>
                    <Table.Header>
                      <Table.Row>
                        <Table.CellHeader className="w-5/6" column>
                          Organisation
                        </Table.CellHeader>
                        <Table.CellHeader column>
                          <span className="govuk-visually-hidden">Manage</span>
                        </Table.CellHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {organisations.map(({ id, name, roles }) => {
                        return (
                          <Table.Row key={id}>
                            <Table.Cell>
                              <Link href={`/organisations/${id}`}>
                                <span className="govuk-visually-hidden">Organisation name:</span>
                                <strong>{name}</strong>
                              </Link>
                              <div className="govuk-body-s mb-0 govuk-!-margin-top-1">
                                <span className="govuk-visually-hidden">Organisation role:</span>
                                {roles.map((role) => role).join(', ')}
                              </div>
                            </Table.Cell>
                            <Table.Cell className="align-middle text-right">
                              <Link href={`/organisations/${id}`}>
                                Manage <span className="govuk-visually-hidden">{name} sponsor contacts</span>
                              </Link>
                            </Table.Cell>
                          </Table.Row>
                        )
                      })}
                    </Table.Body>
                  </Table>

                  <Pagination
                    className="justify-center"
                    initialPage={initialPage}
                    initialPageSize={initialPageSize}
                    totalItems={totalItems}
                  />
                </>
              ) : (
                <Card className="text-center bg-white" filled>
                  No organisations found
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </Container>
  )
}

Organisations.getLayout = function getLayout(page: ReactElement, { user }: OrganisationsProps) {
  return <RootLayout user={user}>{page}</RootLayout>
}

export const getServerSideProps = withServerSideProps(Roles.ContactManager, async (context, session) => {
  try {
    const searchParams = new URLSearchParams({
      q: context.query.q ? String(context.query.q) : '',
      page: context.query.page ? String(context.query.page) : '1',
    })

    const initialPage = Number(searchParams.get('page'))
    const searchTerm = searchParams.get('q')

    const { data: organisations, pagination } = await getStudyOrganisations({
      searchTerm,
      currentPage: initialPage,
      pageSize: ORGANISATIONS_PER_PAGE,
    })

    const filters = getFiltersFromQuery(context.query)

    return {
      props: {
        user: session.user,
        meta: {
          initialPage,
          initialPageSize: ORGANISATIONS_PER_PAGE,
          totalItems: pagination.total,
        },
        organisations,
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
