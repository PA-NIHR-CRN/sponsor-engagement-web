import { Container } from '@nihr-ui/frontend'
import { NextSeo } from 'next-seo'

import { ConfirmationPage } from '@/components/organisms/ConfirmationPage/ConfirmationPage'

export default function ClosureConfirmation() {
    return (
        <Container>
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