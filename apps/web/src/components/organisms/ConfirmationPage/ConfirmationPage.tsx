export interface ConfirmationAction {
    href: string
    text: string
}

export interface ConfirmationPageProps {
    title: string
    reference?: {
        label?: string
        value: string
    }
    confirmationText?: string
    nextStepsHeading?: string
    nextStepsBody?: string[]
    actions?: ConfirmationAction[]
}

export function ConfirmationPage({
    title,
    reference,
    confirmationText,
    nextStepsHeading = 'What happens next',
    nextStepsBody,
    actions,
}: Readonly<ConfirmationPageProps>) {
    return (
        <div className="govuk-width-container">
            <main
                className="govuk-main-wrapper govuk-main-wrapper--l"
                id="main-content"
                role="main"
            >
                <div className="govuk-grid-row">
                    <div className="govuk-grid-column-two-thirds">

                        <div className="govuk-panel govuk-panel--confirmation">
                            <h1 className="govuk-panel__title">{title}</h1>

                            {reference ? (
                                <div className="govuk-panel__body">
                                    {reference.label ?? 'Your reference number'}
                                    <br />
                                    <strong>{reference.value}</strong>
                                </div>
                            ) : null}
                        </div>

                        {confirmationText ? (
                            <p className="govuk-body">{confirmationText}</p>
                        ) : null}

                        {nextStepsBody?.length ? (
                            <>
                                <h2 className="govuk-heading-m">{nextStepsHeading}</h2>

                                {nextStepsBody.map((para) => (
                                    <p className="govuk-body" key={para}>
                                        {para}
                                    </p>
                                ))}
                            </>
                        ) : null}

                        {actions?.map((a) => (
                            <p className="govuk-body govuk-!-margin-top-6" key={a.href}>
                                <a
                                    aria-label="Report a first global/european participant"
                                    className='govuk-button govuk-!-margin-bottom-0'
                                    href={a.href}
                                    rel="noopener noreferrer"
                                >
                                    {a.text}
                                </a>
                            </p>
                        ))}

                    </div>
                </div>
            </main>
        </div>
    )
}