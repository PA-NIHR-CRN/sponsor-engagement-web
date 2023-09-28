import type { GetServerSidePropsContext } from 'next'
import { Mock } from 'ts-mockery'
import { getServerSession } from 'next-auth/next'
import { render, within } from '@testing-library/react'
import type { StudiesProps } from '../pages/studies'
import Studies, { getServerSideProps } from '../pages/studies'
import { userNoRoles, userWithSponsorContactRole } from '../__mocks__/session'
import { SIGN_IN_PAGE } from '../constants/routes'

jest.mock('next-auth/next')
jest.mock('../pages/api/auth/[...nextauth]', () => ({
  '@auth/prisma-adapter': jest.fn(),
}))

describe('getServerSideProps', () => {
  const getServerSessionMock = jest.mocked(getServerSession)
  const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {} })

  test('redirects to sign in page when there is no user session', async () => {
    getServerSessionMock.mockResolvedValueOnce(null)
    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: SIGN_IN_PAGE,
      },
    })
  })

  test('redirects back to the homepage for users without any roles', async () => {
    getServerSessionMock.mockResolvedValueOnce(userNoRoles)

    const result = await getServerSideProps(context)
    expect(result).toEqual({
      redirect: {
        destination: '/',
      },
    })
  })
})

describe('Studies page', () => {
  jest.mocked(getServerSession).mockResolvedValue(userWithSponsorContactRole)

  test('Default layout', async () => {
    // TODO: mock api response here

    const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {} })

    const { props } = (await getServerSideProps(context)) as {
      props: StudiesProps
    }

    const { getByRole, getByText } = render(Studies.getLayout(<Studies {...props} />, { ...props }))

    // Title
    expect(getByRole('heading', { level: 2, name: 'Assess progress of studies' })).toBeInTheDocument()

    // Total studies needing assessment
    expect(getByText('There are 4 studies to assess')).toBeInTheDocument()

    // Description
    expect(
      getByText(
        'The NIHR CRN tracks the progress of research studies in its portfolio using data provided by study teams. Sponsors or their delegates need to assess if studies are on or off track and if any NIHR CRN support is needed.'
      )
    ).toBeInTheDocument()

    // Hint collapsible
    expect(getByText('Why am I being asked to assess studies?')).toBeInTheDocument()
    expect(
      getByText('NIHR CRN asks sponsors or their delegates to review and assess study progress for UK sites when:')
    ).toBeInTheDocument()
    expect(getByText('A study falls behind the agreed milestones in the UK')).toBeInTheDocument()
    expect(getByText('A study is not recruiting to target in the UK')).toBeInTheDocument()
    expect(getByText('the last progress assessment from the sponsor is over 3 months old')).toBeInTheDocument()

    // Support
    expect(getByRole('heading', { level: 3, name: 'Get NIHR CRN support' })).toBeInTheDocument()
    expect(
      getByText('Sponsors or their delegates can get NIHR CRN support with their research study at any time.')
    ).toBeInTheDocument()
    expect(getByRole('link', { name: 'Get support' })).toHaveAttribute('href', '/')

    // Study results title
    expect(getByText('30 studies found (4 due for assessment)')).toBeInTheDocument()

    // Sort
    expect(getByRole('combobox', { name: 'Sort by' })).toBeInTheDocument()
    expect((getByRole('option', { name: 'Recently updated' }) as HTMLOptionElement).selected).toBe(true)

    // Study results list
    expect(within(getByRole('list', { name: 'Studies' })).getAllByRole('listitem')).toHaveLength(2)

    // Pagination
    const pagination = getByRole('navigation', { name: 'results' })
    expect(pagination).toBeInTheDocument()
    expect(within(pagination).queryByRole('link', { name: 'Previous' })).not.toBeInTheDocument()
    expect(within(pagination).getByRole('link', { name: 'Page 1' })).toHaveAttribute('href', '/?page=1')
    expect(within(pagination).getByRole('link', { name: 'Page 2' })).toHaveAttribute('href', '/?page=2')
    expect(within(pagination).getByRole('link', { name: 'Next' })).toHaveAttribute('href', '/?page=2')
  })
})

// describe('Studies page searching', () => {})
// describe('Studies page filtering', () => {})
// describe('Studies page sorting', () => {})
