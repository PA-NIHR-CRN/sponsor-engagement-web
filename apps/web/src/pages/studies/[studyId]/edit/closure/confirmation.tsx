import { Container } from '@nihr-ui/frontend'
import { NextSeo } from 'next-seo'

import { ConfirmationPage } from '@/components/organisms/ConfirmationPage/ConfirmationPage'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { closureDraftStorageKey } from '@/utils/storageKeys'

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
                        title="Submission complete"
                        confirmationText="Study is now closed"
                        actions={[
                            { href: '/studies', text: 'Back to studies' },
                        ]}
                    />
                </div>
            </div>
        </Container>
    )
}