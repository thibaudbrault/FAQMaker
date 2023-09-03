import { Link, Tooltip, TooltipContent, TooltipTrigger } from '@/components';
import { cn } from '@/utils';
import { LogOut, Settings, UserIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { CreateQuestion } from '../question';
import { useUser } from '@/hooks';

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
        <div className="flex gap-4 items-baseline">
          {!isLoading && (
            <ul className="flex gap-4">
              <li>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      decoration="none"
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
                      <Link
                        decoration="none"
                        href="/settings"
                        className="hover:text-stone-300"
                      >
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
          <CreateQuestion user={user} />
        </div>
      )}
    </header>
  );
};
