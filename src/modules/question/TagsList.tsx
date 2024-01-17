import { Dispatch, SetStateAction } from 'react';

import { Tag } from '@prisma/client';

import { Button, Loader } from '@/components';

type Props = {
  isPending: boolean;
  tags: Tag[];
  selectedTags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
};

export const TagsList = ({
  isPending,
  tags,
  selectedTags,
  setSelectedTags,
}: Props) => {
  const handleSelection = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter((id) => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  if (isPending) {
    return <Loader size="items" />;
  } else if (tags.length > 0) {
    return (
      <ul className="list-none flex flex-wrap justify-start gap-4">
        {tags.map((tag) => (
          <li key={tag.id}>
            <Button
              variant={
                selectedTags.includes(tag.id) ? 'primary' : 'disabled'
              }
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
