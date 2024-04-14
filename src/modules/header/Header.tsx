'use client';

import { AlignJustify, LogOut, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

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
import { Me } from '@/types';
import { Routes } from '@/utils';

import { ThemeToggle } from '../theme';

type Props = {
  user: Me;
};

export const Header = ({ user }: Props) => {
  return (
    <header className="flex items-center justify-between border-b border-b-gray-6 bg-gray-2 px-4 py-2 text-gray-12 md:px-8 md:py-4">
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
                  className="flex items-center gap-1 hover:text-gray-11"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.image} />
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
                    className="hover:text-gray-11"
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
                <button
                  onClick={() => signOut()}
                  className="hover:text-gray-11"
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
        <Button
          variant="ghost"
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
              <button onClick={() => signOut()} className="hover:underline">
                Logout
              </button>
              <hr className="mx-auto my-2 h-px w-3/4 border-none bg-gray-6" />
              <Button
                variant="primary"
                size="medium"
                weight="semibold"
                font="large"
                className="lowercase"
                style={{ fontVariant: 'small-caps' }}
              >
                <Link href={Routes.SITE.QUESTION.NEW}>New Question</Link>
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </header>
  );
};
