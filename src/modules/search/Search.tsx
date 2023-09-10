import { FormEvent, useState } from 'react';

import { SearchIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Input, Label } from '@/components';

export const Search = () => {
  const search = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string | null>(
    search ? search.get('q') : '',
  );
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (typeof searchQuery !== 'string') {
      return;
    }
    const encodedSearchQuery = encodeURI(searchQuery);
    router.push(`/search?q=${encodedSearchQuery}`);
  };

  return (
    <section className="w-full flex justify-center">
      <form
        onSubmit={handleSearch}
        className="flex flex-col w-fit gap-1 [&_svg]:focus-within:text-teal-700"
      >
        <Label
          htmlFor="search"
          className="lowercase focus-within:text-teal-700"
          style={{ fontVariant: 'small-caps' }}
        >
          Search
        </Label>
        <Input
          value={searchQuery || ''}
          withIcon
          icon={<SearchIcon />}
          type="text"
          id="search"
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-stone-100 rounded-md py-1 w-80 border border-stone-200 focus:border-teal-700 outline-none "
        />
      </form>
    </section>
  );
};
