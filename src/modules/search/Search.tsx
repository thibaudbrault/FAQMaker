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
    <section className="flex w-full justify-center">
      <form
        onSubmit={handleSearch}
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
          value={searchQuery || ''}
          withIcon
          icon={<SearchIcon />}
          type="text"
          id="search"
          placeholder="Search"
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-80 rounded-md border border-stone-200 bg-stone-100 py-1 outline-none focus:border-teal-700 "
        />
      </form>
    </section>
  );
};
