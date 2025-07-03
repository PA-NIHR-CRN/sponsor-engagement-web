import { logger } from '@nihr-ui/logger'
import type { NextApiRequest } from 'next'

import { Roles } from '@/constants'
import { CONTACT_MANAGERS_PAGE } from '@/constants/routes'
import { prismaClient } from '@/lib/prisma'
import type { RemoveContactManagerInputs } from '@/utils/schemas'
import { removeContactManagerSchema } from '@/utils/schemas'
import { withApiHandler } from '@/utils/withApiHandler'

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: RemoveContactManagerInputs
}

export default withApiHandler<ExtendedNextApiRequest>([Roles.ContactManager], async (req, res, session) => {
  try {
    if (req.method !== 'POST') {
      throw new Error('Wrong method')
    }

    const { contactManagerUserId } = removeContactManagerSchema.parse(req.body)

    const {
      user: { id: requestedByUserId },
    } = session

    // Remove contact manager role from user.
    await prismaClient.userRole.update({
      where: {
        userId_roleId: {
          userId: Number(contactManagerUserId),
          roleId: Roles.ContactManager,
        },
        isDeleted: false,
      },
      data: {
        isDeleted: true,
        updatedById: requestedByUserId,
      },
    })

    logger.info(`user ${requestedByUserId} Removed contact manager role for User : ${contactManagerUserId}`)

    return res.redirect(302, `${CONTACT_MANAGERS_PAGE}?success=2`)
  } catch (error) {
    logger.error(error)

    const contactManagerUserId = req.body.contactManagerUserId

    if ((error as Error).stack?.includes('MessageRejected')) {
      const searchParams = new URLSearchParams({ fatal: '3' })
      return res.redirect(
        302,
        `/contact-managers/remove-contact-manager/${contactManagerUserId}/?${searchParams.toString()}`
      )
    }

    const searchParams = new URLSearchParams({ fatal: '1' })

    return res.redirect(
      302,
      `/contact-managers/remove-contact-manager/${contactManagerUserId}/?${searchParams.toString()}`
    )
  }
})
