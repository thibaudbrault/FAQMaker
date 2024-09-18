'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ReactPaginate from 'react-paginate';

import { OFFSET } from '@/utils';

type Props = {
  nodesLength: number;
};

export const Pagination = ({ nodesLength }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handlePageChange = (data: { selected: number }) => {
    const params = new URLSearchParams(searchParams);
    const page = data.selected;
    if (page > 0) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="pt-8">
      <ReactPaginate
        className="flex list-none items-center justify-center gap-4"
        pageLinkClassName="w-10 h-10 flex items-center justify-center font-semibold rounded-md hover:bg-primary-foreground-hover"
        breakLinkClassName="font-semibold"
        activeLinkClassName="bg-primary-negative text-primary-negative hover:!bg-primary-negative-hover"
        previousClassName="font-semibold h-10 px-2 flex items-center justify-center rounded-md hover:bg-primary-foreground-hover"
        nextClassName="font-semibold h-10 px-2 flex items-center justify-center rounded-md hover:bg-primary-foreground-hover"
        disabledClassName="text-primary-muted hover:text-primary-muted hover:!bg-transparent"
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
