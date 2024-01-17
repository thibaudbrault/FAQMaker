import { Dispatch, MouseEvent, SetStateAction } from 'react';

import { Tag } from '@prisma/client';
import { SearchIcon, TagIcon } from 'lucide-react';
import { useRouter } from 'next/router';
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
};

export const Search = ({ tags, setSearchQuery, setSearchTag }: Props) => {
  const router = useRouter();
  const { handleSubmit, register } = useForm();

  const onSearch = (values) => {
    const { search } = values;
    setSearchQuery(search);
    if (search) {
      const encodedSearch = encodeURI(search);
      router.push(`?search=${encodedSearch}`);
    } else {
      router.push('');
    }
  };

  const handleTagSearch = (label: string) => {
    setSearchTag(label);
  };

  return (
    <section className="mx-auto flex w-11/12 items-end justify-center gap-8 md:w-3/4">
      <form
        onSubmit={handleSubmit(onSearch)}
        className="group/search flex w-full flex-col [&_svg]:focus-within:text-secondary"
      >
        <Label
          htmlFor="search"
          className="lowercase focus-within:text-secondary"
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
          className="w-full rounded-md border border-ghost bg-default py-2 outline-none focus:border-secondary "
        />
      </form>
      {tags.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger
            className="w-fit rounded-md bg-negative px-4 py-2 font-bold uppercase text-negative"
            style={{ fontVariant: 'small-caps' }}
          >
            <TagIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-default">
            {tags.map((tag) => (
              <DropdownMenuItem
                className="cursor-pointer font-semibold hover:bg-offset"
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
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem className="cursor-pointer bg-negative font-semibold text-negative hover:bg-negativeOffset">
              <button
                className="h-full w-full text-center"
                onClick={() => setSearchTag(null)}
              >
                x
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </section>
  );
};
