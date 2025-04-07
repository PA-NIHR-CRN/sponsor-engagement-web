import { authService } from '@nihr-ui/auth'
import { Wso2GroupOperation } from '@nihr-ui/auth/src/constants/constants'
import { emailService } from '@nihr-ui/email'
import { logger } from '@nihr-ui/logger'
import { emailTemplates } from '@nihr-ui/templates/sponsor-engagement'
import type { NextApiRequest } from 'next'

import { Roles } from '@/constants'
import { getUserOrganisationById } from '@/lib/organisations'
import { prismaClient } from '@/lib/prisma'
import { hasOrganisationAccess } from '@/utils/organisations'
import type { OrganisationRemoveContactInputs } from '@/utils/schemas'
import { organisationRemoveContactSchema } from '@/utils/schemas'
import { withApiHandler } from '@/utils/withApiHandler'

import { isUserEligibleForOdpRole } from './registration'

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: OrganisationRemoveContactInputs
}

export async function removeUserFromGroup(email: string, group: string) {
  try {
    await authService.updateWSO2UserGroup(email, group, Wso2GroupOperation.Remove)
  } catch (groupError) {
    logger.error(`Failed to remove group ${group} from user ${email}: ${groupError}`)
  }
}

export default withApiHandler<ExtendedNextApiRequest>(
  [Roles.ContactManager, Roles.SponsorContact],
  async (req, res, session) => {
    try {
      if (req.method !== 'POST') {
        throw new Error('Wrong method')
      }
      const { ODP_ROLE_GROUP_ID = '' } = process.env

      const { userOrganisationId } = organisationRemoveContactSchema.parse(req.body)

      const userOrganisation = await getUserOrganisationById(Number(userOrganisationId))

      if (!userOrganisation) {
        throw new Error('No user organisation found')
      }

      if (!hasOrganisationAccess(session.user.roles, session.user.organisations, userOrganisation.organisationId)) {
        throw new Error(`User does not have access to this organisation: ${userOrganisation.organisationId}`)
      }

      const {
        user: { id: requestedByUserId },
      } = session

      // Remove user from organisation
      const { user, organisation } = await prismaClient.userOrganisation.update({
        where: {
          id: Number(userOrganisationId),
        },
        include: {
          organisation: true,
          user: true,
        },
        data: {
          isDeleted: true,
          updatedBy: { connect: { id: requestedByUserId } },
        },
      })

      logger.info('Removed contact with email %s from organisation %s', user.email, organisation.name)

      // Remove corresponding entries in UserOrganisationInvitation table
      await prismaClient.userOrganisationInvitation.updateMany({
        where: {
          userOrganisationId: Number(userOrganisationId),
        },
        data: {
          isDeleted: true, // TODO: make sure to update nightly jobs to filter by isDeleted field
        },
      })

      logger.info('Successfully removed entry in UserOrganisationInvitation table')

      const isEligibleForOdpRole = await isUserEligibleForOdpRole(user.id)

      if (!isEligibleForOdpRole) {
        await removeUserFromGroup(user.email, ODP_ROLE_GROUP_ID)
      }

      if (user.email) {
        await emailService.sendEmail({
          to: user.email,
          subject: `NIHR RDN has removed you as a Sponsor contact for ${organisation.name}`,
          htmlTemplate: emailTemplates['contact-removed.html.hbs'],
          textTemplate: emailTemplates['contact-removed.text.hbs'],
          templateData: {
            organisationName: organisation.name,
          },
        })
      }

      return res.redirect(302, `/organisations/${userOrganisation.organisation.id}?success=2`)
    } catch (error) {
      logger.error(error)

      const userOrganisationId = req.body.userOrganisationId

      if ((error as Error).stack?.includes('MessageRejected')) {
        const searchParams = new URLSearchParams({ fatal: '3' })
        return res.redirect(302, `/organisations/remove-contact/${userOrganisationId}/?${searchParams.toString()}`)
      }

      const searchParams = new URLSearchParams({ fatal: '1' })

      return res.redirect(302, `/organisations/remove-contact/${userOrganisationId}/?${searchParams.toString()}`)
    }
  }
)
