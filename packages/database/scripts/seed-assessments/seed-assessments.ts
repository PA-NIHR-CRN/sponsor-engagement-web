import path from 'node:path'
import * as fs from 'node:fs'
import assert from 'node:assert'
import { PrismaClient } from '@prisma/client'
import { parse } from 'csv-parse'
import { logger } from '@nihr-ui/logger'
import { batchSize, headers, intentionMap } from './constants'
import { parseDate } from './utils'
import type { Assessment, AssessmentRow } from './types'

const prisma = new PrismaClient()

const uniqueAssessments = new Map<string, boolean>()

const getAssessmentKey = (cpmsId: number, status: string, createdBy: string, createdAt: Date) =>
  `${cpmsId}-${status}-${createdBy}-${createdAt.toISOString().slice(0, 10)}`

const seedAssessments = async () => {
  logger.info(`⧗ Assessments seed start ✓`)
  logger.info(`⧗ Database URL: ${process.env.DATABASE_URL}`)

  const assessmentStatuses = await prisma.sysRefAssessmentStatus.findMany()

  const onTrackStatus = assessmentStatuses.find((status) => status.name === 'On track')
  const offTrackStatus = assessmentStatuses.find((status) => status.name === 'Off track')

  assert(onTrackStatus)
  assert(offTrackStatus)

  const csvPath = path.resolve(__dirname, `../../csv/assessments.csv`)

  // Current batch of assessments from the CSV file
  const assessments: Assessment[] = []

  let numTotalAssessments = 0
  let numSkippedAssessments = 0
  let numDuplicatedAssessments = 0
  let numAddedContacts = 0

  const processAssessments = async () => {
    const assessmentStudyCpmsIds = [...new Set(assessments.map((assessment) => assessment.cpmsId))]

    const matchingStudies = await prisma.study.findMany({
      where: { cpmsId: { in: assessmentStudyCpmsIds } },
    })

    logger.info(
      'Found %s matching study records from %s unique CPMS ids',
      matchingStudies.length,
      assessmentStudyCpmsIds.length
    )

    type StudiesByCpmsId = Record<number, (typeof matchingStudies)[number]>

    const matchingStudiesByCpmsId = matchingStudies.reduce<StudiesByCpmsId>((accumulator, study) => {
      accumulator[study.cpmsId] = study
      return accumulator
    }, {})

    const validAssessments = assessments.filter((assessment) => assessment.cpmsId in matchingStudiesByCpmsId)

    numSkippedAssessments += assessments.length - validAssessments.length

    const uniqueContacts = [...new Set(assessments.map((assessment) => assessment.createdBy))] as string[] // Cast to keep eslint happy

    const { count } = await prisma.user.createMany({
      data: uniqueContacts.map((email) => ({ email })),
      skipDuplicates: true,
    })

    numAddedContacts += count

    const users = await prisma.user.findMany({ where: { email: { in: uniqueContacts } } })

    const asssessmentInputs = validAssessments.map((row) => {
      const { cpmsId, status, createdBy, createdAt, comment } = row

      const createdByUser = users.find((user) => user.email === createdBy)
      assert(createdByUser)

      return prisma.assessment.create({
        data: {
          studyId: matchingStudiesByCpmsId[cpmsId].id,
          statusId: status === 'On track' ? onTrackStatus.id : offTrackStatus.id,
          createdById: createdByUser.id,
          createdAt,
          ...(comment && {
            furtherInformation: {
              create: {
                furtherInformationText: comment,
              },
            },
          }),
        },
      })
    })

    await prisma.$transaction(asssessmentInputs)

    logger.info('Added %s assessments from %s possible', asssessmentInputs.length, assessments.length)
  }

  const parser = fs.createReadStream(csvPath).pipe(
    parse({
      delimiter: ',',
      columns: [...headers],
      fromLine: 2,
    })
  )

  for await (const record of parser) {
    const assessmentRecord = record as AssessmentRow

    const intention = assessmentRecord['Agreed Intention']
    const intentionData = intentionMap[intention]

    if (intentionData) {
      const [status, comment] = intentionData

      const cpmsId = Number(assessmentRecord.StudyID)
      const createdAt = parseDate(assessmentRecord['Created At'])
      const createdBy = assessmentRecord['Created By'].toLowerCase().trim()

      const assessmentKey = getAssessmentKey(cpmsId, status, createdBy, createdAt)

      const isDuplicate = uniqueAssessments.has(assessmentKey)

      if (!isDuplicate) {
        assessments.push({
          cpmsId,
          status,
          comment,
          createdAt,
          createdBy,
        })
        uniqueAssessments.set(assessmentKey, true)
      } else {
        logger.info('Found duplicated assessment: %s %s %s %s', cpmsId, status, createdBy, createdAt)
        ++numDuplicatedAssessments
      }
    }

    if (assessments.length > 0 && assessments.length % batchSize === 0) {
      await processAssessments()
      assessments.length = 0 // Clear the assessments array
    }

    ++numTotalAssessments
  }

  await processAssessments() // Process any leftover assessments

  logger.info('Skipped %s assessments out of a total of %s', numSkippedAssessments, numTotalAssessments)
  logger.info('Found %s duplicated assessments out of a total of %s', numDuplicatedAssessments, numTotalAssessments)
  logger.info('Added %s contacts', numAddedContacts)
}

seedAssessments()
  .then(async () => {
    const used = process.memoryUsage().heapUsed / 1024 / 1024
    logger.info(`Used approximately ${used} MB of memory`)
    await prisma.$disconnect()
    logger.info(`✓ Assessments seed end)`)
  })
  .catch(async (e) => {
    logger.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
