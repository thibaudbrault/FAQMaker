import { Dispatch, SetStateAction } from 'react';

import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { Input, Label } from '@/components';

type Props = {
  setSearchQuery: Dispatch<SetStateAction<string>>;
};

export const Search = ({ setSearchQuery }: Props) => {
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
        className="group/search flex w-11/12 flex-col gap-1 md:w-3/4 [&_svg]:focus-within:text-secondary"
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
    </section>
  );
};
