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

  const iconStyles = 'hidden h-9 w-9 xl:block';

  const cards = useMemo(
    () => [
      {
        text: 'Questions',
        value: nodesCount,
        icon: <HelpCircle className={iconStyles} />,
      },
      {
        text: 'Users',
        value: usersCount,
        icon: <UserIcon className={iconStyles} />,
      },
      {
        text: 'Plan',
        value: plan,
        icon: <Wallet className={iconStyles} />,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      <ul className="flex list-none flex-col gap-4 md:grid md:grid-cols-3">
        {cards.map((card, index) => (
          <li
            className="flex items-center gap-6 rounded-md bg-gray-3 p-4"
            key={index}
          >
            {card.icon}
            <div className="mx-auto flex w-11/12 items-center justify-between gap-1 sm:w-2/3 md:w-full md:flex-col md:items-start">
              <p className="text-tealA-11">{card.text}</p>
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
