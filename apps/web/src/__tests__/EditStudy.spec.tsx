import userEvent from '@testing-library/user-event'
import axios from 'axios'
import type { GetServerSidePropsContext } from 'next'
import { getServerSession } from 'next-auth/next'
import mockRouter from 'next-router-mock'
import { Mock } from 'ts-mockery'

import { userWithSponsorContactRole } from '@/__mocks__/session'
import { Status } from '@/@types/studies'
import { render, screen, within } from '@/config/TestUtils'
import { SUPPORT_PAGE } from '@/constants/routes'
import { mappedCPMSStudyEvals, mockCPMSStudy, mockStudyWithRelations } from '@/mocks/studies'
import EditStudy, { type EditStudyProps, getServerSideProps } from '@/pages/studies/[studyId]/edit'

import { prismaMock } from '../__mocks__/prisma'

jest.mock('next-auth/next')
jest.mock('axios')
const mockedGetAxios = jest.mocked(axios.get)
const mockedPostAxios = jest.mocked(axios.post)

const mockStudyId = mockStudyWithRelations.id.toString()

const mockCPMSResponse = {
  StatusCode: 200,
  Result: mockCPMSStudy,
}

const env = { ...process.env }
const mockedEnvVars = {
  apiUrl: 'cpms-api',
  apiUsername: 'testuser',
  apiPassword: 'testpwd',
}

const organisationsByRole = {
  CRO: 'Test Organisation',
}
const getServerSessionMock = jest.mocked(getServerSession)

const renderPage = async (
  mockEditAxiosResponseUrl?: string,
  mockRouterPushUrl = `/studies/${mockStudyId}`,
  mockReturnedStudy = mockStudyWithRelations
) => {
  const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: mockStudyId } })
  getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
  prismaMock.$transaction.mockResolvedValueOnce([mockStudyWithRelations])
  mockedGetAxios.mockResolvedValueOnce({ data: mockCPMSResponse })
  // Mock returned study is only passed through here because when all requests are successfull the updated study is returned
  prismaMock.study.update.mockResolvedValueOnce(mockReturnedStudy)
  prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce(mappedCPMSStudyEvals[0])
  prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce(mappedCPMSStudyEvals[1])
  if (mockEditAxiosResponseUrl) {
    mockedPostAxios.mockResolvedValueOnce({ request: { responseURL: mockEditAxiosResponseUrl } })
  }
  await mockRouter.push(mockRouterPushUrl)

  const { props } = (await getServerSideProps(context)) as {
    props: EditStudyProps
  }

  render(EditStudy.getLayout(<EditStudy {...props} />, { ...props }))
}

const removeDateField = async (label: string) => {
  const dateFieldSet = screen.getByRole('group', { name: label })
  expect(dateFieldSet).toBeInTheDocument()

  const dateParts = ['Day', 'Month', 'Year']

  const promises = dateParts.map(async (datePart) => {
    const dateField = within(dateFieldSet).getByLabelText(datePart)

    expect(dateField).toBeInTheDocument()

    await userEvent.clear(dateField)
  })

  await Promise.all(promises)
}

