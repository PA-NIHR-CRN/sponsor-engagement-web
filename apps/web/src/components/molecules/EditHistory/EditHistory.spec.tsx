import { Status } from '../../../@types/studies'
import { StudyUpdateType } from '../../../constants/index'
import type { EditHistoryItem } from './EditHistory'

export const mockEditHistories: EditHistoryItem[] = [
  {
    LSN: '1212121',
    modifiedDate: new Date().toISOString(),
    userEmail: 'amarpreet.dawgotra@nihr.ac.uk',
    changes: [
      {
        id: '3434',
        afterValue: '120',
        beforeValue: '30',
        columnChanged: 'UkRecruitmentTarget',
      },
      {
        id: '34334',
        afterValue: Status.OpenToRecruitment,
        beforeValue: Status.SuspendedFromOpenToRecruitment,
        columnChanged: 'StudyStatus',
      },
    ],
    studyUpdateType: StudyUpdateType.Direct,
  },
  {
    LSN: '',
    modifiedDate: new Date().toISOString(),
    changes: [
      {
        id: '3454334',
        afterValue: '120',
        beforeValue: '30',
        columnChanged: 'UkRecruitmentTarget',
      },
      {
        id: '3432343',
        afterValue: Status.OpenToRecruitment,
        beforeValue: Status.SuspendedFromOpenToRecruitment,
        columnChanged: 'Status',
      },
    ],
    studyUpdateType: StudyUpdateType.Proposed,
  },
]
