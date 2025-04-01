import { Prisma } from 'database'
import { emailService } from '@nihr-ui/email'
import { config as dotEnvConfig } from 'dotenv'
import { prismaClient } from './lib/prisma'
import { UserOrganisationInviteStatus } from './lib/constants'

dotEnvConfig()

const fetchPendingEmails = async (pendingStatusId: number) => {
  return prismaClient.userOrganisationInvitation.findMany({
    where: { statusId: pendingStatusId },
    distinct: ['userOrganisationId'],
    orderBy: {
      createdAt: Prisma.SortOrder.desc,
    },
  })
}

export const inviteMonitor = async () => {
  const { id: pendingStatusId } = await prismaClient.sysRefInvitationStatus.findFirstOrThrow({
    where: { name: UserOrganisationInviteStatus.PENDING },
  })

  const pendingEmails = await fetchPendingEmails(pendingStatusId)

  await emailService.getEmailStatus(pendingEmails[0].messageId)

  // Prisma query to findMany on status = 'Pending'
  // - we need the latest one so unique on userOrganisationId ?

  // Parallel calls to fetch status from Amazon SES and append on to object from above

  // loop through each object, apply logic
  // - should we create an array of changes to make and then to updateMany at the end
  // - different categories to update ?

  // Success group:
  // data: { status: 'Success' }, where: {id: {in: [IDS_TO_MAKE_SUCCESS] } }

  // Success group:
  // data: { status: 'Success' }, where: {id: {in: [IDS_TO_MAKE_SUCCESS] } }

  // Failed group:
  // Send failure email
  // data: { status: 'Failure' , failureNotifiedAt: <date>}, where: {id: {in: [IDS_TO_MAKE_FAILED] } }
}
