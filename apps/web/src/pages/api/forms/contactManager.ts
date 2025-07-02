import crypto from 'node:crypto'

import { emailService } from '@nihr-ui/email'
import { logger } from '@nihr-ui/logger'
import { emailTemplates } from '@nihr-ui/templates/sponsor-engagement'
import type { NextApiRequest } from 'next'
import { ZodError } from 'zod'

import { Roles } from '@/constants'
import { MANAGE_CONTACT_MANAGERS_PAGE, SIGN_IN_PAGE } from '@/constants/routes'
import { prismaClient } from '@/lib/prisma'
import { getAbsoluteUrl } from '@/utils/email'
import type { ContactManagerAddInputs } from '@/utils/schemas'
import { contactManagerAddSchema } from '@/utils/schemas'
import { withApiHandler } from '@/utils/withApiHandler'

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: ContactManagerAddInputs
}

export default withApiHandler<ExtendedNextApiRequest>([Roles.ContactManager], async (req, res, session) => {
  try {
    if (req.method !== 'POST') {
      throw new Error('Wrong method')
    }

    const { emailAddress } = contactManagerAddSchema.parse(req.body)

    // Get the contact manager sysref id from the database
    const { id: roleId } = await prismaClient.sysRefRole.findFirstOrThrow({
      where: {
        name: 'ContactManager',
        isDeleted: false,
      },
    })

    const {
      user: { id: requestedByUserId },
    } = session

    const registrationToken = crypto.randomBytes(24).toString('hex')

    let existingUser = await prismaClient.user.findUnique({
      include: { roles: true },
      where: {
        email: emailAddress,
      },
    })

    if (existingUser === null) {
      existingUser = await prismaClient.user.create({
        include: { roles: true },
        data: {
          email: emailAddress,
        },
      })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison -- false positive for constant in conditional
    } else if (existingUser.roles.find((x) => x.roleId === Roles.ContactManager && x.isDeleted === false)) {
      const searchParams = new URLSearchParams({ fatal: '4' })
      return res.redirect(302, `${MANAGE_CONTACT_MANAGERS_PAGE}?${searchParams.toString()}`)
    }

    const shouldUpdateRegistrationToken = (existingUser.identityGatewayId ?? null) === null

    const isPreviousContactManager =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison -- false positive for constant in conditional
      existingUser.roles.find((x) => x.roleId === Roles.ContactManager && x.isDeleted === true)
    if (isPreviousContactManager) {
      logger.info(`Re-adding contact manager role for ${existingUser.email}`)
    }

    const user = await prismaClient.user.update({
      where: {
        email: emailAddress,
      },
      data: {
        ...(shouldUpdateRegistrationToken && {
          registrationToken,
          registrationConfirmed: false,
        }),
        roles: {
          ...(!isPreviousContactManager && {
            create: {
              roleId,
              createdById: requestedByUserId,
              updatedById: requestedByUserId,
              isDeleted: false,
            },
          }),
          ...(isPreviousContactManager && {
            update: {
              where: {
                userId_roleId: {
                  roleId,
                  userId: existingUser.id,
                },
                isDeleted: true,
              },
              data: {
                updatedById: requestedByUserId,
                isDeleted: false,
              },
            },
          }),
        },
      },
    })

    const isNewUser = Boolean(user.registrationToken) && !user.registrationConfirmed

    const savedRegistrationToken = user.registrationToken

    await emailService.sendEmail({
      to: emailAddress,
      subject: 'NIHR RDN has invited you to be a Contact Manager for the Sponsor Engagement tool',
      htmlTemplate: emailTemplates['contact-manager-assigned.html.hbs'],
      textTemplate: emailTemplates['contact-manager-assigned.text.hbs'],
      templateData: {
        signInLink: getAbsoluteUrl(`${SIGN_IN_PAGE}${isNewUser ? `?registrationToken=${savedRegistrationToken}` : ``}`),
      },
    })

    return res.redirect(302, `${MANAGE_CONTACT_MANAGERS_PAGE}?success=1`)
  } catch (error) {
    logger.error(error)

    if (error instanceof ZodError) {
      // Create an object containing the Zod validation errors
      const fieldErrors: Record<string, string> = Object.fromEntries(
        error.errors.map(({ path: [fieldId], message }) => [`${fieldId}Error`, message])
      )

      // Insert the original values
      Object.keys(contactManagerAddSchema.shape).forEach((field) => {
        if (req.body[field]) {
          fieldErrors[field] = req.body[field] as string
        }
      })

      delete fieldErrors.emailAddress

      const searchParams = new URLSearchParams({ ...fieldErrors })

      return res.redirect(302, `${MANAGE_CONTACT_MANAGERS_PAGE}?${searchParams.toString()}`)
    }

    if ((error as Error).stack?.includes('MessageRejected')) {
      const searchParams = new URLSearchParams({ fatal: '3' })
      return res.redirect(302, `${MANAGE_CONTACT_MANAGERS_PAGE}?${searchParams.toString()}`)
    }

    const searchParams = new URLSearchParams({ fatal: '1' })

    return res.redirect(302, `${MANAGE_CONTACT_MANAGERS_PAGE}?${searchParams.toString()}`)
  }
})
