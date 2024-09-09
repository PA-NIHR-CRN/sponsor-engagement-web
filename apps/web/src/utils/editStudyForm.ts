import type { EditStudyProps } from '@/pages/studies/[studyId]/edit'

import { constructDatePartsFromDate } from './date'
import type { StudyInputs } from './schemas'

export const mapStudyToStudyFormInput = (study: EditStudyProps['study']): StudyInputs => ({
  status: study.studyStatus, // TODO: this will need to be mapped
  recruitmentTarget: study.sampleSize ?? undefined,
  studyId: study.cpmsId.toString(),
  plannedOpeningDate: constructDatePartsFromDate(study.plannedOpeningDate),
  plannedClosureDate: constructDatePartsFromDate(study.plannedClosureDate),
  actualOpeningDate: constructDatePartsFromDate(study.actualOpeningDate),
  actualClosureDate: constructDatePartsFromDate(study.actualClosureDate),
})
