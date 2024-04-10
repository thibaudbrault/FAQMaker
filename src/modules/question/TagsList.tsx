import { Dispatch, SetStateAction } from 'react';

import { Tag } from '@prisma/client';

import { Button } from '@/components';

type Props = {
  tags: Tag[];
  selectedTags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
};

export const TagsList = ({ tags, selectedTags, setSelectedTags }: Props) => {
  const handleSelection = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  if (tags.length > 0) {
    return (
      <ul className="flex list-none flex-wrap justify-start gap-4">
        {tags.map((tag) => (
          <li key={tag.id}>
            <Button
              variant={selectedTags.includes(tag.id) ? 'primary' : 'disabled'}
              rounded="base"
              font="small"
              size="small"
              type="button"
              onClick={() => handleSelection(tag.id)}
            >
              {tag.label}
            </Button>
          </li>
        ))}
      </ul>
    );
  } else {
    return <p className="text-center italic">No tags</p>;
  }
};
