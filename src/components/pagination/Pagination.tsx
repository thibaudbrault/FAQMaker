'use client';

import { Dispatch, SetStateAction } from 'react';

import ReactPaginate from 'react-paginate';

import { OFFSET } from '@/utils';

type Props = {
  setPage: Dispatch<SetStateAction<number>>;
  nodesLength: number;
};

export const Pagination = ({ setPage, nodesLength }: Props) => {
  const handlePageChange = (data: { selected: number }) => {
    setPage(data.selected);
  };

  return (
    <div className="pt-8">
      <ReactPaginate
        className="flex list-none items-center justify-center gap-4"
        pageLinkClassName="w-10 h-10 flex items-center justify-center font-semibold rounded-md hover:bg-gray-4"
        breakLinkClassName="font-semibold"
        activeLinkClassName="bg-gray-12 text-gray-1 hover:!bg-gray-11"
        previousClassName="font-semibold h-10 px-2 flex items-center justify-center rounded-md hover:bg-gray-4"
        nextClassName="font-semibold h-10 px-2 flex items-center justify-center rounded-md hover:bg-gray-4"
        disabledClassName="text-gray-11 hover:text-gray-11 hover:!bg-transparent"
        breakLabel="..."
        onPageChange={handlePageChange}
        nextLabel="Next →"
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={Math.ceil(nodesLength / OFFSET)}
        previousLabel="← Previous"
        renderOnZeroPageCount={() => null}
      />
    </div>
  );
};
