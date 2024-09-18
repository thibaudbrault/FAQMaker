import Link from 'next/link';

import { Routes, dateOptions } from '@/utils';

import type { ExtendedFavorites } from '@/types';

type Props = {
  favorites?: ExtendedFavorites[];
};

export const UserFavorites = ({ favorites }: Props) => {
  return (
    <section className="space-y-4">
      <h2
        className="text-xl font-semibold lowercase"
        style={{ fontVariant: 'small-caps' }}
      >
        Favorites
      </h2>
      {favorites && favorites.length > 0 ? (
        <div className="flex flex-col gap-2">
          {favorites.map((favorite) => (
            <Link
              className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-gray-4"
              key={favorite.id}
              href={`${Routes.SITE.QUESTION.INDEX}/${favorite.nodeId}`}
            >
              <h3 className="font-semibold">{favorite.node.question.text}</h3>
              <small className="text-primary-muted">
                Asked on{' '}
                {new Date(favorite.node.question.createdAt).toLocaleDateString(
                  undefined,
                  dateOptions,
                )}
              </small>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center italic">No answers</p>
      )}
    </section>
  );
};
