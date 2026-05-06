import type { SummaryCardProps } from '@/components/atoms/SummaryCard/SummaryCard'
import SummaryCard from '@/components/atoms/SummaryCard/SummaryCard'

export interface SummaryCardCollectionProps {
  panels: SummaryCardProps[]
}

function SummaryCardCollection({ panels }: Readonly<SummaryCardCollectionProps>) {
  return (
    <div className="govuk-summary-cards">
      {panels.map(panel => (
        <div key={panel.title}>
          <SummaryCard {...panel} />
        </div>
      ))}
    </div>
  )
}

export default SummaryCardCollection