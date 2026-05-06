export interface SummaryCardProps {
  title: string
  content: React.ReactNode
}

function SummaryCard({ title, content }: Readonly<SummaryCardProps>) {
  return (
    <div className="govuk-summary-card govuk-!-margin-top-4 govuk-!-margin-bottom-4">
      <div className="govuk-summary-card__title-wrapper">
        <h2 className="govuk-summary-card__title text-darkGrey">
          {title}
        </h2>
      </div>
      <div className="govuk-summary-card__content">
        <p className="govuk-heading-l govuk-!-margin-0">
          {content}
        </p>
      </div>
    </div>
  )
}

export default SummaryCard