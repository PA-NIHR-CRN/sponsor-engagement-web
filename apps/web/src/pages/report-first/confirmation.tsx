import { Container } from '@nihr-ui/frontend'
import { NextSeo } from 'next-seo'

import { ConfirmationPage } from '@/components/organisms/ConfirmationPage/ConfirmationPage'
import { ReactElement } from 'react'
import { RootLayout } from '@/components/organisms/Layout/RootLayout'
import { withServerSideProps } from '@/utils/withServerSideProps'
import { Roles } from '@/constants/auth'

export default function ReportFirstConfirmation() {
    return (
        <Container>
            <div className="lg:flex lg:gap-6">
                <div className="w-full">
                    <h2 className="govuk-heading-l govuk-!-margin-bottom-0">Report a &apos;First&apos;</h2>

                    <NextSeo title="Report a First - Confirmation" />

                    <ConfirmationPage
                        actions={[
                            { href: '/studies', text: 'Back to studies' },
                        ]}
                        title="Submission complete"
                     />
                </div>
            </div>
        </Container>
    )
}

ReportFirstConfirmation.getLayout = function getLayout(page: ReactElement, { user }: any) {
  return <RootLayout user={user}>{page}</RootLayout>
}

export const getServerSideProps = withServerSideProps([Roles.SponsorContact], async (context, session) => {
  return {
    props: {
      user: session.user,
    },
  }
})