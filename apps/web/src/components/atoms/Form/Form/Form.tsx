import axios from 'axios'
import { useRouter } from 'next/router'
import type { ReactNode } from 'react'
import type { FieldValues, FormProps as HookFormProps, UseFormHandleSubmit } from 'react-hook-form'
import type { NextApiResponse } from 'next'
import { logger } from '@nihr-ui/logger'
import { FORM_ERRORS } from '../../../../constants/forms'
// import { logger } from '@/lib/logger'

interface FormProps<T extends FieldValues> {
  action: string
  method: HookFormProps<T>['method']
  handleSubmit: UseFormHandleSubmit<T>
  children: ReactNode
  onError: (message: string) => void
}

interface FormApiResponse extends NextApiResponse {
  request: {
    responseURL: string
  }
}

export function Form<T extends FieldValues>({ action, method, children, onError, handleSubmit }: FormProps<T>) {
  const router = useRouter()

  const redirectToFatalError = () => {
    onError(FORM_ERRORS.fatal)
    void router.replace(`${router.asPath}?fatal=1`)
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
        redirectToFatalError()
        return
      }

      // Confirmation page redirect
      if (redirectUrl.pathname.includes('/confirmation')) {
        return router.push(redirectUrl.pathname)
      }

      // Misc error redirect
      void router.replace(`${redirectUrl.pathname}${redirectUrl.search}`)
    } catch (error) {
      // logger.error('handleSubmit failed', error)
      redirectToFatalError()
    }
  }

  const onInvalid = () => {
    logger.error('Form submission failed')
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises -- required by RHF
    <form action={action} method={method} noValidate onSubmit={handleSubmit(onValid, onInvalid)}>
      {children}
    </form>
  )
}
