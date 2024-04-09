'use client';

import { Dispatch, SetStateAction } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';
import ReactPaginate from 'react-paginate';

import { OFFSET } from '@/utils';

type Props = {
  setPage: Dispatch<SetStateAction<number>>;
  nodesLength: number;
};

export const Pagination = ({ setPage, nodesLength }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const handlePageChange = (data: { selected: number }) => {
    setPage(data.selected);
  };

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
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
