import React from 'react';
import type { PageState } from '../types';

interface PaginationProps {
  pageState: PageState;
  onPageChange: (pageNumber: number) => void;
  totalPages: number; // totalPages를 props로 받도록 추가
}

const Pagination: React.FC<PaginationProps> = ({ pageState, onPageChange, totalPages }) => {
  const { startPage, endPage, currentPage, prevBlockPage, nextBlockPage } = pageState;

  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // 페이지네이션을 표시할 필요가 없는 경우 (총 페이지가 1개 이하)
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav aria-label="Page navigation" className="flex justify-center mt-8 mb-4">
      <div className="inline-flex items-center -space-x-px">
        {startPage > 1 && (
          <button
            onClick={() => onPageChange(prevBlockPage)}
            className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-150"
            aria-label="Previous block"
          >
            &laquo;
          </button>
        )}
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`py-2 px-3 leading-tight border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-150 ${currentPage === number
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 z-10'
                : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
              } ${pageNumbers.length === 1 ? 'rounded-lg' : (number === startPage && startPage === 1) || (number === startPage && startPage > 1 && !pageNumbers.includes(prevBlockPage)) ? 'rounded-l-lg' : ''} ${number === endPage && endPage === totalPages || (number === endPage && endPage < totalPages && !pageNumbers.includes(nextBlockPage)) ? 'rounded-r-lg' : ''}`
            }
            aria-current={currentPage === number ? 'page' : undefined}
          >
            {number}
          </button>
        ))}
        {endPage < totalPages && (
          <button
            onClick={() => onPageChange(nextBlockPage)}
            className="py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-150"
            aria-label="Next block"
          >
            &raquo;
          </button>
        )}
      </div>
    </nav>
  );
};

export default Pagination;
