import crypto from 'node:crypto'

import { authService } from '@nihr-ui/auth'
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

// ---------- Helper: look up IDG and sync local user ----------
async function lookupIdgAndSyncLocalUser(emailAddress: string) {
  let identityGatewayId: string | null = null
  let idgUserFound = false

  const getUserResponse = await authService.getUser(emailAddress)

  if (getUserResponse.success) {
    const {
      data: { totalResults, Resources },
    } = getUserResponse

    if (totalResults > 0 && Resources) {
      const match = Resources.find((r) => Boolean(r.userName))
      identityGatewayId = match?.userName ?? null
      idgUserFound = identityGatewayId !== null

      if (idgUserFound) {
        logger.info('Found IDG account matching email %s', emailAddress)
      }
    } else {
      logger.info('No IDG account found for %s — treating as new user', emailAddress)
    }
  }

  let localUser = await prismaClient.user.findUnique({
    where: { email: emailAddress },
  })

  if (!localUser) {
    localUser = await prismaClient.user.create({
      data: {
        email: emailAddress,
        ...(idgUserFound && {
          identityGatewayId,
          registrationConfirmed: true,
          registrationToken: null,
        }),
      },
    })
  } else if (idgUserFound) {
    localUser = await prismaClient.user.update({
      where: { email: emailAddress },
      data: {
        identityGatewayId,
        registrationConfirmed: true,
        registrationToken: null,
      },
    })
  }

  const isNewToIDG = !idgUserFound
  return { localUser, isNewToIDG, identityGatewayId }
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

      const { isNewToIDG } = await lookupIdgAndSyncLocalUser(emailAddress)

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
                  connect: { email: emailAddress },
                },
              },
            }),
          },
        },
      })

      const userOrganisationId = users[0].id

      let registrationToken: string | null = null
      if (isNewToIDG) {
        registrationToken = crypto.randomBytes(24).toString('hex')

        await prismaClient.user.update({
          where: {
            email: emailAddress,
          },
          data: {
            registrationToken,
            registrationConfirmed: false,
          },
        })
      }

      const user = await prismaClient.user.update({
        where: { email: emailAddress },
        data: {
          roles: {
            // If a user is not assigned the sponsor contact role, assign it
            createMany: {
              data: {
                roleId,
                createdById: requestedByUserId,
                updatedById: requestedByUserId,
              },
              skipDuplicates: true,
            },
          },
        },
      })

      const isEligibleForOdpRole = await isUserEligibleForOdpRole(user.id)
      if (isEligibleForOdpRole) {
        await addUserToGroup(user.email, ODP_ROLE_GROUP_ID)
      }

      const isNewUser = Boolean(registrationToken)
      const signInLink = getAbsoluteUrl(`${SIGN_IN_PAGE}${isNewUser ? `?registrationToken=${registrationToken}` : ''}`)

      const { messageId } = await emailService.sendEmail({
        to: emailAddress,
        subject: 'Assess the progress of your studies',
        htmlTemplate: emailTemplates['contact-assigned.html.hbs'],
        textTemplate: emailTemplates['contact-assigned.text.hbs'],
        templateData: {
          organisationName,
          rdnLink: EXTERNAL_CRN_URL,
          signInLink,
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
