import React, { useState } from 'react';
import type { PageState } from '../types';

interface PaginationProps {
  pageState: PageState;
  onPageChange: (pageNumber: number) => void;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ pageState, onPageChange, totalPages }) => {
  const { startPage, endPage, currentPage, prevBlockPage, nextBlockPage } = pageState;
  const [jumpToPageInput, setJumpToPageInput] = useState('');

  const pageNumbers: number[] = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (totalPages <= 1) {
    return null;
  }

  const handleJumpToPageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJumpToPageInput(e.target.value);
  };

  const handleJumpToPageSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPageInput, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpToPageInput('');
    } else {
      alert(`유효한 페이지 번호(1-${totalPages})를 입력해주세요.`);
      setJumpToPageInput('');
    }
  };

  return (
    <nav aria-label="Page navigation" className="flex flex-col sm:flex-row justify-center items-center mt-8 mb-4 space-y-3 sm:space-y-0 sm:space-x-2">
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

      {totalPages > PAGES_PER_BLOCK_THRESHOLD && (
        <form onSubmit={handleJumpToPageSubmit} className="inline-flex items-center ml-0 sm:ml-4">
          <input 
            type="number" 
            value={jumpToPageInput} 
            onChange={handleJumpToPageInputChange} 
            className="w-16 px-2 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="페이지"
            min="1"
            max={totalPages}
          />
          <button 
            type="submit" 
            className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-r-md border border-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors"
          >
            이동
          </button>
        </form>
      )}
    </nav>
  );
};

const PAGES_PER_BLOCK_THRESHOLD = 5;

export default Pagination;
