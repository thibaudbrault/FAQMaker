import { LogOut, Settings, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components';
import { useUser } from '@/hooks';
import { cn } from '@/utils';

import { CreateQuestion } from '../question';

type Props = {
  id?: string;
  company?: string;
};

export const Header = ({ id, company }: Props) => {
  const { data: user, isLoading } = useUser(id);

  const tooltipClass = 'bg-teal-800 text-stone-200 border border-stone-200';

  return (
    <header className="flex justify-between items-center px-8 py-4 bg-teal-700 text-stone-200">
      <h1>
        <Link href="/" className="text-4xl font-serif">
          {company}
        </Link>
      </h1>
      {user && (
        <div className="flex gap-4 items-end">
          {!isLoading && (
            <ul className="flex gap-4">
              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/profile"
                      className="flex items-center gap-1 hover:text-stone-300"
                    >
                      <UserIcon />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent className={cn(tooltipClass)}>
                    <p>Profile</p>
                  </TooltipContent>
                </Tooltip>
              </li>
              {user?.role === 'admin' && (
                <li>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href="/settings" className="hover:text-stone-300">
                        <Settings />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent className={cn(tooltipClass)}>
                      <p>Settings</p>
                    </TooltipContent>
                  </Tooltip>
                </li>
              )}
              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => signOut()}
                      className="hover:text-stone-300"
                    >
                      <LogOut />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className={cn(tooltipClass)}>
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </li>
            </ul>
          )}
          <Button
            variant="primaryLight"
            font="large"
            size="small"
            className="font-semibold lowercase"
            style={{ fontVariant: 'small-caps' }}
            asChild
          >
            <Link href="/question/new">New Question</Link>
          </Button>
        </div>
      )}
    </header>
  );
};
