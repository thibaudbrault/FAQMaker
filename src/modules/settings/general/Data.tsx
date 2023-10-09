import { useMemo } from 'react';

import { HelpCircle, UserIcon, Wallet } from 'lucide-react';

type Props = {
  nodesCount: number;
  usersCount: number;
  plan: string;
};

export const Data = ({ nodesCount, usersCount, plan }: Props) => {
  const cards = useMemo(
    () => [
      {
        text: 'Questions',
        value: nodesCount ?? 0,
        icon: <HelpCircle className="h-9 w-9" />,
      },
      {
        text: 'Users',
        value: usersCount,
        icon: <UserIcon className="h-9 w-9" />,
      },
      {
        text: 'Plan',
        value: plan,
        icon: <Wallet className="h-9 w-9" />,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className="mx-auto mb-4 w-3/4">
      <ul className="grid grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <li
            className="flex items-center gap-6 rounded-md bg-default p-4"
            key={index}
          >
            {card.icon}
            <div className="flex flex-col gap-1">
              <h3>{card.text}</h3>
              <p className="text-4xl font-semibold capitalize">{card.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
