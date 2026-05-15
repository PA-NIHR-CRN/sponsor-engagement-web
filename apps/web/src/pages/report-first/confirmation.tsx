import { Container } from '@nihr-ui/frontend'
import { NextSeo } from 'next-seo'

import { ConfirmationPage } from '@/components/organisms/ConfirmationPage/ConfirmationPage'

export default function ReportFirstConfirmation() {
    return (
        <Container>
            <div className="lg:flex lg:gap-6">
                <div className="w-full">
                    <h2 className="govuk-heading-l govuk-!-margin-bottom-0">Report a 'First'</h2>

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