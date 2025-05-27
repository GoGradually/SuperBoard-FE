import { useState, useCallback } from 'react';
import { fetchPostsAPI, searchPostsAPI } from '../services/post.api';
import type { PostLine, PageState } from '../types/index';
import type { SearchType } from '../services/post.api';

interface UsePostsReturn {
  posts: PostLine[];
  pageState: PageState | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  searchQuery: string;
  searchType: SearchType;
  isSearching: boolean;
  loadPosts: (page: number, currentSearchType?: SearchType, currentSearchQuery?: string) => Promise<void>;
  handlePageChange: (pageNumber: number) => void;
  handleSearch: (type: SearchType, query: string) => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setSearchType: React.Dispatch<React.SetStateAction<SearchType>>;
}

export const usePosts = (): UsePostsReturn => {
  const [posts, setPosts] = useState<PostLine[]>([]);
  const [pageState, setPageState] = useState<PageState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>('title_contents');
  const [isSearching, setIsSearching] = useState(false);

  const loadPosts = useCallback(async (page: number, currentSearchType: SearchType = searchType, currentSearchQuery: string = searchQuery) => {
    setIsLoading(true);
    setError(null);
    const isActuallySearching = !!(currentSearchQuery && currentSearchQuery.trim());
    setIsSearching(isActuallySearching);

    try {
      let data;
      if (isActuallySearching) {
        data = await searchPostsAPI(currentSearchType, currentSearchQuery, page);
      } else {
        data = await fetchPostsAPI(page);
      }
      setPosts(data.postLines);
      setPageState(data.pageState);
      if (typeof window !== 'undefined') window.scrollTo(0, 0);
    } catch (err: any) {
      setError(err.backendMessage || '게시글을 불러오는 데 실패했습니다.');
      setPosts([]);
      setPageState(null);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [searchQuery, searchType]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (type: SearchType, query: string) => {
    setSearchType(type);
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return {
    posts,
    pageState,
    isLoading,
    error,
    currentPage,
    searchQuery,
    searchType,
    isSearching,
    loadPosts,
    handlePageChange,
    handleSearch,
    setCurrentPage,
    setSearchQuery,
    setSearchType,
  };
}; 