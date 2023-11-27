import type { Study, StudyFunder, StudySponsor } from './types'

export const getOrganisationName = (org: StudySponsor | StudyFunder) =>
  'OrganisationName' in org ? org.OrganisationName : org.FunderName

/**
 * Returns a list of organisations unique by name for a given batch of studies
 */
export const getOrgsUniqueByName = (studies: Study[]) =>
  [
    ...new Map(
      studies
        .map((study) => [...study.StudySponsors, ...study.StudyFunders])
        .flat()
        .map((org) => [getOrganisationName(org), org])
    ).values(),
  ] as (StudySponsor | StudyFunder)[]

/**
 * Returns a list of organisations unique by role for a given batch of studies
 */
export const getOrgsUniqueByRole = (studies: Study[]) =>
  [
    ...new Map(
      studies
        .map((study) => [...study.StudySponsors, ...study.StudyFunders])
        .flat()
        .map((org) => [org.OrganisationRole, org])
    ).values(),
  ] as (StudySponsor | StudyFunder)[]

/**
 * Returns a list of organisations unique by name & role for a given batch of studies
 */
export const getOrgsUniqueByNameRole = (studies: Study[]) => {
  const allOrgs = studies.map((study) => [...study.StudySponsors, ...study.StudyFunders]).flat()
  return allOrgs.filter(
    (org, index, self) =>
      index ===
      self.findIndex(
        (o) => getOrganisationName(o) === getOrganisationName(org) && o.OrganisationRole === org.OrganisationRole
      )
  )
}
