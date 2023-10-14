import { LogOut, Settings, UserIcon, Wallet } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useForm } from 'react-hook-form';

import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@/components';
import { useCreateBillingPortal, useUser } from '@/hooks';
import { cn } from '@/utils';
import { useRouter } from 'next/router';

type Props = {
  id: string;
  company: string;
  tenantId: string;
};

export const Header = ({ id, company, tenantId }: Props) => {
  const { handleSubmit } = useForm();
  const router = useRouter();
  const { data: user, isLoading } = useUser(id);

  const { mutate } = useCreateBillingPortal(tenantId, router);

  const onSubmit = () => {
    mutate();
  };

  const tooltipClass = 'bg-negative text-negative border border-negative';

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
                  <TooltipContent className={cn(tooltipClass)}>
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
                    <TooltipContent className={cn(tooltipClass)}>
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
                    <TooltipContent className={cn(tooltipClass)}>
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
            weight="semibold"
            className="lowercase"
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
