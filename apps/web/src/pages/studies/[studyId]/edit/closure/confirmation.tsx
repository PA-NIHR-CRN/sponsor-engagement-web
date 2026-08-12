import { Container } from '@nihr-ui/frontend'
import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import type { ReactElement} from 'react';
import { useEffect } from 'react'

import { RootLayout } from '@/components/organisms'
import { ConfirmationPage } from '@/components/organisms/ConfirmationPage/ConfirmationPage'
import { Roles } from '@/constants/auth'
import { PAGE_TITLE } from '@/constants/editStudyForm'
import { closureDraftStorageKey } from '@/utils/storageKeys'
import { withServerSideProps } from '@/utils/withServerSideProps'

export function ClearClosureDraftOnMount() {
    const router = useRouter()
    const { studyId } = router.query

    useEffect(() => {
        let id: string | undefined

        if (typeof studyId === 'string') {
            id = studyId
        } else if (Array.isArray(studyId)) {
            id = studyId[0]
        } else {
            id = undefined
        }
        if (!id) return

        try {
            sessionStorage.removeItem(closureDraftStorageKey(id))
        } catch {
        }
    }, [studyId])

    return null
}

export default function ClosureConfirmation() {
    return (
        <Container>
            <ClearClosureDraftOnMount />
            <div className="lg:flex lg:gap-6">
                <div className="w-full">
                    <h2 className="govuk-heading-l govuk-!-margin-bottom-0">Closure of study</h2>

                    <NextSeo title="Closure of study - Confirmation" />

                    <ConfirmationPage
                        actions={[
                            { href: '/studies', text: 'Back to studies' },
                        ]}
                        confirmationText="Study is now closed"
                        title="Submission complete"
                    />
                </div>
            </div>
        </Container>
    )
}

ClosureConfirmation.getLayout = function getLayout(page: ReactElement, { user }: any) {
  return <RootLayout heading={PAGE_TITLE} user={user}>{page}</RootLayout>
}

export const getServerSideProps = withServerSideProps([Roles.SponsorContact], async (context, session) => {
  return {
    props: {
      user: session.user,
    },
  }
})