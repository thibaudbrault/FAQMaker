import { Dispatch, FormEvent, SetStateAction } from 'react';

import { SearchIcon } from 'lucide-react';

import { Input, Label } from '@/components';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

type Props = {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
};

export const Search = ({ searchQuery, setSearchQuery }: Props) => {
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

  return (
    <section className="flex w-full justify-center">
      <form
        onSubmit={handleSubmit(onSearch)}
        className="flex w-fit flex-col gap-1 [&_svg]:focus-within:text-teal-700"
      >
        <Label
          htmlFor="search"
          className="lowercase focus-within:text-teal-700"
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
          className="w-80 rounded-md border border-stone-200 bg-stone-100 py-1 outline-none focus:border-teal-700 "
        />
      </form>
    </section>
  );
};
