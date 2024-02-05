import { useEffect } from 'react';

import { useAtom } from 'jotai';

import { Button } from '@/components';
import { themeAtom } from '@/store';

export const ThemeSelector = () => {
  const themes = [
    {
      name: 'neutral',
      style: 'bg-neutral-500',
    },
    {
      name: 'orange',
      style: 'bg-orange-500',
    },
  ];

  const [selectedTheme, setSelectedTheme] = useAtom(themeAtom);

  useEffect(() => {
    document.documentElement.className = `theme-${selectedTheme}`;
  }, [selectedTheme]);

  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
  };

  return (
    <div className="flex gap-4">
      {themes.map((theme) => (
        <Button
          key={theme.name}
          variant={selectedTheme === theme.name ? 'primary' : 'negative'}
          size="small"
          className="flex items-center gap-1 capitalize"
          weight="semibold"
          font="small"
          onClick={() => handleThemeChange(theme.name)}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full border border-default ${theme.style}`}
          />
          {theme.name}
        </Button>
      ))}
    </div>
  );
};
