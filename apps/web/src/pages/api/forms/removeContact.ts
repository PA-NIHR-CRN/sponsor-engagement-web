import type { NextApiRequest } from 'next'
import { logger } from '@nihr-ui/logger'
import type { OrganisationRemoveContactInputs } from '../../../utils/schemas'
import { organisationRemoveContactSchema } from '../../../utils/schemas'
import { withApiHandler } from '../../../utils/withApiHandler'
import { getUserOrganisationById } from '../../../lib/organisations'
import { prismaClient } from '../../../lib/prisma'
import { Roles } from '../../../constants'

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: OrganisationRemoveContactInputs
}

export default withApiHandler<ExtendedNextApiRequest>(Roles.ContactManager, async (req, res, session) => {
  try {
    if (req.method !== 'POST') {
      throw new Error('Wrong method')
    }

    const { userOrganisationId } = organisationRemoveContactSchema.parse(req.body)

    const userOrganisation = await getUserOrganisationById(Number(userOrganisationId))

    if (!userOrganisation) {
      throw new Error('No user organisation found')
    }

    const {
      user: { id: contactManagerUserId },
    } = session

    // Remove user from organisation
    await prismaClient.userOrganisation.update({
      where: {
        id: Number(userOrganisationId),
      },
      include: {
        organisation: true,
        user: true,
      },
      data: {
        isDeleted: true,
        updatedBy: { connect: { id: contactManagerUserId } },
      },
    })

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
})
