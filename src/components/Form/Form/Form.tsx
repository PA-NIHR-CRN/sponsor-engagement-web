import axios from 'axios'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
import { FieldValues, FormProps, UseFormHandleSubmit } from 'react-hook-form'

import { FORM_ERRORS } from '@/constants/forms'
import { logger } from '@/lib/logger'

type Props<T extends FieldValues> = {
  action: string
  method: FormProps<T>['method']
  handleSubmit: UseFormHandleSubmit<T>
  children: ReactNode
  onError: (message: string) => void
}

export function Form<T extends FieldValues>({ action, method, children, onError, handleSubmit }: Props<T>) {
  const router = useRouter()

  const redirectToFatalError = () => {
    onError(FORM_ERRORS.fatal)
    router.replace(`${router.asPath}?fatal=1`)
  }

  const onValid = async (values: T) => {
    try {
      const {
        request: { responseURL },
      } = await axios.post(action, values)

      if (!responseURL) {
        return redirectToFatalError()
      }

      const redirectUrl = new URL(responseURL)

      // Fatal error redirect
      if (redirectUrl.searchParams.has('fatal')) {
        return redirectToFatalError()
      }

      // Confirmation page redirect
      if (redirectUrl.pathname.includes('/confirmation')) {
        return router.push(redirectUrl.pathname)
      }

      // Misc error redirect
      router.replace(`${redirectUrl.pathname}${redirectUrl.search}`)
    } catch (error) {
      logger.error('handleSubmit failed', error)
      redirectToFatalError()
    }
  }

  const onInvalid = () => logger.error('Form submission failed')

  return (
    <form noValidate action={action} method={method} onSubmit={handleSubmit(onValid, onInvalid)}>
      {children}
    </form>
  )
}
