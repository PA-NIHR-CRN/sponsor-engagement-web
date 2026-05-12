import type { TagProps } from "@/components/atoms/Tag/Tag";

import TagCollection from "../TagCollection/TagCollection";

export interface SummaryActionRow {
    href: string;
    actionText: string;
    tags: TagProps[];
}

export interface SummaryListProps {
    rows: SummaryActionRow[];
}

function SummaryList({ rows }: Readonly<SummaryListProps>) {
    return (
        <dl className="govuk-summary-list summary-list--tags">
            {rows.map((row, index) => (
                <div
                    className="govuk-summary-list__row"
                    key={index}
                >
                    <dt className="govuk-summary-list__key">
                        <TagCollection tags={row.tags} />
                    </dt>
                    <dd className="govuk-summary-list__value">
                    {row.actionText}
                    </dd>
                    <dd className="govuk-summary-list__actions">
                        <a
                            className="govuk-link"
                            href={row.href}
                        >
                            Resolve
                            <span className="govuk-visually-hidden">
                                action required
                            </span>
                        </a>
                    </dd>
                </div>
            ))}
        </dl>
    );
}

export default SummaryList;