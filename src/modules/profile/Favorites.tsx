import Link from 'next/link';

import { Routes, dateOptions } from '@/utils';

import type { ExtendedFavorites } from '@/types';

type Props = {
  favorites?: ExtendedFavorites[];
};

export const UserFavorites = ({ favorites }: Props) => {
  return (
    <>
      <h2
        className="mb-4 text-center font-serif text-3xl font-semibold lowercase md:text-4xl"
        style={{ fontVariant: 'small-caps' }}
      >
        Favorites
      </h2>
      {favorites && favorites.length > 0 ? (
        <ul className="flex list-none flex-col gap-2">
          {favorites.map((favorite) => (
            <li
              className="flex items-center justify-between rounded-md px-3 py-2 shadow-sm hover:shadow-teal-6"
              key={favorite.id}
            >
              <h3 className="text-xl font-semibold hover:underline md:text-2xl">
                <Link href={`${Routes.SITE.QUESTION.INDEX}/${favorite.nodeId}`}>
                  {favorite.node.question.text}
                </Link>
              </h3>
              <p className="text-xs">
                Asked on{' '}
                {new Date(favorite.node.question.createdAt).toLocaleDateString(
                  undefined,
                  dateOptions,
                )}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center italic">No answers</p>
      )}
    </>
  );
};
