import crypto from 'node:crypto'
import type { NextApiRequest } from 'next'
import { ZodError } from 'zod'
import { logger } from '@nihr-ui/logger'
import { emailService } from '@nihr-ui/email'
import { emailTemplates } from '@nihr-ui/templates/sponsor-engagement'
import type { OrganisationAddInputs } from '../../../utils/schemas'
import { organisationAddSchema } from '../../../utils/schemas'
import { withApiHandler } from '../../../utils/withApiHandler'
import { getOrganisationById } from '../../../lib/organisations'
import { prismaClient } from '../../../lib/prisma'
import { Roles } from '../../../constants'
import {
  EXTERNAL_CRN_TERMS_CONDITIONS_URL,
  EXTERNAL_CRN_URL,
  SIGN_IN_PAGE,
  SUPPORT_PAGE,
} from '../../../constants/routes'
import { getAbsoluteUrl } from '../../../utils/email'

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: OrganisationAddInputs
}

export default withApiHandler<ExtendedNextApiRequest>(Roles.ContactManager, async (req, res, session) => {
  try {
    if (req.method !== 'POST') {
      throw new Error('Wrong method')
    }

    const { emailAddress, organisationId } = organisationAddSchema.parse(req.body)

    const organisation = await getOrganisationById(Number(organisationId))

    if (!organisation) {
      throw new Error('No organisation found')
    }

    // Get the sponsor contact sysref id from the database
    const { id: roleId } = await prismaClient.sysRefRole.findFirstOrThrow({
      where: {
        name: 'SponsorContact',
        isDeleted: false,
      },
    })

    const {
      user: { id: contactManagerUserId },
    } = session

    const registrationToken = crypto.randomBytes(24).toString('hex')

    // Get existing user organisation record
    const userOrganisation = await prismaClient.userOrganisation.findFirst({
      where: {
        user: { email: emailAddress },
        organisation: { id: organisation.id },
      },
    })

    if (userOrganisation && !userOrganisation.isDeleted) {
      logger.error(
        'Tried to add contact with email %s to organisation %s, but active relationship already exists',
        emailAddress,
        organisation.name
      )
      const searchParams = new URLSearchParams({ fatal: '2' })
      return res.redirect(302, `/organisations/${organisationId}/?${searchParams.toString()}`)
    }

    if (userOrganisation) {
      logger.info('Re-adding contact with email %s to organisation %s', emailAddress, organisation.name)
    }

    // Add user to organisation
    const { name: organisationName, users } = await prismaClient.organisation.update({
      where: {
        id: Number(organisationId),
      },
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
      data: {
        users: {
          ...(userOrganisation && {
            update: {
              where: {
                id: userOrganisation.id,
              },
              data: {
                isDeleted: false,
                updatedBy: { connect: { id: contactManagerUserId } },
              },
            },
          }),
          ...(!userOrganisation && {
            create: {
              createdBy: { connect: { id: contactManagerUserId } },
              updatedBy: { connect: { id: contactManagerUserId } },
              user: {
                connectOrCreate: {
                  // If a user does not exist, create the user and set a registration token
                  create: {
                    email: emailAddress,
                    registrationToken,
                    registrationConfirmed: false,
                  },
                  where: {
                    email: emailAddress,
                  },
                },
              },
            },
          }),
        },
      },
    })

    await prismaClient.user.update({
      where: {
        email: emailAddress,
      },
      data: {
        roles: {
          // If a user is not assigned the sponsor contact role, assign it
          createMany: {
            data: {
              roleId,
              createdById: contactManagerUserId,
              updatedById: contactManagerUserId,
            },
          },
        },
      },
    })

    const isNewUser = users.some((user) => {
      const { email, registrationConfirmed, registrationToken: token } = user.user
      return email === emailAddress && Boolean(token) && registrationConfirmed === false
    })

    const savedRegistrationToken = users.find((user) => user.user.email === emailAddress)?.user.registrationToken

    await emailService.sendEmail({
      to: emailAddress,
      subject: 'Assess the progress of your studies',
      htmlTemplate: emailTemplates['contact-assigned.html.hbs'],
      textTemplate: emailTemplates['contact-assigned.text.hbs'],
      templateData: {
        organisationName,
        crnLink: EXTERNAL_CRN_URL,
        signInLink: getAbsoluteUrl(`${SIGN_IN_PAGE}${isNewUser ? `?registrationToken=${savedRegistrationToken}` : ``}`),
        requestSupportLink: getAbsoluteUrl(SUPPORT_PAGE),
        termsAndConditionsLink: EXTERNAL_CRN_TERMS_CONDITIONS_URL,
      },
    })

    return res.redirect(302, `/organisations/${organisationId}?success=1`)
  } catch (error) {
    logger.error(error)

    const organisationId = req.body.organisationId

    if (error instanceof ZodError) {
      // Create an object containing the Zod validation errors
      const fieldErrors: Record<string, string> = Object.fromEntries(
        error.errors.map(({ path: [fieldId], message }) => [`${fieldId}Error`, message])
      )

      // Insert the original values
      Object.keys(organisationAddSchema.shape).forEach((field) => {
        if (req.body[field]) {
          fieldErrors[field] = req.body[field] as string
        }
      })

      delete fieldErrors.organisationId

      const searchParams = new URLSearchParams({ ...fieldErrors })

      return res.redirect(302, `/organisations/${organisationId}/?${searchParams.toString()}`)
    }

    if ((error as Error).stack?.includes('MessageRejected')) {
      const searchParams = new URLSearchParams({ fatal: '3' })
      return res.redirect(302, `/organisations/${organisationId}/?${searchParams.toString()}`)
    }

    const searchParams = new URLSearchParams({ fatal: '1' })

    return res.redirect(302, `/organisations/${organisationId}/?${searchParams.toString()}`)
  }
})
