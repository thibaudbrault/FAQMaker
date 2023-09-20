import { Dispatch, SetStateAction } from 'react';

import { Tag } from '@prisma/client';

import { Button, Loader } from '@/components';

type Props = {
  isLoading: boolean;
  tags: Tag[];
  selectedTags: string[];
  setSelectedTags: Dispatch<SetStateAction<string[]>>;
};

export const TagsList = ({
  isLoading,
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

  if (isLoading) {
    return <Loader size="items" />;
  } else if (tags.length > 0) {
    return (
      <ul className="mx-auto flex w-11/12 flex-wrap justify-start gap-4">
        {tags.map((tag) => (
          <li key={tag.id}>
            <Button
              variant={
                selectedTags.includes(tag.id) ? 'primaryDark' : 'disabledDark'
              }
              rounded="base"
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
