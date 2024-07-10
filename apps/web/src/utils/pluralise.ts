export const pluralise = (text: string, totalItems: number) => `${text}${totalItems === 1 ? '' : 's'}`

export const pluraliseStudy = (totalItems: number) => (totalItems === 1 ? 'study' : 'studies')

export const pluraliseOrganisation = (totalItems: number) => (totalItems === 1 ? 'organisation' : 'organisations')
