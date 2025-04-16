export const batchSize = 1000

export const headers = [
  'StudyID',
  'Study status in the UK',
  'Comments',
  'Agreed Intention',
  'Created At',
  'Created By',
] as const

export const intentionMap: Partial<Record<string, ['Off track' | 'On track', string?]>> = {
  'In discussion with funder to agree intention': ['Off track', 'In discussion with funder'],
  'Off track and will close study': ['Off track', 'Will close study'],
  'Off track and will close to recruitment': ['Off track', 'Will close to recruitment'],
  'Off track for delivery and to be addressed in line with guidance': [
    'Off track',
    'To be addressed in line with guidance',
  ],
  'On track as per study milestones': ['On track'],
}
