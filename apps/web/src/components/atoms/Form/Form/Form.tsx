import { logger } from '@nihr-ui/logger'
import axios from 'axios'
import type { NextApiResponse } from 'next'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import type { FieldValues, FormProps as HookFormProps, UseFormHandleSubmit } from 'react-hook-form'

import { FORM_ERRORS } from '@/constants/forms'

interface FormProps<T extends FieldValues> {
  action: string
  method: HookFormProps<T>['method']
  handleSubmit: UseFormHandleSubmit<T>
  children: ReactNode
  onError: (message: string) => void
  onSuccess?: (data: T) => void
}

interface FormApiResponse extends NextApiResponse {
  request: {
    responseURL: string
  }
}

export function Form<T extends FieldValues>({
  action,
  method,
  children,
  onError,
  onSuccess,
  handleSubmit,
}: FormProps<T>) {
  const router = useRouter()

  const redirectToFatalError = (code = 1) => {
    onError(FORM_ERRORS[code])
    // Ensure any existing URL state is cleared first
    const oldUrl = new URL(router.asPath, document.location.href)
    const newUrl = new URL(oldUrl.pathname, document.location.href)
    newUrl.searchParams.append('fatal', String(code))
    void router.replace(newUrl.toString())
  }

  const onValid = async (values: T) => {
    try {
      const {
        request: { responseURL },
      } = await axios.post<null, FormApiResponse>(action, values)

      if (!responseURL) {
        redirectToFatalError()
        return
      }

      const redirectUrl = new URL(responseURL)

      // Fatal error redirect
      if (redirectUrl.searchParams.has('fatal')) {
        redirectToFatalError(Number(redirectUrl.searchParams.get('fatal')))
        return
      }

      // Confirmation page redirect
      if (redirectUrl.pathname.includes('/confirmation')) {
        return router.push(redirectUrl.pathname)
      }

      // Misc error redirect
      void router.replace(`${redirectUrl.pathname}${redirectUrl.search}`)

      if (onSuccess) {
        onSuccess(values)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.info(`Form component failed to submit due to ${error.message}`)
      } else {
        logger.error(error)
      }
      redirectToFatalError()
    }
  }

  const onInvalid = () => {
    const url = new URL(router.asPath, document.location.href)
    url.searchParams.delete('fatal')
    void router.replace(url, undefined)
    logger.error('Form submission failed - %s', url.toString())
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- required by RHF
    <form action={action} method={method} noValidate onSubmit={handleSubmit(onValid, onInvalid)}>
      {children}
    </form>
  )
}
