import dayjs from 'dayjs'

import type { ChangeHistory } from '@/@types/studies'
import { StudyUpdateState, StudyUpdateType } from '@/constants'
import type { Prisma } from '@/lib/prisma'
import { prismaClient } from '@/lib/prisma'
import { formatDate } from '@/utils/date'
import { getErrorMessage } from '@/utils/error'

import type { EditHistory, EditHistoryChange } from './types'

type StudyUpdateRecordType = keyof Prisma.StudyUpdatesGetPayload<undefined>

const seStudyUpdatesColumnsForEditHistory: StudyUpdateRecordType[] = [
  'plannedOpeningDate',
  'actualOpeningDate',
  'plannedClosureToRecruitmentDate',
  'actualClosureToRecruitmentDate',
  'studyStatusGroup',
  'ukRecruitmentTarget',
  'estimatedReopeningDate',
]

export const transformValue = (value: string | null) => {
  if (!value) return null

  // Check if value is a valid number
  if (!Number.isNaN(Number(value))) {
    return value
  }

  // Check if value is a valid date
  if (dayjs(value).isValid()) {
    return formatDate(value)
  }

  return value
}

/**
 * Creates change history for proposed changes:
 * - Fetches the relevant proposed changes from SE
 * - Calculates the difference between the 'before' and 'after' records
 * - Returns normalised change history
 */
export const createChangeHistoryForProposedChanges = async (transactionIds: string[]) => {
  const proposedSEUpdatesData = await prismaClient.studyUpdates.findMany({
    where: { transactionId: { in: transactionIds } },
    include: {
      createdBy: {
        select: {
          email: true,
        },
      },
    },
  })

  return proposedSEUpdatesData
    .filter((update) => update.studyUpdateStateId === (StudyUpdateState.Before as number))
    .reduce<EditHistory[]>((editHistory, currentUpdate) => {
      const transactionId = currentUpdate.transactionId

      if (editHistory.find((history) => history.id === transactionId)) return editHistory

      const linkedAfterRecord = proposedSEUpdatesData.find(
        (update) => update.id !== currentUpdate.id && update.transactionId === transactionId
      )
      if (!linkedAfterRecord) return editHistory

      // Calculate difference between the 'before' and 'after' record
      const changes: EditHistoryChange[] = []
      Object.entries(currentUpdate).forEach(([key, value]) => {
        if (!seStudyUpdatesColumnsForEditHistory.includes(key as StudyUpdateRecordType)) return

        const afterValue = linkedAfterRecord[key] as string | number

        // eslint-disable-next-line @typescript-eslint/no-base-to-string -- selected fields above ensures that this condition is not met
        const normalisedBeforeValue = value ? value.toString() : null
        const normalisedAfterValue = afterValue ? afterValue.toString() : null

        const transformedBeforeValue = transformValue(normalisedBeforeValue)
        const transformedAfterValue = transformValue(normalisedAfterValue)

        if (transformedBeforeValue !== transformedAfterValue) {
          changes.push({
            columnChanged: key,
            beforeValue: transformedBeforeValue,
            afterValue: transformedAfterValue,
          })
        }
      })

      // If there are no changes, do not push an edit history entry
      if (changes.length === 0) return editHistory

      editHistory.push({
        id: transactionId,
        modifiedDate: currentUpdate.createdAt.toISOString(),
        userEmail: currentUpdate.createdBy.email,
        changes,
        studyUpdateType: StudyUpdateType.Proposed,
      })
      return editHistory
    }, [])
}

/**
 * Creates change history for CPMS changes:
 * - Determines if the change is direct/indirect
 * - Retrieves additional fields (user email and date) from SE if it's a direct change
 * - Returns normalised change history
 */
