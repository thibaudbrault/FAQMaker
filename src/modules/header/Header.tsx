'use client';

import { useEffect } from 'react';

import { useSetAtom } from 'jotai';
import { AlignJustify, LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { signOutAction } from '@/actions/sign-out';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/avatar/Avatar';
import { Button } from '@/components/button/Button';
import {
  DrawerTrigger,
  DrawerContent,
  Drawer,
} from '@/components/drawer/Drawer';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/tooltip/Tooltip';
import { userAtom } from '@/store';
import { Me } from '@/types/models/user';
import { Routes } from '@/utils/routing';

import { ThemeToggle } from '../theme/ThemeToggle';

type Props = {
  user: Me;
};

export const Header = ({ user }: Props) => {
  const setUser = useSetAtom(userAtom);

  useEffect(() => {
    setUser(user);
  }, [user]);

  return (
    <header className="flex items-center justify-between border-b border-b-gray-6 bg-primary-foreground px-4 py-2 text-primary md:px-8 md:py-4">
      <Link href={Routes.SITE.HOME} className="flex items-center gap-2">
        {user.tenant.logo && (
          <Image
            src={user.tenant.logo}
            alt=""
            width={50}
            height={50}
            className="rounded-md"
          />
        )}
        <h1 className="font-serif text-4xl">{user.tenant.company}</h1>
      </Link>
      <div className="hidden items-end gap-4 sm:flex">
        <ul className="flex list-none gap-4">
          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={Routes.SITE.PROFILE}
                  className="flex items-center gap-1 hover:text-primary-muted"
                >
                  <Avatar className="size-6">
                    <AvatarImage src={user.image ?? ''} />
                    <AvatarFallback>{user.email[0]}</AvatarFallback>
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
                    href={Routes.SITE.SETTINGS}
                    className="hover:text-primary-muted"
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
          <ThemeToggle />
          <li>
            <Tooltip>
              <TooltipTrigger asChild>
                <form action={signOutAction}>
                  <button
                    className="hover:text-primary-muted"
                    type="submit"
                    aria-label="Log out"
                  >
                    <LogOut />
                  </button>
                </form>
              </TooltipTrigger>
              <TooltipContent>
                <p>Logout</p>
              </TooltipContent>
            </Tooltip>
          </li>
        </ul>
        <Button variant="ghost" font="large" size="small" asChild>
          <Link href={Routes.SITE.QUESTION.NEW}>New Question</Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 sm:hidden">
        <ThemeToggle />
        <Drawer>
          <DrawerTrigger>
            <AlignJustify />
          </DrawerTrigger>
          <DrawerContent>
            <div className="mb-10 mt-5 flex flex-col items-center gap-2 text-xl font-semibold">
              <Link href={Routes.SITE.PROFILE} className="hover:underline">
                Profile
              </Link>
              {user.role !== 'user' && (
                <Link href={Routes.SITE.SETTINGS} className="hover:underline">
                  Settings
                </Link>
              )}
              <form action={signOutAction}>
                <button className="hover:underline" type="submit">
                  Logout
                </button>
              </form>
              <hr className="mx-auto my-2 h-px w-3/4 border-none bg-divider" />
              <Button variant="primary" size="medium" font="large">
                <Link href={Routes.SITE.QUESTION.NEW}>New Question</Link>
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
};
