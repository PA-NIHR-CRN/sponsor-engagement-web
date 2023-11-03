import type { ReactElement } from 'react'
import { Container, Table } from '@nihr-ui/frontend'
import type { InferGetServerSidePropsType } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'
import clsx from 'clsx'
import { getOrganisationById } from '../../../lib/organisations'
import { withServerSideProps } from '../../../utils/withServerSideProps'
import { formatDate } from '../../../utils/date'
import { RootLayout } from '../../../components/organisms'
import { TextInput } from '../../../components/atoms/Form/TextInput/TextInput'
import { Roles } from '../../../constants'

export type OrganisationProps = InferGetServerSidePropsType<typeof getServerSideProps>

export default function Organisation({ organisation }: OrganisationProps) {
  const renderDetails = () => (
    <Table className="govuk-!-margin-top-3">
      <Table.Caption className="govuk-visually-hidden">Organisation details</Table.Caption>
      <Table.Body>
        <Table.Row>
          <Table.CellHeader className="w-1/3">Organisation ID</Table.CellHeader>
          <Table.Cell>{organisation.id}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader className="w-1/3">Type</Table.CellHeader>
          <Table.Cell>{organisation.roles.includes('CRO') ? 'Commercial' : 'Non-commercal'}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.CellHeader className="w-1/3">Role</Table.CellHeader>
          <Table.Cell>{organisation.roles.join(', ')}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  )

  const renderContactList = () => (
    <Table>
      <Table.Caption className="govuk-visually-hidden">Organisation contacts</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.CellHeader className="w-1/3" column>
            Contact email
          </Table.CellHeader>
          <Table.CellHeader className="w-1/3" column>
            Date added
          </Table.CellHeader>
          <Table.Cell className="w-1/3" />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {organisation.users.map((user) => (
          <Table.Row key={user.id}>
            <Table.Cell>{user.user.email}</Table.Cell>
            <Table.Cell>{user.user.registrationConfirmed ? formatDate(user.createdAt) : 'Pending'}</Table.Cell>
            <Table.Cell>
              <Link href="#">Remove</Link>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )

  return (
    <Container>
      <NextSeo title={`Manage organisation contacts - ${organisation.name}`} />
      <div className="lg:flex lg:gap-6">
        <div className="w-full">
          {/* Organisation name */}
          <h2 className="govuk-heading-l govuk-!-margin-bottom-1">
            <span className="govuk-visually-hidden">Organisation name: </span>
            {organisation.name}
          </h2>

          {/* Organisation roles */}
          <span className="govuk-body-m mb-0 text-darkGrey">
            <span className="govuk-visually-hidden">Organisation roles: </span>
            {organisation.roles.join(', ')}
          </span>

          {/* Organisation details */}
          {renderDetails()}

          <h3 className="govuk-heading-m p-0 govuk-!-margin-bottom-4">Add or remove sponsor contacts</h3>

          <p>
            Invite new sponsor contacts to set up an NIHR Identity Gateway account so they can access this service. New
            contacts are shown as pending until they sign into this service for the first time.
          </p>

          {/* Invite form */}
          <form className="w-full">
            <label className="govuk-label govuk-label--s govuk-!-margin-bottom-2" htmlFor="email" id="email-label">
              Email address
            </label>
            <div className="flex gap-4">
              <TextInput className="min-w-[295px]" name="email" />
              <button className={clsx('govuk-button', { 'pointer-events-none': false })} type="submit">
                Send invite
              </button>
            </div>
          </form>

          {/* Organisation contacts */}
          {organisation.users.length > 0 ? renderContactList() : <p>No contacts associated with this organisation</p>}
        </div>
      </div>
    </Container>
  )
}

Organisation.getLayout = function getLayout(page: ReactElement, { user }: OrganisationProps) {
  return <RootLayout user={user}>{page}</RootLayout>
}

export const getServerSideProps = withServerSideProps(Roles.ContactManager, async (context, session) => {
  const organisationId = Number(context.query.organisationId)

  if (!organisationId) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }

  const organisation = await getOrganisationById(organisationId)

  if (!organisation) {
    return {
      redirect: {
        destination: '/404',
      },
    }
  }

  return {
    props: {
      user: session.user,
      organisation,
    },
  }
})
