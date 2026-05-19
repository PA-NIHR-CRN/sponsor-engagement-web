import type { TagProps } from "@/components/atoms/Tag/Tag";

import TagCollection from "../TagCollection/TagCollection";

export interface SummaryActionRow {
    href: string;
    actionText: string;
    tags: TagProps[];
}

export interface SummaryListProps {
    rows: SummaryActionRow[];
    className?: string;
}

function SummaryList({ rows, className }: Readonly<SummaryListProps>) {
    return (
        <dl className={[
            'govuk-summary-list',
            className,
        ]
            .filter(Boolean)
            .join(' ')}
        >
            {rows.map((row) => (
                <div className="govuk-summary-list__row govuk-!-margin-bottom-0" key={row.actionText}>
                    <dt className="govuk-summary-list__key">
                        {row.actionText}
                    </dt>
                    <dd className="govuk-summary-list__value">
                        <TagCollection tags={row.tags} />
                    </dd>
                    <dd className="govuk-summary-list__actions">
                        <a
                            className="govuk-link"
                            href={row.href}
                        >
                            Resolve
                        </a>
                    </dd>
                </div>
            ))}
        </dl>
    );
}

export default SummaryList;