import { useEffect, useState } from 'react';

import { SearchIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

import { Input, Label } from '@/components';
import { locationAtom, searchQueryAtom } from '@/store';
import { Routes } from '@/utils';
import { useAtomValue, useSetAtom } from 'jotai';

export const Search = () => {
  const setLoc = useSetAtom(locationAtom);
  const searchQuery = useAtomValue(searchQueryAtom);
  const [isShortcutActivated, setIsShortcutActivated] = useState(false);
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const router = useRouter();
  const { handleSubmit, register } = useForm();

  const onSearch = (values) => {
    const { search } = values;
    setLoc((prev) => ({
      ...prev,
      searchParams: new URLSearchParams([['search', search]]),
    }));
  };

  const handleFocus = () => {
    setInputFocused(true);
  };

  const handleBlur = () => {
    setInputFocused(false);
  };

  useEffect(() => {
    if (inputFocused) {
      const handleShortcut = (event: KeyboardEvent) => {
        if (event.shiftKey && event.key === 'Enter') {
          setIsShortcutActivated(true);
          router.push(Routes.SITE.QUESTION.NEW);
        }
      };
      window.addEventListener('keydown', handleShortcut);
      return () => {
        window.removeEventListener('keydown', handleShortcut);
      };
    }
  }, [router, inputFocused, searchQuery, isShortcutActivated]);

  useEffect(() => {
    if (searchQuery && !isShortcutActivated) {
      const encodedSearch = encodeURI(searchQuery);
      router.push(`?search=${encodedSearch}`);
    } else if (inputFocused && !isShortcutActivated) {
      router.push('');
    }
  }, [router, inputFocused, searchQuery]);

  const keysClass =
    'rounded-md bg-negative px-2 py-1 font-semibold text-negative drop-shadow-2xl';

  return (
    <section className="flex w-full justify-center">
      <form
        onSubmit={handleSubmit(onSearch)}
        className="group/search flex w-3/4 flex-col gap-1 [&_svg]:focus-within:text-secondary"
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
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search"
          className="w-full rounded-md border border-default bg-default py-2 outline-none focus:border-secondary "
        />
        <p className="mt-2 hidden text-right text-xs group-focus-within/search:block">
          <span className={keysClass}>SHIFT</span> +{' '}
          <span className={keysClass}>ENTER</span> to create a new question
        </p>
      </form>
    </section>
  );
};
