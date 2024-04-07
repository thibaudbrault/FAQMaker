'use client';

import { Dispatch, MouseEvent, SetStateAction, useState } from 'react';

import { Tag } from '@prisma/client';
import { SearchIcon, TagIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Label,
} from '@/components';

type Props = {
  tags: Tag[];
  setSearchQuery: Dispatch<SetStateAction<string>>;
  setSearchTag: Dispatch<SetStateAction<string>>;
  setPage: Dispatch<SetStateAction<number>>;
};

export const Search = ({
  tags,
  setSearchQuery,
  setSearchTag,
  setPage,
}: Props) => {
  const router = useRouter();
  const { handleSubmit, register } = useForm();
  const [tagActive, setTagActive] = useState<string | null>(null);

  const onSearch = (values) => {
    const { search } = values;
    setSearchQuery(search);
    setPage(0);
    if (search) {
      const encodedSearch = encodeURI(search);
      router.push(`?search=${encodedSearch}`);
    } else {
      router.push('');
    }
  };

  const handleTagSearch = (label: string) => {
    setTagActive(label);
    setSearchTag(label);
    setPage(0);
  };

  const handleResetTag = () => {
    setTagActive(null);
    setSearchTag(null);
    setPage(0);
  };

  return (
    <section className="mx-auto flex w-11/12 items-end justify-center gap-8 md:w-3/4">
      <form
        onSubmit={handleSubmit(onSearch)}
        className="group/search flex w-full flex-col gap-1 [&_svg]:focus-within:text-tealA-8"
      >
        <Label
          htmlFor="search"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Search
        </Label>
        <Input
          {...register('search')}
          withIcon
          icon={<SearchIcon />}
          type="text"
          id="search"
          placeholder="Search"
          className="py-2"
        />
      </form>
      {tags.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="w-fit rounded-md bg-gray-3 px-4 py-2 font-bold uppercase text-gray-12 hover:bg-gray-4"
            style={{ fontVariant: 'small-caps' }}
          >
            <TagIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col gap-1">
            {tags.map((tag) => (
              <DropdownMenuItem
                className={
                  tagActive === tag.label
                    ? 'bg-gray-12 text-white hover:bg-gray-12 dark:bg-gray-1 dark:hover:bg-gray-1'
                    : 'bg-gray-1 dark:bg-gray-12'
                }
                key={tag.id}
              >
                <button
                  className="h-full w-full text-start"
                  onClick={(e: MouseEvent<HTMLButtonElement>) =>
                    handleTagSearch(e.currentTarget.innerHTML)
                  }
                >
                  {tag.label}
                </button>
                {tagActive === tag.label && (
                  <button onClick={handleResetTag}>x</button>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </section>
  );
};
