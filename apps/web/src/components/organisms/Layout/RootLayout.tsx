import { logger } from '@nihr-ui/logger'
import { useIdle } from '@uidotdev/usehooks'
import { Roboto } from 'next/font/google'
import Router, { useRouter } from 'next/router'
import type { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { Header } from '@/components/molecules'
import { CONTACT_MANAGERS_PAGE, ORGANISATIONS_PAGE, SIGN_OUT_PAGE } from '@/constants/routes'
import { isContactManager, isContactManagerAndSponsorContact, isSponsorContact } from '@/utils/auth'

import type { BreadcrumbConfig } from '../Breadcrumbs/Breadcrumbs'
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs'

export const primaryFont = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-primary',
})

export interface RootLayoutProps {
  children: ReactNode
  heading?: string
  backLink?: ReactNode
  user?: Session['user']
  breadcrumbConfig?: BreadcrumbConfig
}

export function RootLayout({ children, backLink, user, breadcrumbConfig }: RootLayoutProps) {
  const router = useRouter()
  const [sideNavOpen, setSideNavOpen] = useState(false)
  const { data: session } = useSession()
  const activeUser = user ?? session?.user
  const idle = useIdle(session ? session.idleTimeout * 1000 : undefined)
  const userOrganisations = user?.organisations.filter((userOrg) => !userOrg.isDeleted) ?? []
  const groupIconLink =
    userOrganisations.length === 1 ? `${ORGANISATIONS_PAGE}/${userOrganisations[0].organisationId}` : ORGANISATIONS_PAGE

  useEffect(() => {
    if (session && session.error === 'RefreshAccessTokenError') {
      logger.info(`refresh access token request error - logging out`)
      void Router.push(SIGN_OUT_PAGE)
    }
  }, [session])

  useEffect(() => {
    if (idle && session?.idleTimeout) {
      logger.info(`user is idle after ${session.idleTimeout} seconds - logging out`)
      void Router.push(SIGN_OUT_PAGE)
    }
  }, [idle, session])

  // Close menu on route changes
  useEffect(() => {
    setSideNavOpen((isOpen) => isOpen && !isOpen)
  }, [router.asPath])

  useEffect(() => {
    document.body.classList.add('js-enabled')
  }, [])

  return (
    <>
    <a className="govuk-skip-link" data-module="govuk-skip-link" href="#main-content">Skip to main content</a>


<header className="rebranded-cross-service-header govuk-template__header" data-module="one-login-header">
    <div className="rebranded-one-login-header govuk-header" data-one-login-header-nav="">
        <div className="rebranded-one-login-header__container govuk-header__container govuk-width-container">
            <div className="rebranded-one-login-header__logo govuk-header__logo">
                <a aria-label="Go to nihr.ac.uk (opens in new window)" className="rebranded-one-login-header__link rebranded-one-login-header__link--homepage govuk-header__homepage-link" href="https://www.nihr.ac.uk/"
                   rel="noopener" target="_blank">
                    <span className="govuk-header__logotype">
                        <svg data-name="NIHR Core logo" height="33" id="NIHR_Core_logo" viewBox="0 0 1106.85 100" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <style>
                                    {/* .cls-1 {
                                        fill: #fc5d5d;
                                    }

                                    .cls-2 {
                                        fill: #fff;
                                    } */}
                                </style>
                            </defs>
                            <rect className="cls-1" height="100" width="9" x="369.6" />
                            <g>
                                <path className="cls-2" d="M411.65,2.93h11.42l12.66,32.59h.45V2.93h6.72v39.2h-11.54l-12.43-32.54h-.5v32.54h-6.78V2.93Z" />
                                <path className="cls-2" d="M448.81,27.46c0-8.9,5.82-15.4,13.66-15.4,4.93,0,7.62,2.52,8.9,4.31h.5v-3.58h6.61v22.46c0,.78.45,1.29,1.34,1.29h1.29v5.6h-4.98c-2.63,0-3.98-1.79-4.2-3.7h-.5c-1.12,1.79-3.7,4.42-8.79,4.42-7.9,0-13.83-6.5-13.83-15.4ZM471.99,27.51c0-5.82-3.75-9.13-8.23-9.13-4.7,0-8.23,3.7-8.23,9.13s3.64,8.96,8.29,8.96c4.98,0,8.18-3.98,8.18-8.96Z" />
                                <path className="cls-2" d="M487.75,33.34v-14.73h-5.1v-5.82h5.49V4.55h6.27v8.23h8.29v5.82h-8.29v14.67c0,2.07.84,2.97,2.86,2.97h5.1v5.88h-5.15c-5.71,0-9.46-2.58-9.46-8.79Z" />
                                <path className="cls-2" d="M511.24,18.61h-5.15v-5.82h11.76v29.34h-6.61v-23.52ZM510.4,4.11c0-2.3,1.79-4.09,4.2-4.09s4.2,1.79,4.2,4.09-1.79,4.14-4.2,4.14-4.2-1.79-4.2-4.14Z" />
                                <path className="cls-2" d="M522.96,27.46c0-8.74,6.5-15.4,15.51-15.4s15.46,6.66,15.46,15.4-6.5,15.4-15.51,15.4-15.46-6.61-15.46-15.4ZM547.21,27.46c0-5.21-3.64-9.13-8.79-9.13s-8.74,3.92-8.74,9.13,3.64,9.13,8.74,9.13,8.79-3.86,8.79-9.13Z" />
                                <path className="cls-2" d="M559.04,12.79h6.61v3.36h.5c1.29-2.24,3.98-4.09,7.9-4.09,6.44,0,10.53,4.82,10.53,10.86v19.21h-6.61v-17.64c0-3.64-2.58-6.16-5.94-6.16-3.64,0-6.38,2.8-6.38,6.5v17.3h-6.61V12.79Z" />
                                <path className="cls-2" d="M589.29,27.46c0-8.9,5.82-15.4,13.66-15.4,4.93,0,7.62,2.52,8.9,4.31h.5v-3.58h6.61v22.46c0,.78.45,1.29,1.34,1.29h1.29v5.6h-4.98c-2.63,0-3.98-1.79-4.2-3.7h-.5c-1.12,1.79-3.7,4.42-8.79,4.42-7.9,0-13.83-6.5-13.83-15.4ZM612.47,27.51c0-5.82-3.75-9.13-8.23-9.13-4.7,0-8.23,3.7-8.23,9.13s3.64,8.96,8.29,8.96c4.98,0,8.18-3.98,8.18-8.96Z" />
                                <path className="cls-2" d="M624.92,36.31h5.49V6.01h-5.49V.13h12.1v36.18h5.49v5.82h-17.58v-5.82Z" />
                                <path className="cls-2" d="M662.39,35.97h5.54V9.15h-5.54V2.93h17.86v6.22h-5.54v26.82h5.54v6.16h-17.86v-6.16Z" />
                                <path className="cls-2" d="M686.06,12.79h6.61v3.36h.5c1.29-2.24,3.98-4.09,7.9-4.09,6.44,0,10.53,4.82,10.53,10.86v19.21h-6.61v-17.64c0-3.64-2.58-6.16-5.94-6.16-3.64,0-6.38,2.8-6.38,6.5v17.3h-6.61V12.79Z" />
                                <path className="cls-2" d="M716.2,33.79l6.27-1.4c.62,3.08,2.74,4.54,5.82,4.54s4.87-1.18,4.87-3.14c0-5.94-15.9-.95-15.9-12.88,0-4.98,4.14-8.85,10.81-8.85,5.66,0,10.08,2.86,11.14,8.12l-5.88,1.62c-.56-2.58-2.46-3.75-5.26-3.75s-4.48,1.23-4.48,2.97c0,5.49,16.35.34,16.35,12.15,0,5.77-4.59,9.69-11.82,9.69-6.38,0-11.14-3.08-11.93-9.07Z" />
                                <path className="cls-2" d="M747.69,33.34v-14.73h-5.1v-5.82h5.49V4.55h6.27v8.23h8.29v5.82h-8.29v14.67c0,2.07.84,2.97,2.86,2.97h5.1v5.88h-5.15c-5.71,0-9.46-2.58-9.46-8.79Z" />
                                <path className="cls-2" d="M771.18,18.61h-5.15v-5.82h11.76v29.34h-6.61v-23.52ZM770.34,4.11c0-2.3,1.79-4.09,4.2-4.09s4.2,1.79,4.2,4.09-1.79,4.14-4.2,4.14-4.2-1.79-4.2-4.14Z" />
                                <path className="cls-2" d="M787.07,33.34v-14.73h-5.1v-5.82h5.49V4.55h6.27v8.23h8.29v5.82h-8.29v14.67c0,2.07.84,2.97,2.86,2.97h5.1v5.88h-5.15c-5.71,0-9.46-2.58-9.46-8.79Z" />
                                <path className="cls-2" d="M806.34,31.99V12.79h6.61v17.47c0,3.64,2.58,6.16,5.94,6.16,3.64,0,6.38-2.8,6.38-6.5V12.79h6.61v29.34h-6.61v-3.36h-.5c-1.29,2.24-3.98,4.09-7.9,4.09-6.44,0-10.53-4.82-10.53-10.86Z" />
                                <path className="cls-2" d="M840.9,33.34v-14.73h-5.1v-5.82h5.49V4.55h6.27v8.23h8.29v5.82h-8.29v14.67c0,2.07.84,2.97,2.86,2.97h5.1v5.88h-5.15c-5.71,0-9.46-2.58-9.46-8.79Z" />
                                <path className="cls-2" d="M858,27.51c0-9.24,6.78-15.46,14.67-15.46,8.96,0,14.39,6.5,14.39,15.23v1.85h-22.23c.06,4.93,3.25,8.06,8.06,8.06,3.25,0,6.33-1.68,7.39-4.93l6.05,1.46c-1.9,6.1-7.28,9.13-13.38,9.13-8.96,0-14.95-6.38-14.95-15.34ZM880.34,24.32c-.34-3.98-3.64-6.5-7.67-6.5s-7.39,2.97-7.78,6.5h15.46Z" />
                                <path className="cls-2" d="M909.3,18.61h-5.15v-5.82h5.15v-3.86c0-6.22,3.75-8.79,9.41-8.79h4.93v5.77h-4.82c-2.07,0-2.91,1.01-2.91,3.08v3.81h7.9v5.82h-7.9v23.52h-6.61v-23.52Z" />
                                <path className="cls-2" d="M925.63,27.46c0-8.74,6.5-15.4,15.51-15.4s15.46,6.66,15.46,15.4-6.5,15.4-15.51,15.4-15.46-6.61-15.46-15.4ZM949.88,27.46c0-5.21-3.64-9.13-8.79-9.13s-8.74,3.92-8.74,9.13,3.64,9.13,8.74,9.13,8.79-3.86,8.79-9.13Z" />
                                <path className="cls-2" d="M961.71,12.79h6.55v4.31h.45c1.12-2.46,3.98-5.04,7.73-5.04h2.18v6.61h-2.91c-4.82,0-7.39,3.42-7.39,8.96v14.5h-6.61V12.79Z" />
                                <path className="cls-2" d="M411.65,59.93h6.78v16.13h17.3v-16.13h6.78v39.2h-6.78v-16.74h-17.3v16.74h-6.78v-39.2Z" />
                                <path className="cls-2" d="M448.32,84.51c0-9.24,6.78-15.46,14.67-15.46,8.96,0,14.39,6.5,14.39,15.23v1.85h-22.23c.06,4.93,3.25,8.06,8.06,8.06,3.25,0,6.33-1.68,7.39-4.93l6.05,1.46c-1.9,6.1-7.28,9.13-13.38,9.13-8.96,0-14.95-6.38-14.95-15.34ZM470.66,81.32c-.34-3.98-3.64-6.5-7.67-6.5s-7.39,2.97-7.78,6.5h15.46Z" />
                                <path className="cls-2" d="M480.68,84.46c0-8.9,5.82-15.4,13.66-15.4,4.93,0,7.62,2.52,8.9,4.31h.5v-3.58h6.61v22.46c0,.78.45,1.29,1.34,1.29h1.29v5.6h-4.98c-2.63,0-3.98-1.79-4.2-3.7h-.5c-1.12,1.79-3.7,4.42-8.79,4.42-7.9,0-13.83-6.5-13.83-15.4ZM503.87,84.51c0-5.82-3.75-9.13-8.23-9.13-4.7,0-8.23,3.7-8.23,9.13s3.64,8.96,8.29,8.96c4.98,0,8.18-3.98,8.18-8.96Z" />
                                <path className="cls-2" d="M516.32,93.31h5.49v-30.3h-5.49v-5.88h12.1v36.18h5.49v5.82h-17.58v-5.82Z" />
                                <path className="cls-2" d="M539.53,90.34v-14.73h-5.1v-5.82h5.49v-8.23h6.27v8.23h8.29v5.82h-8.29v14.67c0,2.07.84,2.97,2.86,2.97h5.1v5.88h-5.15c-5.71,0-9.46-2.58-9.46-8.79Z" />
                                <path className="cls-2" d="M559.21,57.13h6.61v16.02h.5c1.29-2.18,4.03-4.09,7.95-4.09,6.44,0,10.7,4.82,10.7,10.86v19.21h-6.61v-17.64c0-3.64-2.74-6.16-6.1-6.16-3.58,0-6.44,2.69-6.44,6.33v17.47h-6.61v-42Z" />
                                <path className="cls-2" d="M604.29,84.46c0-8.9,5.82-15.4,13.66-15.4,4.93,0,7.62,2.52,8.9,4.31h.5v-3.58h6.61v22.46c0,.78.45,1.29,1.34,1.29h1.29v5.6h-4.98c-2.63,0-3.98-1.79-4.2-3.7h-.5c-1.12,1.79-3.7,4.42-8.79,4.42-7.9,0-13.83-6.5-13.83-15.4ZM627.47,84.51c0-5.82-3.75-9.13-8.23-9.13-4.7,0-8.23,3.7-8.23,9.13s3.64,8.96,8.29,8.96c4.98,0,8.18-3.98,8.18-8.96Z" />
                                <path className="cls-2" d="M641.67,69.79h6.61v3.36h.5c1.29-2.24,3.98-4.09,7.9-4.09,6.44,0,10.53,4.82,10.53,10.86v19.21h-6.61v-17.64c0-3.64-2.58-6.16-5.94-6.16-3.64,0-6.38,2.8-6.38,6.5v17.3h-6.61v-29.34Z" />
                                <path className="cls-2" d="M671.92,84.46c0-8.74,5.66-15.4,13.55-15.4,5.21,0,7.73,2.8,9.02,4.48h.5v-16.41h6.61v42h-6.5v-3.47h-.5c-1.23,1.51-3.64,4.2-8.74,4.2-7.9,0-13.94-6.5-13.94-15.4ZM695.16,84.51c0-5.82-3.75-9.24-8.29-9.24s-8.29,3.81-8.29,9.24,3.75,9.18,8.34,9.18c4.98,0,8.23-4.2,8.23-9.18Z" />
                                <path className="cls-2" d="M721.2,79.53c0-11.48,8.4-20.33,20.1-20.33,8.85,0,16.02,5.21,18.65,13.72h-7.22c-1.9-4.48-6.33-7.22-11.42-7.22-7.73,0-13.05,5.94-13.05,13.83s5.32,13.89,13.05,13.89c4.98,0,9.52-2.63,11.42-7.22h7.22c-2.58,8.62-9.8,13.72-18.65,13.72-11.76,0-20.1-8.79-20.1-20.38Z" />
                                <path className="cls-2" d="M763.29,84.46c0-8.9,5.82-15.4,13.66-15.4,4.93,0,7.62,2.52,8.9,4.31h.5v-3.58h6.61v22.46c0,.78.45,1.29,1.34,1.29h1.29v5.6h-4.98c-2.63,0-3.98-1.79-4.2-3.7h-.5c-1.12,1.79-3.7,4.42-8.79,4.42-7.9,0-13.83-6.5-13.83-15.4ZM786.47,84.51c0-5.82-3.75-9.13-8.23-9.13-4.7,0-8.23,3.7-8.23,9.13s3.64,8.96,8.29,8.96c4.98,0,8.18-3.98,8.18-8.96Z" />
                                <path className="cls-2" d="M800.68,69.79h6.55v4.31h.45c1.12-2.46,3.98-5.04,7.73-5.04h2.18v6.61h-2.91c-4.82,0-7.39,3.42-7.39,8.96v14.5h-6.61v-29.34Z" />
                                <path className="cls-2" d="M819.47,84.51c0-9.24,6.78-15.46,14.67-15.46,8.96,0,14.39,6.5,14.39,15.23v1.85h-22.23c.06,4.93,3.25,8.06,8.06,8.06,3.25,0,6.33-1.68,7.39-4.93l6.05,1.46c-1.9,6.1-7.28,9.13-13.38,9.13-8.96,0-14.95-6.38-14.95-15.34ZM841.82,81.32c-.34-3.98-3.64-6.5-7.67-6.5s-7.39,2.97-7.78,6.5h15.46Z" />
                                <path className="cls-2" d="M868.98,59.93h13.05c8.12,0,13.38,4.82,13.38,11.93,0,5.49-2.86,9.91-8.18,11.54l9.8,15.74h-8.18l-8.4-14.84h-4.7v14.84h-6.78v-39.2ZM882.08,78.19c3.64,0,6.38-2.18,6.38-6.22,0-3.19-2.18-5.77-6.66-5.77h-6.05v11.98h6.33Z" />
                                <path className="cls-2" d="M899,84.51c0-9.24,6.78-15.46,14.67-15.46,8.96,0,14.39,6.5,14.39,15.23v1.85h-22.23c.06,4.93,3.25,8.06,8.06,8.06,3.25,0,6.33-1.68,7.39-4.93l6.05,1.46c-1.9,6.1-7.28,9.13-13.38,9.13-8.96,0-14.95-6.38-14.95-15.34ZM921.35,81.32c-.34-3.98-3.64-6.5-7.67-6.5s-7.39,2.97-7.78,6.5h15.46Z" />
                                <path className="cls-2" d="M931.07,90.79l6.27-1.4c.62,3.08,2.74,4.54,5.82,4.54s4.87-1.18,4.87-3.14c0-5.94-15.9-.95-15.9-12.88,0-4.98,4.14-8.85,10.81-8.85,5.66,0,10.08,2.86,11.14,8.12l-5.88,1.62c-.56-2.58-2.46-3.75-5.26-3.75s-4.48,1.23-4.48,2.97c0,5.49,16.35.34,16.35,12.15,0,5.77-4.59,9.69-11.82,9.69-6.38,0-11.14-3.08-11.93-9.07Z" />
                                <path className="cls-2" d="M958.1,84.51c0-9.24,6.78-15.46,14.67-15.46,8.96,0,14.39,6.5,14.39,15.23v1.85h-22.23c.06,4.93,3.25,8.06,8.06,8.06,3.25,0,6.33-1.68,7.39-4.93l6.05,1.46c-1.9,6.1-7.28,9.13-13.38,9.13-8.96,0-14.95-6.38-14.95-15.34ZM980.45,81.32c-.34-3.98-3.64-6.5-7.67-6.5s-7.39,2.97-7.78,6.5h15.46Z" />
                                <path className="cls-2" d="M990.47,84.46c0-8.9,5.82-15.4,13.66-15.4,4.93,0,7.62,2.52,8.9,4.31h.5v-3.58h6.61v22.46c0,.78.45,1.29,1.34,1.29h1.29v5.6h-4.98c-2.63,0-3.98-1.79-4.2-3.7h-.5c-1.12,1.79-3.7,4.42-8.79,4.42-7.9,0-13.83-6.5-13.83-15.4ZM1013.65,84.51c0-5.82-3.75-9.13-8.23-9.13-4.7,0-8.23,3.7-8.23,9.13s3.64,8.96,8.29,8.96c4.98,0,8.18-3.98,8.18-8.96Z" />
                                <path className="cls-2" d="M1027.85,69.79h6.55v4.31h.45c1.12-2.46,3.98-5.04,7.73-5.04h2.18v6.61h-2.91c-4.82,0-7.39,3.42-7.39,8.96v14.5h-6.61v-29.34Z" />
                                <path className="cls-2" d="M1046.62,84.46c0-8.57,6.22-15.4,15.18-15.4,6.89,0,12.66,3.86,14.34,10.98l-6.27,1.51c-.78-3.81-3.92-6.22-7.9-6.22-5.1,0-8.57,3.98-8.57,9.13s3.58,9.13,8.62,9.13c3.98,0,7.11-2.35,7.9-6.16l6.27,1.51c-1.68,7.11-7.45,10.92-14.34,10.92-9.13,0-15.23-6.83-15.23-15.4Z" />
                                <path className="cls-2" d="M1081.09,57.13h6.61v16.02h.5c1.29-2.18,4.03-4.09,7.95-4.09,6.44,0,10.7,4.82,10.7,10.86v19.21h-6.61v-17.64c0-3.64-2.74-6.16-6.1-6.16-3.58,0-6.44,2.69-6.44,6.33v17.47h-6.61v-42Z" />
                            </g>
                            <g>
                                <path className="cls-2" d="M96.96,80.57h13.43V19.43h-13.43V0h48.43v19.43h-13.71v61.14h13.71v19.43h-48.43v-19.43Z" />
                                <path className="cls-2" d="M160.49,0h21.29v39.29h38V0h21.14v100h-21.14v-40.71h-38v40.71h-21.29V0Z" />
                                <path className="cls-2" d="M257.89,0h40.93c21,0,35.71,12.57,35.71,31.29,0,13.43-6.29,23.86-17.86,29.29l21.86,39.43h-24.29l-18.43-36.14h-16.64v36.14h-21.29V0ZM299.1,44.57c7.71,0,13.29-4.57,13.29-12.86,0-6.43-4.43-11.86-14-11.86h-19.21v24.71h19.93Z" />
                                <path className="cls-2" d="M0,100V0h21.15l39.39,61.17V0h21.33v100h-18.47L21.15,36.94v63.06H0Z" />
                            </g>
                        </svg>
                    </span>
                </a>
            </div>

            <nav aria-label="NIHR Login" className="rebranded-one-login-header__nav" data-open-className="rebranded-one-login-header__nav--open" id="one-login-header__nav">
                <ul className="rebranded-one-login-header__nav__list">
                        <Header user={activeUser} />
                </ul>
            </nav>

        </div>
    </div>
    <section aria-label="Service information" className="govuk-service-navigation"
             data-module="govuk-service-navigation">
        <div className="govuk-width-container">
            <div className="govuk-service-navigation__container">
                <span className="govuk-service-navigation__service-name">
                    <a className="govuk-service-navigation__link" href="/">
                        Assess my study
                    </a>
                </span>
                <nav aria-label="Menu" className="govuk-service-navigation__wrapper">
                    <button aria-controls="navigation" aria-hidden="true" className="govuk-service-navigation__toggle govuk-js-service-navigation-toggle" hidden type="button">
                        Menu
                    </button>
                    <ul className="govuk-service-navigation__list" id="navigation">
            {isContactManager(user?.roles ?? []) || isContactManagerAndSponsorContact(user?.roles ?? []) ? (
                <li className="govuk-service-navigation__item">
                    <a className="govuk-service-navigation__link" href={ORGANISATIONS_PAGE}>
                        Manage sponsor contacts
                    </a>
                </li>
            ) : null}
            {isSponsorContact(user?.roles ?? []) && userOrganisations.length > 0 ? (
                <li className="govuk-service-navigation__item">
                    <a className="govuk-service-navigation__link" href={groupIconLink}>
                        Manage sponsor contacts
                    </a>
                </li>
            ) : null}
            {isContactManager(user?.roles ?? []) || isContactManagerAndSponsorContact(user?.roles ?? []) ? (
                <li className="govuk-service-navigation__item">
                    <a className="govuk-service-navigation__link" href={CONTACT_MANAGERS_PAGE}>
                        Manage contact managers
                    </a>
                </li>
            ) : null}
                    </ul>
                </nav>
            </div>
        </div>
    </section>

</header>

    <div className="govuk-width-container">
        <main className="govuk-main-wrapper" id="main-content" role="main">
            <div className="-mt-2 govuk-!-margin-bottom-4">
              {backLink}
              <Breadcrumbs {...breadcrumbConfig} />
            </div>
            {children}
        </main>
    </div>
    <footer className="govuk-footer">
    <div className="govuk-width-container">
        <div className="govuk-footer__meta">
            <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
                <h2 className="govuk-visually-hidden">Support links</h2>
                <ul className="govuk-footer__inline-list">
                    <li className="govuk-footer__inline-list-item">
                        <a className="govuk-footer__link"
                           href="https://www.nihr.ac.uk/about-us/who-we-are">
                            About Us
                        </a>
                    </li>
                    <li className="govuk-footer__inline-list-item">
                        <a className="govuk-footer__link"
                           href="https://www.nihr.ac.uk/contact-us">
                            Contact Us
                        </a>
                    </li>
                    <li className="govuk-footer__inline-list-item">
                        <a className="govuk-footer__link"
                           href="@AupOptions.Value.Url">
                            User Agreement
                        </a>
                    </li>
                    <li className="govuk-footer__inline-list-item">
                        <a className="govuk-footer__link"
                           href="https://sites.google.com/nihr.ac.uk/nihr-hub-accessibility/">
                            Accessibility
                        </a>
                    </li>
                    <li className="govuk-footer__inline-list-item">
                        <a className="govuk-footer__link"
                           href="https://docs.google.com/document/d/e/2PACX-1vQYZngeKnd3YVlGMFpaVRtS7EB2X8WEUbM-7rRSwTTztDRN3K9Rtcdcsi9ywKYJUboLmEz66Giw-w30/pub"
                           rel="noopener noreferrer"
                           target="_blank">
                            Acceptable Use Policy
                        </a>
                    </li>
                    <li className="govuk-footer__inline-list-item">
                        <a className="govuk-footer__link"
                           href="/cookies">
                            Cookies
                        </a>
                    </li>
                </ul>
            </div>
            <div className="govuk-footer__meta-item">
                <a className="govuk-footer__link funded-by-dhsc-logo govuk-!-padding-top-0"
                   href="https://www.gov.uk/government/organisations/department-of-health-and-social-care">
                    <img alt="Funded by the Department of Health and Social Care"
                         src="/assets/images/Accessibility-Accrediation-white-2048x597.png" />
                </a>
            </div>
        </div>
    </div>
</footer>
</>
  )
}
