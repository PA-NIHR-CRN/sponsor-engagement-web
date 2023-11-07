import path from 'node:path'
import * as fs from 'node:fs'
import assert from 'node:assert'
import { PrismaClient } from '@prisma/client'
import { logger } from 'logger'
import { parse } from 'csv-parse'
import { batchSize, headers, intentionMap } from './constants'
import { parseDate } from './utils'
import type { Assessment, AssessmentRow } from './types'

const prisma = new PrismaClient()

const seedAssessments = async () => {
  logger.info(`⧗ Assessments seed start ✓`)

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
      data: uniqueContacts.map((email) => ({ email, identityGatewayId: '' })),
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
      assessments.push({
        cpmsId: Number(assessmentRecord.StudyID),
        status: intentionData[0],
        comment: intentionData[1],
        createdAt: parseDate(assessmentRecord['Created At']),
        createdBy: assessmentRecord['Created By'].toLowerCase().trim(),
      })
    }

    if (assessments.length > 0 && assessments.length % batchSize === 0) {
      await processAssessments()
      assessments.length = 0 // Clear the assessments array
    }

    ++numTotalAssessments
  }

  await processAssessments() // Process any leftover assessments

  logger.info('Skipped %s assessments out of a total of %s', numSkippedAssessments, numTotalAssessments)
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
