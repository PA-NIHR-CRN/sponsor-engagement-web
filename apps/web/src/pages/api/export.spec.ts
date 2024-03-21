import { logger } from '@nihr-ui/logger'
import type * as exceljs from 'exceljs'
import { Workbook } from 'exceljs'
import MockDate from 'mockdate'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import type { RequestOptions } from 'node-mocks-http'
import { createRequest, createResponse } from 'node-mocks-http'

import { prismaMock } from '@/__mocks__/prisma'
import { userWithSponsorContactRole } from '@/__mocks__/session'
import { HELPER_TEXT, PINK_FILL, RED_TEXT } from '@/constants'
import { mockStudiesForExport } from '@/mocks/studies'

import api from './export'

jest.mock('exceljs')
jest.mock('next-auth/next')
jest.mock('@nihr-ui/logger')

MockDate.set(new Date('2001-01-01'))

beforeEach(() => {
  jest.clearAllMocks()
  jest.mocked(getServerSession).mockResolvedValueOnce(userWithSponsorContactRole)
  logger.info = jest.fn()
  logger.error = jest.fn()
})

type ApiRequest = NextApiRequest
type ApiResponse = NextApiResponse

const testHandler = async (handler: typeof api, options: RequestOptions) => {
  const req = createRequest<ApiRequest>(options)
  const res = createResponse<ApiResponse>()
  await handler(req, res)
  return res
}

