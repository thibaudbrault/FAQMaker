'use client';

import { Dispatch, MouseEvent, SetStateAction, useState } from 'react';


import { Tag } from '@prisma/client';
import { SearchIcon, TagIcon } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

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
  setSearchTag: Dispatch<SetStateAction<string>>;
  setPage: Dispatch<SetStateAction<number>>;
};

export const Search = ({ tags, setSearchTag, setPage }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [tagActive, setTagActive] = useState<string | null>(null);

  const handleSearch = useDebouncedCallback((search) => {
    const params = new URLSearchParams(searchParams);
    setPage(0);
    if (search) {
      params.set('query', search);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleTagSearch = (label: string) => {
    setTagActive(label);
    setSearchTag(label);
    setPage(0);
  };

  const handleResetTag = () => {
    setTagActive(null);
    setSearchTag('');
    setPage(0);
  };

  return (
    <section className="mx-auto flex w-11/12 items-end justify-center gap-8 md:w-3/4">
      <div className="group/search flex w-full flex-col gap-1 [&_svg]:focus-within:text-tealA-8">
        <Label
          htmlFor="search"
          className="lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          Search
        </Label>
        <Input
          withIcon
          icon={<SearchIcon />}
          type="search"
          id="search"
          placeholder="Search"
          className="py-2"
          defaultValue={searchParams.get('query')?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
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
