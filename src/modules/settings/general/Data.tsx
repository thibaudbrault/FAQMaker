import { useMemo } from 'react';

import { HelpCircle, UserIcon } from 'lucide-react';

type Props = {
  nodesCount: number;
  usersCount: number;
};

export const Data = ({ nodesCount, usersCount }: Props) => {
  const cards = useMemo(
    () => [
      {
        text: 'Questions',
        value: nodesCount,
        icon: <HelpCircle className="w-9 h-9" />,
      },
      {
        text: 'Users',
        value: usersCount,
        icon: <UserIcon className="w-9 h-9" />,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <div className="w-3/4 mx-auto mb-4">
      <ul className="grid grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <li
            className="flex items-center gap-6 bg-stone-100 rounded-md p-4"
            key={index}
          >
            {card.icon}
            <div className="flex flex-col gap-1">
              <h3>{card.text}</h3>
              <p className="text-4xl font-semibold">{card.value}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
