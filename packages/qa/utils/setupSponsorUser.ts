import { seDatabaseReq } from './DbRequests'

// TODO: if the user has been manually invited as a study sponsor, an FK prevents delete.

export async function setupSponsorUser(testUserId: number, deletedOrgId: number, activeOrgId: number) {
  // Reset all org mappings for the user
  await seDatabaseReq(`
    DELETE FROM UserOrganisation
    WHERE userId = ${testUserId};
  `)

  // Insert deleted mapping
  await seDatabaseReq(`
    INSERT INTO UserOrganisation
      (userId, organisationId, createdById, updatedById, createdAt, updatedAt, isDeleted)
    VALUES
      (${testUserId}, ${deletedOrgId}, ${testUserId}, ${testUserId}, NOW(), NOW(), 1);
  `)

  // Insert active mapping
  await seDatabaseReq(`
    INSERT INTO UserOrganisation
      (userId, organisationId, createdById, updatedById, createdAt, updatedAt, isDeleted)
    VALUES
      (${testUserId}, ${activeOrgId}, ${testUserId}, ${testUserId}, NOW(), NOW(), 0);
  `)
}
