import { Dispatch, SetStateAction } from 'react';

import ReactPaginate from 'react-paginate';

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
        className="flex items-center justify-center gap-4"
        pageLinkClassName="w-10 h-10 flex items-center justify-center font-semibold rounded-md hover:bg-negative hover:text-negative"
        breakLinkClassName="font-semibold"
        activeLinkClassName="bg-negative text-negative"
        previousClassName="font-semibold h-10 px-2 flex items-center justify-center rounded-md hover:bg-negative hover:text-negative"
        nextClassName="font-semibold h-10 px-2 flex items-center justify-center rounded-md hover:bg-negative hover:text-negative"
        disabledClassName="text-offset hover:text-offset hover:!bg-offset"
        breakLabel="..."
        onPageChange={handlePageChange}
        nextLabel="Next →"
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={Math.ceil(nodesLength / 10)}
        previousLabel="← Previous"
        renderOnZeroPageCount={() => null}
      />
    </div>
  );
};
