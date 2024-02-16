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
        <Button size="icon">
          {theme === 'light' ? (
            <SunIcon className="h-6 w-6" />
          ) : (
            <MoonIcon className="h-6 w-6" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {themes.map((th) => (
          <DropdownMenuItem
            key={th.value}
            className={
              theme === th.value
                ? 'bg-negative text-negative hover:bg-negativeOffset'
                : ''
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