describe('EditStudy', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  beforeAll(() => {
    process.env.CPMS_API_URL = mockedEnvVars.apiUrl
    process.env.CPMS_API_USERNAME = mockedEnvVars.apiUsername
    process.env.CPMS_API_PASSWORD = mockedEnvVars.apiPassword
  })

  afterAll(() => {
    process.env = env
  })

  describe('getServerSideProps', () => {
    test('redirects to 404 page if user does not have edit study role permissions', async () => {
      const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: mockStudyId } })
      getServerSessionMock.mockResolvedValueOnce({
        ...userWithSponsorContactRole,
        user: { ...userWithSponsorContactRole.user, groups: [] },
      })

      const result = await getServerSideProps(context)
      expect(result).toEqual({
        redirect: {
          destination: '/404',
        },
      })
    })

    test('redirects to 404 page if no study found', async () => {
      const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: mockStudyId } })
      getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
      prismaMock.$transaction.mockResolvedValueOnce([])

      const result = await getServerSideProps(context)
      expect(result).toEqual({
        redirect: {
          destination: '/404',
        },
      })

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
    })

    test('redirect to 404 page if no cpmsId exists in returned study', async () => {
      const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: mockStudyId } })
      getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
      prismaMock.$transaction.mockResolvedValueOnce([{ ...mockStudyWithRelations, cpmsId: undefined }])

      const result = await getServerSideProps(context)
      expect(result).toEqual({
        redirect: {
          destination: '/404',
        },
      })

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
    })

    test('should return correct study and evaluations when all requests are successful', async () => {
      const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: mockStudyId } })
      getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
      prismaMock.$transaction.mockResolvedValueOnce([mockStudyWithRelations])
      mockedGetAxios.mockResolvedValueOnce({ data: mockCPMSResponse })
      prismaMock.study.update.mockResolvedValueOnce(mockStudyWithRelations)
      prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce(mappedCPMSStudyEvals[0])
      prismaMock.studyEvaluationCategory.upsert.mockResolvedValueOnce(mappedCPMSStudyEvals[1])

      const result = await getServerSideProps(context)
      expect(result).toEqual({
        props: {
          user: userWithSponsorContactRole.user,
          study: {
            ...mockStudyWithRelations,
            evaluationCategories: mappedCPMSStudyEvals,
            organisationsByRole,
          },
        },
      })

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
      expect(prismaMock.study.update).toHaveBeenCalledTimes(1)
      expect(prismaMock.studyEvaluationCategory.upsert).toHaveBeenCalledTimes(2)
      expect(mockedGetAxios).toHaveBeenCalledTimes(1)
    })

    test('when request to CPMS fails, should not update study in SE and return correct data', async () => {
      const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: mockStudyId } })
      getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
      prismaMock.$transaction.mockResolvedValueOnce([mockStudyWithRelations])
      mockedGetAxios.mockRejectedValueOnce(new Error('Oh no, an error!'))

      const result = await getServerSideProps(context)
      expect(result).toEqual({
        props: {
          user: userWithSponsorContactRole.user,
          study: { ...mockStudyWithRelations, organisationsByRole },
        },
      })

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
      expect(mockedGetAxios).toHaveBeenCalledTimes(1)
      expect(prismaMock.study.update).not.toHaveBeenCalled()
      expect(prismaMock.studyEvaluationCategory.upsert).not.toHaveBeenCalled()
    })

    test('when request to update study fails, should fallback to SE data and return the correct study evals', async () => {
      const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: mockStudyId } })
      getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
      prismaMock.$transaction.mockResolvedValueOnce([mockStudyWithRelations])
      mockedGetAxios.mockResolvedValueOnce({ data: mockCPMSResponse })
      prismaMock.study.update.mockRejectedValueOnce(new Error('Oh no, an error!'))

      const result = await getServerSideProps(context)
      expect(result).toEqual({
        props: {
          user: userWithSponsorContactRole.user,
          study: {
            ...mockStudyWithRelations,
            organisationsByRole,
          },
        },
      })

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
      expect(mockedGetAxios).toHaveBeenCalledTimes(1)
      expect(prismaMock.study.update).toHaveBeenCalledTimes(1)
      expect(prismaMock.studyEvaluationCategory.upsert).not.toHaveBeenCalled()
    })

    test('when request to update study evals fails, should return the updated study and correct study evals', async () => {
      const context = Mock.of<GetServerSidePropsContext>({ req: {}, res: {}, query: { studyId: mockStudyId } })
      getServerSessionMock.mockResolvedValueOnce(userWithSponsorContactRole)
      prismaMock.$transaction.mockResolvedValueOnce([mockStudyWithRelations])
      mockedGetAxios.mockResolvedValueOnce({ data: mockCPMSResponse })
      prismaMock.study.update.mockResolvedValueOnce(mockStudyWithRelations)
      prismaMock.studyEvaluationCategory.upsert.mockRejectedValueOnce(new Error('Oh no, an error!'))

      const result = await getServerSideProps(context)

      expect(result).toEqual({
        props: {
          user: userWithSponsorContactRole.user,
          study: {
            ...mockStudyWithRelations,
            organisationsByRole,
          },
        },
      })

      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
      expect(mockedGetAxios).toHaveBeenCalledTimes(1)
      expect(prismaMock.study.update).toHaveBeenCalledTimes(1)
      expect(prismaMock.studyEvaluationCategory.upsert).toHaveBeenCalledTimes(2)
    })
  })

  describe('Edit study page', () => {
    test('default layout', async () => {
      await renderPage()

      // Header title
      expect(screen.getByRole('heading', { level: 1, name: 'Update study data' })).toBeInTheDocument()

      // Page title
      expect(screen.getByRole('heading', { level: 2, name: 'Page title: Update study data' })).toBeInTheDocument()

      // Sponsor
      expect(
        screen.getByText(mockStudyWithRelations.organisations[0].organisation.name, { selector: 'span' })
      ).toBeInTheDocument()

      // Study title
      expect(screen.getByText(mockStudyWithRelations.shortTitle, { selector: 'span' })).toBeInTheDocument()

      // Guidance text for Commercial
      expect(
        screen.getByText(
          'Changes to the study status, the key dates and recruitment targets will be communicated to RDN, where possible, your changes will update the study record automatically in CPMS, other changes might be subject to review by the RDN team.',
          { selector: 'div' }
        )
      ).toBeInTheDocument()

      // Support
      expect(screen.getByRole('heading', { level: 3, name: 'Request NIHR RDN support' })).toBeInTheDocument()
      expect(
        screen.getByText(
          'Sponsors or their delegates can request NIHR RDN support with their research study at any time.'
        )
      ).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'Request support' })).toHaveAttribute(
        'href',
        `${SUPPORT_PAGE}?returnPath=/studies/123`
      )

      // Form Input - Status
      const statusFieldset = screen.getByRole('radiogroup', { name: 'Study status' })
      expect(statusFieldset).toBeInTheDocument()

      expect(within(statusFieldset).getByLabelText('In setup')).toBeInTheDocument()
      expect(within(statusFieldset).getByLabelText('In setup')).toHaveAccessibleDescription(
        'Not yet open to recruitment.'
      )

      expect(within(statusFieldset).getByLabelText('Open to recruitment')).toBeInTheDocument()
      expect(within(statusFieldset).getByLabelText('Open to recruitment')).toHaveAccessibleDescription(
        'Ready (open) to recruit participants in at least one UK site. Provide an actual opening date below.'
      )

      expect(within(statusFieldset).getByLabelText('Closed, in follow-up')).toBeInTheDocument()
      expect(within(statusFieldset).getByLabelText('Closed, in follow-up')).toHaveAccessibleDescription(
        'Ongoing, (i.e. participants are being treated or observed), but recruitment is complete. Provide an actual closure date below.'
      )

      expect(within(statusFieldset).getByLabelText('Closed')).toBeInTheDocument()
      expect(within(statusFieldset).getByLabelText('Closed')).toHaveAccessibleDescription(
        'Completed recruitment and any subsequent patient related activities (follow up). Provide an actual closure date below.'
      )

      expect(within(statusFieldset).getByLabelText('Withdrawn')).toBeInTheDocument()
      expect(within(statusFieldset).getByLabelText('Withdrawn')).toHaveAccessibleDescription(
        'Withdrawn during the setup phase and will not be opening to recruitment in the UK.'
      )

      expect(within(statusFieldset).getByLabelText('Suspended')).toBeInTheDocument()
      expect(within(statusFieldset).getByLabelText('Suspended')).toHaveAccessibleDescription(
        'Recruitment of participants has halted, but may resume. Provide an estimated re-opening date below.'
      )

      // Form Input - Planned open recruitment date
      const plannedOpenDateFieldset = screen.getByRole('group', { name: 'Planned opening to recruitment date' })
      expect(plannedOpenDateFieldset).toBeInTheDocument()

      // Form Input - Actual open recruitment date
      const actualOpenDateFieldset = screen.getByRole('group', { name: 'Actual opening to recruitment date' })
      expect(actualOpenDateFieldset).toBeInTheDocument()

      // Form Input - Planned closing recruitment date
      const plannedClosingDateFieldset = screen.getByRole('group', { name: 'Planned closure to recruitment date' })
      expect(plannedClosingDateFieldset).toBeInTheDocument()

      // Form Input - Actual closing recruitment date
      const actualClosingDateFieldset = screen.getByRole('group', { name: 'Actual closure to recruitment date' })
      expect(actualClosingDateFieldset).toBeInTheDocument()

      // Form Input - Estimated reopening date
      const estimatedReopeningDate = screen.getByRole('group', { name: 'Estimated reopening date' })
      expect(estimatedReopeningDate).toBeInTheDocument()

      // Form Input - UK Recruitment target
      const ukRecruitmentTarget = screen.getByLabelText('UK recruitment target')
      expect(ukRecruitmentTarget).toBeInTheDocument()

      // Form Input - Further information
      const furtherInformation = screen.getByLabelText('Further information')
      expect(furtherInformation).toBeInTheDocument()
      expect(furtherInformation).toHaveAccessibleDescription(
        'You have 500 characters remaining If needed, provide further context or justification for changes made above.'
      )

      // Update CTA
      expect(screen.getByRole('button', { name: 'Update' })).toHaveAttribute('type', 'submit')

      // Cancel CTA
      expect(screen.getByRole('link', { name: 'Cancel' })).toHaveAttribute('href', `/studies/${mockStudyId}`)
    })
  })

  describe('Form submission failures', () => {
    test('Fatal server error shows an error at the top of the page', async () => {
      const errorResponseUrl = '/studies/123/edit?fatal=1'
      await renderPage(errorResponseUrl, errorResponseUrl, {
        ...mockStudyWithRelations,
        studyStatus: Status.InSetup,
        actualClosureDate: null,
        actualOpeningDate: null,
      })

      expect(screen.getByRole('heading', { level: 1, name: 'Update study data' })).toBeInTheDocument()

      await userEvent.click(screen.getByRole('button', { name: 'Update' }))

      expect(mockRouter.asPath).toBe(errorResponseUrl)

      const alert = screen.getByRole('alert')
      expect(
        within(alert).getByText('An unexpected error occurred whilst processing the form, please try again later.')
      ).toBeInTheDocument()
    })
  })

  describe('Client side validation', () => {
    describe('should display an error on submit ', () => {
      it.each(['Day', 'Month', 'Year'])('when a date field includes an invalid %s', async (datePart: string) => {
        await renderPage()

        const plannedOpenDateFieldset = screen.getByRole('group', { name: 'Planned opening to recruitment date' })
        expect(plannedOpenDateFieldset).toBeInTheDocument()
        const datePartField = within(plannedOpenDateFieldset).getByLabelText(datePart)
        expect(datePartField).toBeInTheDocument()

        await userEvent.click(datePartField)
        await userEvent.paste('50')

        await userEvent.click(screen.getByRole('button', { name: 'Update' }))

        // Error message
        const errorMessage =
          datePart === 'Year'
            ? 'Year must include 4 numbers'
            : `Planned opening to recruitment date requires a valid ${datePart.toLowerCase()}`

        const alert = screen.getByRole('alert')
        expect(within(alert).getByText(errorMessage)).toBeInTheDocument()

        // Invalid field
        expect(datePartField).toHaveAttribute('aria-invalid', 'true')
      })

      it.each(['Day', 'Month', 'Year'])('when a date does not include a %s', async (datePart: string) => {
        await renderPage()

        const plannedOpenDateFieldset = screen.getByRole('group', { name: 'Planned opening to recruitment date' })
        expect(plannedOpenDateFieldset).toBeInTheDocument()
        const datePartField = within(plannedOpenDateFieldset).getByLabelText(datePart)
        expect(datePartField).toBeInTheDocument()

        await userEvent.clear(datePartField)

        await userEvent.click(screen.getByRole('button', { name: 'Update' }))

        // Error message
        const alert = screen.getByRole('alert')
        expect(
          within(alert).getByText(`Planned opening to recruitment date must include a ${datePart.toLowerCase()}`)
        ).toBeInTheDocument()

        // Invalid field
        expect(datePartField).toHaveAttribute('aria-invalid', 'true')
      })

      it('when actual opening to recruitment date is in the future', async () => {
        const currentYear = new Date().getFullYear()

        await renderPage()

        const actualOpeningDateFieldSet = screen.getByRole('group', { name: 'Actual opening to recruitment date' })
        expect(actualOpeningDateFieldSet).toBeInTheDocument()

        const yearField = within(actualOpeningDateFieldSet).getByLabelText('Year')
        expect(yearField).toBeInTheDocument()

        await userEvent.click(yearField)
        await userEvent.clear(yearField)
        await userEvent.paste((currentYear + 1).toString())

        await userEvent.click(screen.getByRole('button', { name: 'Update' }))

        // Error message
        const alert = screen.getByRole('alert')
        expect(
          within(alert).getByText('Actual opening to recruitment date must be today or in the past')
        ).toBeInTheDocument()
      })

      it('when planned closure to recruitment date is before planned opening to recruitment date', async () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- in control of test data
        const plannedOpeningDateYear = mockStudyWithRelations.plannedClosureDate!.getFullYear()

        await renderPage()

        const plannedClosureFieldSet = screen.getByRole('group', { name: 'Planned closure to recruitment date' })
        expect(plannedClosureFieldSet).toBeInTheDocument()

        const yearField = within(plannedClosureFieldSet).getByLabelText('Year')
        expect(yearField).toBeInTheDocument()

        await userEvent.click(yearField)
        await userEvent.clear(yearField)
        await userEvent.paste((plannedOpeningDateYear - 1).toString())

        await userEvent.click(screen.getByRole('button', { name: 'Update' }))

        // Error message
        const alert = screen.getByRole('alert')
        expect(
          within(alert).getByText(
            'Planned closure to recruitment date must be after Planned opening to recruitment date'
          )
        ).toBeInTheDocument()
      })

      it('when planned closure to recruitment date is before actual opening to recruitment date', async () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- in control of test data
        const actualOpeningDateYear = mockStudyWithRelations.actualOpeningDate!.getFullYear()

        await renderPage(undefined, undefined, {
          ...mockStudyWithRelations,
          plannedOpeningDate: null,
        })

        const plannedClosureFieldSet = screen.getByRole('group', { name: 'Planned closure to recruitment date' })
        expect(plannedClosureFieldSet).toBeInTheDocument()

        const yearField = within(plannedClosureFieldSet).getByLabelText('Year')
        expect(yearField).toBeInTheDocument()

        await userEvent.click(yearField)
        await userEvent.clear(yearField)
        await userEvent.paste((actualOpeningDateYear - 1).toString())

        await userEvent.click(screen.getByRole('button', { name: 'Update' }))

        // Error message
        const alert = screen.getByRole('alert')
        expect(
          within(alert).getByText(
            'Planned closure to recruitment date must be after Actual opening to recruitment date'
          )
        ).toBeInTheDocument()
      })

      it('when actual clsoure to recruitment date is in the future', async () => {
        const currentYear = new Date().getFullYear()

        await renderPage(undefined, undefined, {
          ...mockStudyWithRelations,
          plannedOpeningDate: null,
        })
        const actualClosureDateFieldSet = screen.getByRole('group', { name: 'Actual closure to recruitment date' })
        expect(actualClosureDateFieldSet).toBeInTheDocument()

        const yearField = within(actualClosureDateFieldSet).getByLabelText('Year')
        expect(yearField).toBeInTheDocument()

        await userEvent.click(yearField)
        await userEvent.clear(yearField)
        await userEvent.paste((currentYear + 1).toString())

        await userEvent.click(screen.getByRole('button', { name: 'Update' }))

        // Error message
        const alert = screen.getByRole('alert')
        expect(
          within(alert).getByText('Actual closure to recruitment date must be today or in the past')
        ).toBeInTheDocument()
      })

      it.each(['19999999'])(
        'should display an error message when UK recruitment target has an invalid value',
        async (value: string) => {
          await renderPage()
          const ukRecruitmentTargetField = screen.getByLabelText('UK recruitment target')
          expect(ukRecruitmentTargetField).toBeInTheDocument()

          await userEvent.click(ukRecruitmentTargetField)
          await userEvent.clear(ukRecruitmentTargetField)
          await userEvent.paste(value)

          await userEvent.click(screen.getByRole('button', { name: 'Update' }))

          // Error message
          const alert = screen.getByRole('alert')
          expect(within(alert).getByText('Enter a valid UK target')).toBeInTheDocument()
        }
      )

      it(`when status is 'In Setup' and both planned opening and planned closure dates are blank`, async () => {
        await renderPage(undefined, undefined, { ...mockStudyWithRelations, studyStatus: Status.InSetup })

        const fieldsToRemove = ['Planned opening to recruitment date', 'Planned closure to recruitment date']
        await Promise.all(
          fieldsToRemove.map(async (label) => {
            await removeDateField(label)
          })
        )

        await userEvent.click(screen.getByRole('button', { name: 'Update' }))

        // Error messages
        const alert = screen.getByRole('alert')
        fieldsToRemove.forEach((label) => {
          expect(within(alert).getByText(`${label} is a mandatory field`)).toBeInTheDocument()
        })
      })

      it(`when status is 'Open to recruitment' and planned opening, planned closure and actual opening dates are blank`, async () => {
        await renderPage(undefined, undefined, { ...mockStudyWithRelations, studyStatus: Status.OpenToRecruitment })

        const fieldsToRemove = [
          'Planned opening to recruitment date',
          'Planned closure to recruitment date',
          'Actual opening to recruitment date',
        ]
        await Promise.all(
          fieldsToRemove.map(async (label) => {
            await removeDateField(label)
          })
        )

        await userEvent.click(screen.getByRole('button', { name: 'Update' }))

        // Error messages
        const alert = screen.getByRole('alert')
        fieldsToRemove.forEach((label) => {
          expect(within(alert).getByText(`${label} is a mandatory field`)).toBeInTheDocument()
        })
      })

      it(`when status is 'Suspended' and planned opening, planned closure, actual opening and estimated reopening dates are blank`, async () => {
        await renderPage(undefined, undefined, { ...mockStudyWithRelations, studyStatus: Status.Suspended })

        const fieldsToRemove = [
          'Planned opening to recruitment date',
          'Planned closure to recruitment date',
          'Actual opening to recruitment date',
          'Estimated reopening date',
        ]
        await Promise.all(
          fieldsToRemove.map(async (label) => {
            await removeDateField(label)
          })
        )

        await userEvent.click(screen.getByRole('button', { name: 'Update' }))

        // Error messages
        const alert = screen.getByRole('alert')
        fieldsToRemove.forEach((label) => {
          expect(within(alert).getByText(`${label} is a mandatory field`)).toBeInTheDocument()
        })
      })

      it(`when status is 'Withdrawn' and both planned opening and planned closure dates are blank`, async () => {
        await renderPage(undefined, undefined, { ...mockStudyWithRelations, studyStatus: Status.WithdrawnDuringSetup })

        const fieldsToRemove = ['Planned opening to recruitment date', 'Planned closure to recruitment date']
        await Promise.all(
          fieldsToRemove.map(async (label) => {
            await removeDateField(label)
          })
        )

        await userEvent.click(screen.getByRole('button', { name: 'Update' }))

        // Error messages
        const alert = screen.getByRole('alert')
        fieldsToRemove.forEach((label) => {
          expect(within(alert).getByText(`${label} is a mandatory field`)).toBeInTheDocument()
        })
      })

      it(`when status is 'Closed' and planned opening, planned closure, actual opening and actual closure dates are blank`, async () => {
        await renderPage(undefined, undefined, { ...mockStudyWithRelations, studyStatus: Status.ClosedToRecruitment })

        const fieldsToRemove = [
          'Planned opening to recruitment date',
          'Planned closure to recruitment date',
          'Actual closure to recruitment date',
        ]
        await Promise.all(
          fieldsToRemove.map(async (label) => {
            await removeDateField(label)
          })
        )

        await userEvent.click(screen.getByRole('button', { name: 'Update' }))

        // Error messages
        const alert = screen.getByRole('alert')
        fieldsToRemove.forEach((label) => {
          expect(within(alert).getByText(`${label} is a mandatory field`)).toBeInTheDocument()
        })
      })

      it(`when status is 'Closed, In Follow Up' and planned opening, planned closure, actual opening and actual closure dates are blank`, async () => {
        await renderPage(undefined, undefined, {
          ...mockStudyWithRelations,
          studyStatus: Status.ClosedToRecruitmentInFollowUp,
        })

        const fieldsToRemove = [
          'Planned opening to recruitment date',
          'Planned closure to recruitment date',
          'Actual closure to recruitment date',
          'Actual opening to recruitment date',
        ]
        await Promise.all(
          fieldsToRemove.map(async (label) => {
            await removeDateField(label)
          })
        )

        await userEvent.click(screen.getByRole('button', { name: 'Update' }))

        // Error messages
        const alert = screen.getByRole('alert')
        fieldsToRemove.forEach((label) => {
          expect(within(alert).getByText(`${label} is a mandatory field`)).toBeInTheDocument()
        })
      })
    })
  })
})
