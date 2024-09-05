import { HelpCircle, UserIcon, Wallet } from 'lucide-react';

type Props = {
  plan: string;
  nodesCount: number;
  usersCount: number;
};

export const Data = ({ plan, nodesCount, usersCount }: Props) => {
  const iconStyles = 'hidden h-9 w-9 xl:block';

  const cards = [
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
  ];

  return (
    <ul className="flex list-none flex-col gap-4 md:grid md:grid-cols-3">
      {cards.map((card) => (
        <li
          className="flex items-center gap-6 rounded-md bg-gray-3 p-4"
          key={card.text}
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
  );
};
