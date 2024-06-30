'use client';

import Question from './Question';

import type { ExtendedFavorites, ExtendedNode } from '@/types';

type Props = {
  nodes: ExtendedNode[];
  message: string;
  favorites: ExtendedFavorites[];
};

export const List = ({ nodes, message, favorites }: Props) => {
  return (
    <section className="mt-6">
      {nodes.length > 0 ? (
        <ul className="mx-auto flex w-11/12 list-none flex-col gap-4 md:w-3/4">
          {nodes?.map((node) => (
            <Question node={node} favorites={favorites} key={node.id} />
          ))}
        </ul>
      ) : (
        <p
          className="text-center text-3xl font-bold lowercase"
          style={{ fontVariant: 'small-caps' }}
        >
          {message}
        </p>
      )}
    </section>
  );
};
