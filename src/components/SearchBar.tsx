import React, { useState } from 'react';
import type { SearchType } from '../services/postApi'; // SearchType 임포트

interface SearchBarProps {
  onSearch: (searchType: SearchType, query: string) => void;
  isSearching?: boolean; // 검색 중 상태 (버튼 비활성화 등)
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isSearching = false }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('title_contents'); // 기본 검색 타입

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }
    onSearch(searchType, query.trim());
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-row flex-nowrap items-center gap-2 box-border"
      style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
    >
      <div className="flex-none">
        <select 
          value={searchType} 
          onChange={(e) => setSearchType(e.target.value as SearchType)}
          className="h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
          disabled={isSearching}
        >
          <option value="title_contents">제목+내용</option>
          <option value="title">제목</option>
          <option value="contents">내용</option>
        </select>
      </div>
      <div className="flex-auto min-w-0">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="검색어를 입력하세요..." 
          className="w-full sm:w-64 h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          disabled={isSearching}
        />
      </div>
      <div className="flex-none">
        <button 
          type="submit" 
          className="h-10 px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-150 text-sm font-medium disabled:bg-blue-300"
          disabled={isSearching || !query.trim()}
        >
          {isSearching ? '검색중...' : '검색'}
        </button>
      </div>
    </form>
  );
};

export default SearchBar; 