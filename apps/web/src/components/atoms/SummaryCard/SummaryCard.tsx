import clsx from 'clsx';

export interface SummaryCardProps {
  title: string
  content: React.ReactNode
}

function SummaryCard({ title, content }: Readonly<SummaryCardProps>) {
  return (
    <div className={clsx("stat", "stat--reversed")}>
      <div className="stat__content">
        <h2 className="stat__content__title govuk-body">{title}</h2>
        <div className="stat__content__body govuk-heading-m">{content}</div>
      </div>
    </div>
  )
}

export default SummaryCard
