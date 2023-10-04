import { LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components';
import { useUser } from '@/hooks';
import { cn } from '@/utils';

type Props = {
  id?: string;
  company?: string;
};

export const Header = ({ id, company }: Props) => {
  const { data: user, isLoading } = useUser(id);

  const tooltipClass = 'bg-teal-800 text-negative border border-stone-200';

  return (
    <header className="flex items-center justify-between bg-negative px-8 py-4 text-negative">
      <h1>
        <Link href="/" className="font-serif text-4xl">
          {company}
        </Link>
      </h1>
      {user && (
        <div className="flex items-end gap-4">
          {!isLoading && (
            <ul className="flex gap-4">
              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/profile"
                      className="flex items-center gap-1 hover:text-stone-300"
                    >
                      <Image
                        src={user.image}
                        alt="Profile"
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
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
