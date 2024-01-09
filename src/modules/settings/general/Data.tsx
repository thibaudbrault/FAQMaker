import { useMemo } from 'react';

import { HelpCircle, UserIcon, Wallet } from 'lucide-react';

import { useNodesCount, useUsersCount } from '@/hooks';

type Props = {
  tenantId: string;
  plan: string;
};

export const Data = ({ tenantId, plan }: Props) => {
  const { data: nodesCount } = useNodesCount(tenantId);
  const { data: usersCount } = useUsersCount(tenantId);
  const cards = useMemo(
    () => [
      {
        text: 'Questions',
        value: nodesCount ?? 0,
        icon: <HelpCircle className="hidden h-9 w-9 xl:block" />,
      },
      {
        text: 'Users',
        value: usersCount,
        icon: <UserIcon className="hidden h-9 w-9 xl:block" />,
      },
      {
        text: 'Plan',
        value: plan,
        icon: <Wallet className="hidden h-9 w-9 xl:block" />,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      <ul className="flex flex-col gap-4 md:grid md:grid-cols-3">
        {cards.map((card, index) => (
          <li
            className="flex items-center gap-6 rounded-md bg-default p-4"
            key={index}
          >
            {card.icon}
            <div className="mx-auto flex w-11/12 items-center justify-between gap-1 sm:w-2/3 md:w-full md:flex-col md:items-start">
              <h3>{card.text}</h3>
              <p className="text-3xl font-semibold capitalize md:text-4xl">
                {card.value}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
