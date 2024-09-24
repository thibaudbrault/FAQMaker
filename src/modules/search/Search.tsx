'use client';

import type { MouseEvent } from 'react';

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

import type { Tag } from '@prisma/client';

type Props = {
  tags: Tag[];
};

export const Search = ({ tags }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);
  const currentTag = params.get('tag') || '';

  const handleSearch = useDebouncedCallback((search) => {
    params.delete('page');
    if (search) {
      params.set('query', search);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleTagSearch = (label: string) => {
    params.delete('page');
    params.set('tag', label);
    replace(`${pathname}?${params.toString()}`);
  };

  const handleResetTag = () => {
    params.delete('page');
    params.delete('tag');
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <section className="mx-auto flex w-11/12 items-end justify-center gap-8 md:w-3/4">
      <div className="group/search flex w-full flex-col gap-1 [&_svg]:focus-within:text-accent-focus">
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
          placeholder="Question title"
          className="py-2"
          defaultValue={searchParams.get('query')?.toString()}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      {tags.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="w-fit rounded-md bg-primary-foreground px-4 py-2 font-bold uppercase text-primary hover:bg-primary-foreground-hover"
            style={{ fontVariant: 'small-caps' }}
          >
            <TagIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col gap-1">
            {tags.map((tag) => (
              <DropdownMenuItem
                className={
                  currentTag === tag.label
                    ? 'bg-primary-negative text-primary-negative hover:bg-primary-negative'
                    : 'bg-primary'
                }
                key={tag.id}
              >
                <button
                  className="size-full text-start"
                  type="button"
                  onClick={(e: MouseEvent<HTMLButtonElement>) =>
                    handleTagSearch(e.currentTarget.innerHTML)
                  }
                >
                  {tag.label}
                </button>
                {currentTag === tag.label && (
                  <button onClick={handleResetTag} type="button">
                    x
                  </button>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </section>
  );
};
