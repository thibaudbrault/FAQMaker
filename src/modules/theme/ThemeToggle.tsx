'use client';

import { SunIcon, MoonIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    {
      value: 'light',
      label: 'Light',
    },
    {
      value: 'dark',
      label: 'Dark',
    },
    {
      value: 'system',
      label: 'System',
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="text-primary hover:text-primary-muted">
          {theme === 'light' ? (
            <SunIcon className="size-6" />
          ) : (
            <MoonIcon className="size-6" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-1">
        {themes.map((th) => (
          <DropdownMenuItem
            key={th.value}
            className={
              theme === th.value
                ? 'bg-gray-12 text-white hover:bg-gray-12 dark:bg-gray-1 dark:hover:bg-gray-1'
                : 'bg-gray-1 dark:bg-gray-12'
            }
            onClick={() => setTheme(th.value)}
          >
            {th.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