describe('Exporting studies list', () => {
  test('Successfully export studies from the studies listing page', async () => {
    const ActualWorkbook = jest.requireActual<typeof exceljs>('exceljs').Workbook

    const mockWorkbook = new ActualWorkbook()
    const mockWorksheet = mockWorkbook.addWorksheet()

    jest.mocked(Workbook).mockImplementation(() => mockWorkbook)
    jest.spyOn(mockWorkbook, 'addWorksheet').mockImplementationOnce(() => mockWorksheet)

    const addConditionalFormattingSpy = jest.spyOn(mockWorksheet, 'addConditionalFormatting')

    prismaMock.study.findMany.mockResolvedValueOnce(mockStudiesForExport)

    const res = await testHandler(api, { method: 'GET' })

    expect(mockWorkbook.addWorksheet).toHaveBeenCalledWith('Studies Export')
    expect(mockWorkbook.worksheets).toHaveLength(1)

    expect(mockWorksheet.rowCount).toBe(5)

    expect(addConditionalFormattingSpy).toHaveBeenCalledTimes(2)

    // Helper text inserted as first row
    const helpTextRow = mockWorksheet.getRow(1)
    expect(helpTextRow.height).toBe(200)
    expect(helpTextRow.alignment).toEqual({ vertical: 'top', wrapText: true })
    expect(helpTextRow.values[1]).toBe(HELPER_TEXT.replace('%s', '01/01/2001'))

    // Correct column headings + formatting
    const headings = mockWorksheet.getRow(2)

    expect(headings.values).toEqual([
      undefined,
      'Study CPMS ID',
      'Study IRAS ID',
      'Study Protocol Number',
      'Study Short Title',
      'Study Long Title',
      'Study Chief Investigator',
      'Study Sponsor Organisation',
      'Study CTU',
      'Study CRO',
      'Due assessment?',
      'Last Assessment Value',
      'Last Assessment Date',
      "Last Assessment 'Additional Information'",
      'Study data indicates',
      'Study Status',
      'Planned opening to recruitment date',
      'Actual opening to recruitment date',
      'Planned closure to recruitment date',
      'Actual closure to recruitment date',
      'UK recruitment target',
      'Total UK recruitment to date',
      'Network recruitment target',
      'Total network recruitment to date',
      'Managing speciality',
      'Sponsor Assessment (On track or Off track)',
      'Additional Information (including any updates to study status, target, and/or date milestones)',
    ])

    expect(headings.font.bold).toBe(true)
    expect(headings.alignment.wrapText).toBe(true)
    expect(headings.alignment.horizontal).toBe('center')
    expect(headings.getCell('onTrack').fill).toBe(PINK_FILL)
    expect(headings.getCell('additionalInformation').fill).toBe(PINK_FILL)
    expect(headings.getCell('isDueAssessment').font).toEqual({ ...RED_TEXT.font, bold: true })

    // Correct study data
    const studyRow = mockWorksheet.getRow(3)
    const study = mockStudiesForExport[0]

    expect(studyRow.values).toEqual([
      undefined,
      study.cpmsId,
      Number(study.irasId),
      study.protocolReferenceNumber,
      study.shortTitle,
      study.title,
      `${study.chiefInvestigatorFirstName} ${study.chiefInvestigatorLastName}`,
      'Test Clinical Research Sponsor',
      undefined, // Study CTU
      'Test Contract Research Organisation',
      'Yes',
      'Off Track',
      study.lastAssessment?.createdAt,
      'Test further info status, Test further info free text',
      'Milestone missed, Recruitment concerns',
      'Live',
      study.plannedOpeningDate,
      study.plannedClosureDate,
      study.actualOpeningDate,
      study.actualClosureDate,
      undefined, // UK recruitment target
      undefined, // Total UK recruitment to date
      study.sampleSize,
      study.totalRecruitmentToDate,
    ])

    // Cell validations added
    mockWorksheet.getColumn('onTrack').eachCell((cell, rowNumber) => {
      if (rowNumber <= 2) {
        expect(cell.dataValidation).toBeUndefined()
      } else {
        expect(cell.dataValidation).toEqual({
          type: 'list',
          allowBlank: true,
          formulae: ['"On track, Off track"'],
        })
      }
    })

    expect(res.statusCode).toBe(200)
    expect(res.getHeader('content-disposition')).toBe('attachment; filename="studies.xlsx"')
  })

  test('Correct columns are present when exporting non-commercial only studies', async () => {
    const ActualWorkbook = jest.requireActual<typeof exceljs>('exceljs').Workbook

    const mockWorkbook = new ActualWorkbook()
    const mockWorksheet = mockWorkbook.addWorksheet()

    jest.mocked(Workbook).mockImplementation(() => mockWorkbook)
    jest.spyOn(mockWorkbook, 'addWorksheet').mockImplementationOnce(() => mockWorksheet)

    prismaMock.study.findMany.mockResolvedValueOnce(mockStudiesForExport.slice(1))

    const res = await testHandler(api, { method: 'GET' })

    // Correct column headings
    const headings = mockWorksheet.getRow(2)

    expect(headings.values).toEqual([
      undefined,
      'Study CPMS ID',
      'Study IRAS ID',
      'Study Short Title',
      'Study Long Title',
      'Study Chief Investigator',
      'Study Sponsor Organisation',
      'Study CTU',
      'Due assessment?',
      'Last Assessment Value',
      'Last Assessment Date',
      "Last Assessment 'Additional Information'",
      'Study data indicates',
      'Study Status',
      'Planned opening to recruitment date',
      'Actual opening to recruitment date',
      'Planned closure to recruitment date',
      'Actual closure to recruitment date',
      'UK recruitment target',
      'Total UK recruitment to date',
      'Managing speciality',
      'Sponsor Assessment (On track or Off track)',
      'Additional Information (including any updates to study status, target, and/or date milestones)',
    ])

    // Correct study data
    const studyRow = mockWorksheet.getRow(3)
    const study = mockStudiesForExport[1]

    expect(studyRow.values).toEqual([
      undefined,
      study.cpmsId,
      Number(study.irasId),
      study.shortTitle,
      study.title,
      `${study.chiefInvestigatorFirstName} ${study.chiefInvestigatorLastName}`,
      'Test Clinical Research Sponsor',
      'Test Contract Research Organisation',
      'No',
      'Off Track',
      study.lastAssessment?.createdAt,
      'Test further info status, Test further info free text',
      'Milestone missed, Recruitment concerns',
      'Live',
      study.plannedOpeningDate,
      study.plannedClosureDate,
      study.actualOpeningDate,
      study.actualClosureDate,
      study.sampleSize,
      study.totalRecruitmentToDate,
    ])

    expect(res.statusCode).toBe(200)
  })

  test('Correct columns are present when exporting commercial only studies', async () => {
    const ActualWorkbook = jest.requireActual<typeof exceljs>('exceljs').Workbook

    const mockWorkbook = new ActualWorkbook()
    const mockWorksheet = mockWorkbook.addWorksheet()

    jest.mocked(Workbook).mockImplementation(() => mockWorkbook)
    jest.spyOn(mockWorkbook, 'addWorksheet').mockImplementationOnce(() => mockWorksheet)

    prismaMock.study.findMany.mockResolvedValueOnce([mockStudiesForExport[0]])

    const res = await testHandler(api, { method: 'GET' })

    // Correct column headings
    const headings = mockWorksheet.getRow(2)

    expect(headings.values).toEqual([
      undefined,
      'Study CPMS ID',
      'Study IRAS ID',
      'Study Protocol Number',
      'Study Short Title',
      'Study Long Title',
      'Study Sponsor Organisation',
      'Study CRO',
      'Due assessment?',
      'Last Assessment Value',
      'Last Assessment Date',
      "Last Assessment 'Additional Information'",
      'Study data indicates',
      'Study Status',
      'Planned opening to recruitment date',
      'Actual opening to recruitment date',
      'Planned closure to recruitment date',
      'Actual closure to recruitment date',
      'Network recruitment target',
      'Total network recruitment to date',
      'Managing speciality',
      'Sponsor Assessment (On track or Off track)',
      'Additional Information (including any updates to study status, target, and/or date milestones)',
    ])

    // Correct study data
    const studyRow = mockWorksheet.getRow(3)
    const study = mockStudiesForExport[0]

    expect(studyRow.values).toEqual([
      undefined,
      study.cpmsId,
      Number(study.irasId),
      study.protocolReferenceNumber,
      study.shortTitle,
      study.title,
      'Test Clinical Research Sponsor',
      'Test Contract Research Organisation',
      'Yes',
      'Off Track',
      study.lastAssessment?.createdAt,
      'Test further info status, Test further info free text',
      'Milestone missed, Recruitment concerns',
      'Live',
      study.plannedOpeningDate,
      study.plannedClosureDate,
      study.actualOpeningDate,
      study.actualClosureDate,
      study.sampleSize,
      study.totalRecruitmentToDate,
    ])

    expect(res.statusCode).toBe(200)
  })
})
