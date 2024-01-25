import { AlignJustify, LogOut, Settings, UserIcon, Wallet } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import {
  Button,
  Drawer,
  DrawerContent,
  DrawerTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components';
import { useCreateBillingPortal, useMediaQuery, useUser } from '@/hooks';
import { Routes, cn } from '@/utils';

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
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt="Profile"
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          ) : (
                            <UserIcon />
                          )}
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
          )
        : user && (
            <Drawer>
              <DrawerTrigger>
                <AlignJustify />
              </DrawerTrigger>
              <DrawerContent>
                <div className="mb-10 mt-5 flex flex-col items-center gap-2 text-xl font-semibold">
                  <Link href="/profile">Profile</Link>
                  {user.role !== 'user' && (
                    <Link href="/settings">Settings</Link>
                  )}
                  {user.role === 'tenant' && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <button>Billing</button>
                    </form>
                  )}
                  <button onClick={() => signOut()}>Logout</button>
                  <hr className="mx-auto my-2 h-px w-3/4 border-none bg-negative" />
                  <Link href={Routes.SITE.QUESTION.NEW}>New Question</Link>
                </div>
              </DrawerContent>
            </Drawer>
          )}
    </header>
  );
};
