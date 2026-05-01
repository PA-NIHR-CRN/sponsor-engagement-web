import type { TagProps } from '@/components/atoms/Tag/Tag';
import Tag from '@/components/atoms/Tag/Tag';

export interface TagCollectionProps {
    tags: TagProps[];
}

function TagCollection({ tags }: TagCollectionProps) {
    return (
        <div className="flex gap-2">
            {tags.map((tag) => (
                <Tag key={tag.text} {...tag} />
            ))}
        </div>
    );
}

export default TagCollection;