export const createChangeHistoryForCPMSChanges = async (cpmsUpdates: ChangeHistory[], LSNs: string[]) => {
  const bufferArrayLSNs = LSNs.map((value) => Buffer.from(value, 'hex'))

  const directSEUpdatesData = await prismaClient.studyUpdates.findMany({
    where: {
      LSN: { in: bufferArrayLSNs },
      studyUpdateStateId: StudyUpdateState.After,
      studyUpdateTypeId: StudyUpdateType.Direct,
    },
    include: {
      createdBy: true,
    },
  })

  const editHistoryFromCPMSData: EditHistory[] = []

  cpmsUpdates.forEach((edit) => {
    if (!LSNs.includes(edit.LSN)) return

    const existsInSE = directSEUpdatesData.find(
      (update) => update.LSN?.toString('hex').toLowerCase() === edit.LSN.toLowerCase()
    )

    const changes = edit.Changes.reduce<EditHistoryChange[]>((editHistoryChanges, currentChange) => {
      const transformedBeforeValue = transformValue(currentChange.OldValue)
      const transformedAfterValue = transformValue(currentChange.NewValue)

      if (transformedBeforeValue !== transformedAfterValue) {
        editHistoryChanges.push({
          columnChanged: currentChange.Column,
          beforeValue: transformedBeforeValue,
          afterValue: transformedAfterValue,
        })
      }

      return editHistoryChanges
    }, [])

    // If there are no changes, skip over this change history from CPMS
    if (changes.length === 0) return

    if (existsInSE) {
      editHistoryFromCPMSData.push({
        id: edit.LSN,
        modifiedDate: existsInSE.createdAt.toISOString(),
        changes,
        userEmail: existsInSE.createdBy.email,
        studyUpdateType: StudyUpdateType.Direct,
      })
    } else {
      editHistoryFromCPMSData.push({
        id: edit.LSN,
        modifiedDate: edit.Timestamp,
        changes,
      })
    }
  })

  return editHistoryFromCPMSData
}

/**
 * Gets the ten most recent updates to display to the user
 * Merges direct/indirect changes from CPMS and proposed changes from SE to determine the most recent
 */
export const getTenMostRecentUpdates = (
  proposedUpdates: Prisma.PickEnumerable<Prisma.StudyUpdatesGroupByOutputType, 'transactionId' | 'createdAt'>[],
  cpmsUpdates: ChangeHistory[]
) => {
  // Mapping CPMS and SE edit to the same data structure
  const mappedSEUpdates = proposedUpdates.map((edit) => ({
    id: edit.transactionId,
    createdAt: edit.createdAt.toISOString(),
    type: 'SE',
  }))

  const mappedCPMSUpdates = cpmsUpdates.map((edit) => ({
    id: edit.LSN,
    createdAt: edit.Timestamp,
    type: 'CPMS',
  }))

  // The ten most recent updates
  return [...mappedSEUpdates, ...mappedCPMSUpdates]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)
}

export const getEditHistory = async (
  studyId: number,
  cpmsChangeHistory: ChangeHistory[]
): Promise<{ data?: EditHistory[]; error?: string }> => {
  try {
    // Ten most recent proposed updates - returns transactionId and createdAt
    const mostRecentProposedUpdates = await prismaClient.studyUpdates.groupBy({
      by: ['transactionId', 'createdAt'],
      where: {
        studyUpdateTypeId: StudyUpdateType.Proposed,
        studyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })

    // The ten most recent updates
    const tenMostRecentUpdates = getTenMostRecentUpdates(mostRecentProposedUpdates, cpmsChangeHistory)

    const proposedUpdatesTransactionIds = tenMostRecentUpdates
      .filter((edit) => edit.type === 'SE')
      .map((edit) => edit.id)
    const editHistoryFromProposedUpdates = await createChangeHistoryForProposedChanges(proposedUpdatesTransactionIds)

    const cpmsUpdatesLSNs = tenMostRecentUpdates.filter((edit) => edit.type === 'CPMS').map((edit) => edit.id)
    const editHistoryFromCPMSData = await createChangeHistoryForCPMSChanges(cpmsChangeHistory, cpmsUpdatesLSNs)

    return {
      data: [...editHistoryFromCPMSData, ...editHistoryFromProposedUpdates].sort(
        (a, b) => new Date(b.modifiedDate).getTime() - new Date(a.modifiedDate).getTime()
      ),
    }
  } catch (error) {
    const errorMessage = getErrorMessage(error)

    return {
      data: undefined,
      error: errorMessage,
    }
  }
}
