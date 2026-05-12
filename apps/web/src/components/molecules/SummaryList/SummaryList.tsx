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
                        <a
                            className="govuk-link"
                            href={row.href}
                        >
                            {row.actionText}
                            <span className="govuk-visually-hidden">
                                action required
                            </span>
                        </a>
                    </dt>
                    <dd className="govuk-summary-list__actions">
                        <TagCollection tags={row.tags} />
                    </dd>
                </div>
            ))}
        </dl>
    );
}

export default SummaryList;