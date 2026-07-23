import type { TagProps } from '@/components/atoms/Tag/Tag';
import Tag from '@/components/atoms/Tag/Tag';

export interface TagCollectionProps {
    tags: TagProps[];
}

function TagCollection({
    tags,
}: Readonly<TagCollectionProps>) {
    return (
        <div className="flex flex-wrap gap-2 max-w-full tag-collection">
            {tags.map((tag) => (
                <Tag key={tag.text} {...tag} />
            ))}
        </div>
    );
}

export default TagCollection;