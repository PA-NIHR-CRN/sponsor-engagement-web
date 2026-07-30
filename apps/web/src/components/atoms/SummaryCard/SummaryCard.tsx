export interface SummaryCardProps {
  title: string
  content: React.ReactNode
}

function SummaryCard({ title, content }: Readonly<SummaryCardProps>) {
  return (
    <div className="stat">
      <div className="stat__content">
        <div className="stat__content__body govuk-heading-m">{content}</div>
        <h2 className="stat__content__title govuk-body">{title}</h2>
      </div>
    </div>
  )
}

export default SummaryCard
