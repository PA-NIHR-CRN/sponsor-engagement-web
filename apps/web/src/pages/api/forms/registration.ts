import { authService } from '@nihr-ui/auth'
import { logger } from '@nihr-ui/logger'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ZodError } from 'zod'

import { prismaClient } from '@/lib/prisma'
import type { RegistrationInputs } from '@/utils/schemas'
import { registrationSchema } from '@/utils/schemas'

/**
 * Next.js API route for handling user registration and creation in Identity Gateway (IDG).
 * This route expects a POST request with registration data and validates it.
 * If registration is successful, it creates a new user in IDG and updates the local user data.
 * If registration fails, it redirects back to the registration page with appropriate error messages.
 *
 * @param req - The HTTP request object containing registration data.
 * @param res - The HTTP response object for sending responses.
 */

export interface ExtendedNextApiRequest extends NextApiRequest {
  body: RegistrationInputs
}

export default async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      throw new Error('Wrong method')
    }

    const { password, registrationToken } = registrationSchema.parse(req.body)

    // Find contact information associated with the given registrationToken
    const user = await prismaClient.user.findFirst({
      where: {
        registrationToken,
        isDeleted: false,
      },
    })

    if (!user?.email) {
      throw new Error(`No email found associated with the registrationToken ${registrationToken}`)
    }

    // Create a new user in IDG
    const createUserResponse = await authService.createUser({
      password,
      emails: [user.email],
    })

    if (createUserResponse.success) {
      if (!createUserResponse.data.id) {
        throw new Error('Missing data from IDG createUser response')
      }

      const { userName: identityGatewayId } = createUserResponse.data

      logger.info('Created user in IDG, updating user in local applicaton')

      const { id } = await prismaClient.user.update({
        where: {
          email: user.email,
          isDeleted: false,
        },
        data: {
          identityGatewayId,
          registrationConfirmed: true,
          registrationToken: null,
        },
      })

      logger.info(
        `Updated local user ${id} with identityGatewayId ${identityGatewayId}, now redirecting to confirmation page`
      )

      return res.redirect(302, `/register/confirmation`)
    }

    throw new Error('Failed to create user in IDG')
  } catch (error) {
    logger.error(error)

    const { registrationToken } = req.body

    if (error instanceof ZodError) {
      // Create an object containing the Zod validation errors
      const fieldErrors: Record<string, string> = Object.fromEntries(
        error.errors.map(({ path: [fieldId], message }) => [`${fieldId}Error`, message])
      )

      delete fieldErrors.registrationToken

      const searchParams = new URLSearchParams({ ...fieldErrors, registrationToken })
      return res.redirect(302, `/register?${searchParams.toString()}`)
    }

    const searchParams = new URLSearchParams({ fatal: '1', ...(registrationToken && { registrationToken }) })
    return res.redirect(302, `/register?${searchParams.toString()}`)
  }
}
