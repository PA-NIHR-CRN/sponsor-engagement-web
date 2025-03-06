import { logger } from '@nihr-ui/logger'
import dayjs from 'dayjs'
import { Workbook, type Worksheet } from 'exceljs'

import { FILE_NAME, HELPER_TEXT, PINK_FILL, RED_TEXT, Roles } from '@/constants'
import { getSponsorOrgName, getSupportOrgName } from '@/lib/organisations'
import { getStudiesForExport, type StudyForExport } from '@/lib/studies'
import { withApiHandler } from '@/utils/withApiHandler'

const columns = [
  { key: 'cpmsId', header: 'Study CPMS ID' },
  { key: 'irasId', header: 'Study IRAS ID' },
  { key: 'protocolReferenceNumber', header: 'Study Protocol Number' },
  { key: 'shortTitle', header: 'Study Short Title' },
  { key: 'title', header: 'Study Long Title' },
  { key: 'chiefInvestigator', header: 'Study Chief Investigator' },
  { key: 'sponsorOrg', header: 'Study Sponsor Organisation' },
  { key: 'studyCTU', header: 'Study CTU' },
  { key: 'studyCRO', header: 'Study CRO' },
  { key: 'isDueAssessment', header: 'Due assessment?' },
  { key: 'lastAssessmentStatus', header: 'Last Assessment Value' },
  { key: 'lastAssessmentDate', header: 'Last Assessment Date', style: { numFmt: 'dd/mm/yyy' } },
  { key: 'lastAssessmentInfo', header: "Last Assessment 'Additional Information'" },
  { key: 'studyDataIndicates', header: 'Study data indicates' },
  { key: 'studyStatus', header: 'Study Status' },
  { key: 'plannedOpeningDate', header: 'Planned opening to recruitment date' },
  { key: 'actualOpeningDate', header: 'Actual opening to recruitment date' },
  { key: 'plannedClosureDate', header: 'Planned closure to recruitment date' },
  { key: 'actualClosureDate', header: 'Actual closure to recruitment date' },
  { key: 'recruitmentTargetUK', header: 'UK recruitment target' },
  { key: 'recruitmentToDateUK', header: 'Total UK recruitment to date' },
  { key: 'managingSpeciality', header: 'Managing speciality' },
  { key: 'onTrack', header: 'Sponsor Assessment (On track or Off track)' },
  {
    key: 'additionalInformation',
    header: 'Additional Information (including any updates to study status, target, and/or date milestones)',
  },
] as const

type Columns = typeof columns
type ColumnKeys = Columns[number]['key']

const commercialColumns: ColumnKeys[] = ['studyCRO', 'protocolReferenceNumber']

const nonCommercialColumns: ColumnKeys[] = ['studyCTU', 'chiefInvestigator']

type StudyDataMapper = (study: StudyForExport) => string | number | Date | null | undefined

const studyDataMappers: Partial<Record<ColumnKeys, StudyDataMapper>> = {
  cpmsId: (study) => study.cpmsId,
  irasId: (study) => Number(study.irasId),
  protocolReferenceNumber: (study) => study.protocolReferenceNumber,
  shortTitle: (study) => study.shortTitle,
  title: (study) => study.title,
  chiefInvestigator: (study) =>
    study.chiefInvestigatorFirstName ? `${study.chiefInvestigatorFirstName} ${study.chiefInvestigatorLastName}` : null,
  sponsorOrg: (study) => getSponsorOrgName(study.organisations),
  studyCRO: (study) => (study.route === 'Commercial' ? getSupportOrgName(study.organisations) : undefined),
  studyCTU: (study) => (study.route !== 'Commercial' ? getSupportOrgName(study.organisations) : undefined),
  isDueAssessment: (study) => (study.isDueAssessment ? 'Yes' : 'No'),
  lastAssessmentStatus: (study) => study.lastAssessment?.status.name,
  lastAssessmentDate: (study) => study.lastAssessment?.createdAt,
  lastAssessmentInfo: (study) =>
    study.lastAssessment?.furtherInformation
      .map((furtherInfo) => furtherInfo.furtherInformation?.name ?? furtherInfo.furtherInformationText)
      .join(', '),
  studyDataIndicates: (study) =>
    study.evaluationCategories
      .map((evalCategory) => evalCategory.indicatorType)
      .filter((evalCategory, index, items) => items.indexOf(evalCategory) === index)
      .join(', '),
  studyStatus: (study) => study.studyStatus,
  plannedOpeningDate: (study) => study.plannedOpeningDate,
  plannedClosureDate: (study) => study.plannedClosureDate,
  actualOpeningDate: (study) => study.actualOpeningDate,
  actualClosureDate: (study) => study.actualClosureDate,
  recruitmentTargetUK: (study) => study.sampleSize,
  recruitmentToDateUK: (study) => study.totalRecruitmentToDate,
  managingSpeciality: (study) => study.managingSpeciality,
}

