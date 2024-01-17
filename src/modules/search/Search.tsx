import { Dispatch, MouseEvent, SetStateAction } from 'react';

import { SearchIcon, TagIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Input, Label } from '@/components';
import { Tag } from '@prisma/client';

type Props = {
  tags: Tag[];
  setSearchQuery: Dispatch<SetStateAction<string>>;
  setSearchTag: Dispatch<SetStateAction<string>>
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
    setSearchTag(label)
  }

  return (
    <section className="flex mx-auto items-end justify-center w-11/12 md:w-3/4 gap-8">
      <form
        onSubmit={handleSubmit(onSearch)}
        className="group/search w-full flex flex-col [&_svg]:focus-within:text-secondary"
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
            {tags.map(tag => (
              <DropdownMenuItem className="font-semibold hover:bg-offset cursor-pointer" key={tag.id}>
                <button className='w-full h-full text-start' onClick={(e: MouseEvent<HTMLButtonElement>) => handleTagSearch(e.currentTarget.innerHTML)}>
                  {tag.label}
                </button>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem className="font-semibold bg-negative text-negative cursor-pointer hover:bg-negativeOffset">
              <button className='w-full h-full text-center' onClick={() => setSearchTag(null)}>x</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </section>
  );
};
