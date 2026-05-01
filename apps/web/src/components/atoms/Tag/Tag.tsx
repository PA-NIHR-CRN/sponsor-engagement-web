export type TagColour = 'red' | 'blue' | 'green' | 'yellow' | 'grey';

const colourClassMap: Record<TagColour, string> = {
    red: 'govuk-tag--red',
    blue: 'govuk-tag--blue',
    green: 'govuk-tag--green',
    yellow: 'govuk-tag--yellow',
    grey: 'govuk-tag--grey',
};

export interface TagProps {
    colour?: TagColour;
    text?: string;
    children?: React.ReactNode;
    className?: string;
}

function Tag({
    colour = 'red',
    text,
    children,
    className,
}: TagProps) {
    if (!text && !children) return null;

    return (
        <span
            className={[
                'govuk-tag',
                colourClassMap[colour],
                'normal-case',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
        >
            {children ?? text}
        </span>
    );
}

export default Tag;