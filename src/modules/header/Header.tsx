import { AlignJustify, LogOut, Settings, Wallet } from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Drawer,
  DrawerContent,
  DrawerTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components';
import { useCreateBillingPortal, useMediaQuery, useUser } from '@/hooks';
import { Routes } from '@/utils';

import { ThemeToggle } from './ThemeToggle';

type Props = {
  id: string;
  company: string;
  tenantId: string;
};

export const Header = ({ id, company, tenantId }: Props) => {
  const { handleSubmit } = useForm();
  const { data: user, isPending } = useUser(id);
  const isDesktop = useMediaQuery('(min-width: 640px)');

  const { mutate } = useCreateBillingPortal(tenantId);

  const onSubmit = () => {
    mutate();
  };

  return (
    <header className="flex items-center justify-between bg-negative px-8 py-4 text-negative">
      <h1>
        <Link href="/" className="font-serif text-4xl">
          {company}
        </Link>
      </h1>
      {isDesktop
        ? user && (
            <div className="flex items-end gap-4">
              {!isPending && (
                <ul className="flex list-none gap-4">
                  <li>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href="/profile"
                          className="flex items-center gap-1 hover:text-negativeOffset"
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.image} />
                            <AvatarFallback>
                              {user.email[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Profile</p>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                  {user?.role !== 'user' && (
                    <li>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href="/settings"
                            className="hover:text-negativeOffset"
                          >
                            <Settings />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Settings</p>
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  )}
                  {user?.role === 'tenant' && (
                    <li>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <form onSubmit={handleSubmit(onSubmit)}>
                            <button className="hover:text-negativeOffset">
                              <Wallet />
                            </button>
                          </form>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Billing</p>
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  )}
                  <ThemeToggle />
                  <li>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => signOut()}
                          className="hover:text-negativeOffset"
                        >
                          <LogOut />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Logout</p>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                </ul>
              )}
              <Button
                variant="negative"
                font="large"
                size="small"
                weight="semibold"
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
                asChild
              >
                <Link href={Routes.SITE.QUESTION.NEW}>New Question</Link>
              </Button>
            </div>
          )
        : user && (
            <Drawer>
              <DrawerTrigger>
                <AlignJustify />
              </DrawerTrigger>
              <DrawerContent>
                <div className="mb-10 mt-5 flex flex-col items-center gap-2 text-xl font-semibold">
                  <Link href="/profile" className="hover:underline">
                    Profile
                  </Link>
                  {user.role !== 'user' && (
                    <Link href="/settings" className="hover:underline">
                      Settings
                    </Link>
                  )}
                  {user.role === 'tenant' && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <button className="hover:underline">Billing</button>
                    </form>
                  )}
                  <button onClick={() => signOut()} className="hover:underline">
                    Logout
                  </button>
                  <hr className="mx-auto my-2 h-px w-3/4 border-none bg-negative" />
                  <Link
                    className="rounded-md bg-negative px-2 py-1 text-negative  hover:bg-negativeOffset"
                    href={Routes.SITE.QUESTION.NEW}
                  >
                    New Question
                  </Link>
                </div>
              </DrawerContent>
            </Drawer>
          )}
    </header>
  );
};
