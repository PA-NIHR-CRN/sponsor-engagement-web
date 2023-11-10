import crypto from 'node:crypto'
import type { NextApiRequest } from 'next'
import { ZodError } from 'zod'
import { logger } from '@nihr-ui/logger'
import { emailService } from '@nihr-ui/email'
import type { OrganisationAddInputs } from '../../../utils/schemas'
import { organisationAddSchema } from '../../../utils/schemas'
import { withApiHandler } from '../../../utils/withApiHandler'
import { getOrganisationById } from '../../../lib/organisations'
import { Prisma, prismaClient } from '../../../lib/prisma'
import { Roles } from '../../../constants'
import { EXTERNAL_CRN_URL, SIGN_IN_PAGE, SUPPORT_PAGE } from '../../../constants/routes'
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
          create: {
            createdBy: { connect: { id: contactManagerUserId } },
            updatedBy: { connect: { id: contactManagerUserId } },
            user: {
              connectOrCreate: {
                // If a user does not exist, create the user and set a registration token
                create: {
                  email: emailAddress,
                  identityGatewayId: '',
                  registrationToken,
                  registrationConfirmed: false,
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
                where: {
                  email: emailAddress,
                },
              },
            },
          },
        },
      },
    })

    const isNewUser = users.some((user) => {
      const { email, registrationConfirmed, registrationToken: token } = user.user
      return email === emailAddress && Boolean(token) && registrationConfirmed === false
    })

    if (isNewUser) {
      await emailService.sendEmail({
        to: emailAddress,
        subject: 'NIHR CRN has invited you to review and assess research studies',
        templateName: 'contact-assigned',
        templateData: {
          organisationName,
          crnLink: EXTERNAL_CRN_URL,
          signInLink: getAbsoluteUrl(`${SIGN_IN_PAGE}?registrationToken=${registrationToken}`),
          requestSupportLink: getAbsoluteUrl(SUPPORT_PAGE),
        },
      })
    }

    return res.redirect(302, `/organisations/${organisationId}?success=1`)
  } catch (error) {
    logger.error(error)

    const organisationId = req.body.organisationId

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        logger.info('There is a unique constraint violation, a new user cannot be created with this email')
        const searchParams = new URLSearchParams({ fatal: '2' })
        return res.redirect(302, `/organisations/${organisationId}/?${searchParams.toString()}`)
      }
    }

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

    const searchParams = new URLSearchParams({ fatal: '1' })

    return res.redirect(302, `/organisations/${organisationId}/?${searchParams.toString()}`)
  }
})