const addHelperText = (worksheet: Worksheet) => {
  worksheet.insertRow(1, { key: 'helpText', header: 'Help Text' })
  const helpTextRow = worksheet.getRow(1)
  helpTextRow.height = 200
  helpTextRow.values = [HELPER_TEXT.replace('%s', dayjs().format('DD/MM/YYYY'))]
  helpTextRow.alignment = { vertical: 'top', wrapText: true }
  worksheet.mergeCells('A1', `${worksheet.lastColumn?.letter}1`)
}

const addValidations = (worksheet: Worksheet) => {
  worksheet.getColumn('onTrack').eachCell((cell, rowNumber) => {
    if (rowNumber > 2) {
      if (!cell.value) {
        cell.value = 'Select an option'
      }

      cell.dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"On track, Off track"'],
      }
    }
  })
}

const addConditionalFormatting = (worksheet: Worksheet) => {
  // Empty cells
  worksheet.eachRow({ includeEmpty: true }, (row) => {
    row.eachCell({ includeEmpty: true }, (cell) => {
      const cellText = cell.value ? String(cell.value).trim() : ''

      if (!cellText) {
        cell.value = 'No data available'
      }
    })
  })

  // Red "Due assessment" text
  const isDueAssessmentColumn = worksheet.getColumn('isDueAssessment')
  worksheet.addConditionalFormatting({
    ref: `${isDueAssessmentColumn.letter}1:${isDueAssessmentColumn.letter}${worksheet.rowCount}`,
    rules: [
      {
        type: 'containsText',
        operator: 'containsText',
        priority: 1,
        text: 'Yes',
        style: RED_TEXT,
      },
    ],
  })
}

const addFormatting = (worksheet: Worksheet) => {
  // Set column widths
  worksheet.columns.forEach((sheetColumn) => {
    sheetColumn.width = 15
  })

  // Set wrap text
  worksheet.eachRow((row) => {
    row.alignment = { ...row.alignment, wrapText: true }
  })

  const headings = worksheet.getRow(2)

  // Bold headings
  headings.font = { bold: true }
  headings.alignment = { wrapText: true, horizontal: 'center' }

  // Pink headings
  headings.getCell('onTrack').fill = PINK_FILL
  headings.getCell('additionalInformation').fill = PINK_FILL

  // Red headings
  headings.getCell('isDueAssessment').font = { ...RED_TEXT.font, bold: true }
}

const addStudyData = (worksheet: Worksheet, studies: StudyForExport[]) => {
  const isCommercialOnly = studies.every((study) => study.route === 'Commercial')
  const isNonCommercialOnly = studies.every((study) => study.route !== 'Commercial')

  let requiredColumns = [...columns]

  if (isCommercialOnly) {
    requiredColumns = requiredColumns.filter((column) => !nonCommercialColumns.includes(column.key))
  }

  if (isNonCommercialOnly) {
    requiredColumns = requiredColumns.filter((column) => !commercialColumns.includes(column.key))
  }

  worksheet.columns = requiredColumns

  studies.forEach((study) => {
    worksheet.addRow(
      requiredColumns.reduce((row, column) => {
        row[column.key] = studyDataMappers[column.key]?.(study)
        return row
      }, {})
    )
  })
}

export default withApiHandler(Roles.SponsorContact, async (req, res, session) => {
  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet('Studies Export')

  const organisationIds = session.user.organisations.map((userOrg) => userOrg.organisationId)
  const studies = await getStudiesForExport(organisationIds)

  addStudyData(worksheet, studies)
  addHelperText(worksheet)
  addConditionalFormatting(worksheet)
  addValidations(worksheet)
  addFormatting(worksheet)

  res.setHeader('content-disposition', `attachment; filename="${FILE_NAME}"`)

  logger.info('Successfully exported study data')

  await workbook.xlsx.write(res)

  return res.status(200)
})
