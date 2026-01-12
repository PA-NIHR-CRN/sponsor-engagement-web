import crypto from 'node:crypto'

import { emailService } from '@nihr-ui/email'
import { logger } from '@nihr-ui/logger'
import { emailTemplates } from '@nihr-ui/templates/sponsor-engagement'
import type { NextApiRequest } from 'next'
import { ZodError } from 'zod'

import { Roles, UserOrganisationInviteStatus } from '@/constants'
import { EXTERNAL_CRN_TERMS_CONDITIONS_URL, EXTERNAL_CRN_URL, SIGN_IN_PAGE, SUPPORT_PAGE } from '@/constants/routes'
import { getOrganisationById } from '@/lib/organisations'
import { prismaClient } from '@/lib/prisma'
import { getAbsoluteUrl } from '@/utils/email'
import { hasOrganisationAccess } from '@/utils/organisations'
import type { OrganisationAddInputs } from '@/utils/schemas'
import { organisationAddSchema } from '@/utils/schemas'
import { withApiHandler } from '@/utils/withApiHandler'

import { addUserToGroup, isUserEligibleForOdpRole } from './registration'

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: OrganisationAddInputs
}

export default withApiHandler<ExtendedNextApiRequest>(
  [Roles.ContactManager, Roles.SponsorContact],
  async (req, res, session) => {
    try {
      if (req.method !== 'POST') {
        throw new Error('Wrong method')
      }
      const { ODP_ROLE_GROUP_ID = '' } = process.env

      const { emailAddress, organisationId } = organisationAddSchema.parse(req.body)

      const organisation = await getOrganisationById(Number(organisationId))

      if (!organisation) {
        throw new Error('No organisation found')
      }

      if (!hasOrganisationAccess(session.user.roles, session.user.organisations, organisation.id)) {
        throw new Error(`User does not have access to this organisation: ${organisation.id}`)
      }

      // Get the sponsor contact sysref id from the database
      const { id: roleId } = await prismaClient.sysRefRole.findFirstOrThrow({
        where: {
          name: 'SponsorContact',
          isDeleted: false,
        },
      })

      const {
        user: { id: requestedByUserId },
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

      const existingUser = await prismaClient.user.findUnique({
        include: { roles: true },
        where: {
          email: emailAddress,
        },
      })

      const shouldUpdateRegistrationToken = (existingUser?.identityGatewayId ?? null) === null

      // Add user to organisation
      const { name: organisationName, users } = await prismaClient.organisation.update({
        where: {
          id: Number(organisationId),
        },
        include: {
          users: {
            where: {
              user: {
                email: emailAddress,
              },
            },
            select: {
              id: true,
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
                  updatedBy: { connect: { id: requestedByUserId } },
                },
              },
            }),
            ...(!userOrganisation && {
              create: {
                createdBy: { connect: { id: requestedByUserId } },
                updatedBy: { connect: { id: requestedByUserId } },
                user: {
                  connectOrCreate: {
                    // If a user does not exist, create the user. We'll set registration token later.
                    create: {
                      email: emailAddress,
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

      const userOrganisationId = users[0].id

      const isPreviousSponsorContact =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison -- false positive and nullable is needed
        existingUser && existingUser.roles.some((x) => x.roleId === Roles.SponsorContact && x.isDeleted === true)

      if (isPreviousSponsorContact) {
        logger.info(`Re-adding sponsor contact role for ${existingUser.email}`)
      }

      const roleMutation = isPreviousSponsorContact
        ? {
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
          }
        : {
            createMany: {
              data: {
                roleId,
                createdById: requestedByUserId,
                updatedById: requestedByUserId,
              },
              skipDuplicates: true,
            },
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
          roles: roleMutation,
        },
      })

      const isNewUser = Boolean(user.registrationToken) && !user.registrationConfirmed

      const savedRegistrationToken = user.registrationToken

      const isEligibleForOdpRole = await isUserEligibleForOdpRole(user.id)
      if (isEligibleForOdpRole) {
        await addUserToGroup(user.email, ODP_ROLE_GROUP_ID)
      }

      const { messageId } = await emailService.sendEmail({
        to: emailAddress,
        subject: 'Assess the progress of your studies',
        htmlTemplate: emailTemplates['contact-assigned.html.hbs'],
        textTemplate: emailTemplates['contact-assigned.text.hbs'],
        templateData: {
          organisationName,
          rdnLink: EXTERNAL_CRN_URL,
          signInLink: getAbsoluteUrl(
            `${SIGN_IN_PAGE}${isNewUser ? `?registrationToken=${savedRegistrationToken}` : ``}`
          ),
          requestSupportLink: getAbsoluteUrl(SUPPORT_PAGE),
          termsAndConditionsLink: EXTERNAL_CRN_TERMS_CONDITIONS_URL,
        },
      })

      // Get the invitation status ref
      const { id: invitationStatusId } = await prismaClient.sysRefInvitationStatus.findFirstOrThrow({
        where: {
          name: UserOrganisationInviteStatus.PENDING,
        },
      })

      await prismaClient.userOrganisationInvitation.create({
        data: {
          messageId,
          timestamp: new Date(),
          status: {
            connect: {
              id: invitationStatusId,
            },
          },
          userOrganisation: {
            connect: {
              id: userOrganisationId,
            },
          },
          sentBy: {
            connect: {
              id: requestedByUserId,
            },
          },
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
  }
)
