import type { EditStudyProps } from '@/pages/studies/[studyId]/edit'

import { constructDatePartsFromDate } from './date'
import type { EditStudyInputs } from './schemas'

export const mapStudyToStudyFormInput = (study: EditStudyProps['study']): EditStudyInputs => ({
  studyId: study.id,
  status: study.studyStatus,
  recruitmentTarget: study.sampleSize?.toString() ?? undefined,
  cpmsId: study.cpmsId.toString(),
  plannedOpeningDate: constructDatePartsFromDate(study.plannedOpeningDate),
  plannedClosureDate: constructDatePartsFromDate(study.plannedClosureDate),
  actualOpeningDate: constructDatePartsFromDate(study.actualOpeningDate),
  actualClosureDate: constructDatePartsFromDate(study.actualClosureDate),
  estimatedReopeningDate: constructDatePartsFromDate(study.estimatedReopeningDate),
  furtherInformation: '', // TODO: is there a field for this
})
