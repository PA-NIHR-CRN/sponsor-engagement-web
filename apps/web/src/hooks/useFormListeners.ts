import type { ParsedUrlQueryInput } from 'node:querystring'

import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

export const useFormListeners = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleRouteChangeStart = useCallback(
    (newUrl: string) => {
      const url = new URL(`${window.location.origin}${newUrl}`)
      if (url.pathname.endsWith(router.pathname)) setIsLoading(true)
    },
    [router.pathname]
  )

  const handleRouteChangeComplete = useCallback(() => {
    setIsLoading(false)
  }, [])

  const handleFilterChange = (formValues: Record<string, unknown>) => {
    // Avoid multiple submissions
    if (isLoading) {
      return
    }

    void router.push(
      {
        pathname: router.pathname,
        query: formValues as ParsedUrlQueryInput,
      },
      undefined,
      { scroll: false }
    )
  }

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [router, handleRouteChangeStart, handleRouteChangeComplete])

  return { isLoading, handleFilterChange }
}
