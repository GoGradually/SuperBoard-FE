import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
// import BoardHeader from './components/BoardHeader'; // 사용 안함
// import NewPostButton from './components/NewPostButton'; // 사용 안함
import PostTable from './components/PostTable';
import Pagination from './components/Pagination';
// import BoardFooter from './components/BoardFooter'; // 사용 안함
import NewPostForm from './components/NewPostForm';
import PostDetailView from './components/PostDetailView';
import RankingList from './components/RankingList';
import SearchBar from './components/SearchBar';
import { fetchPostsAPI, fetchViewsRankingAPI, fetchLikesRankingAPI, searchPostsAPI } from './services/postApi';
import type { PostLine, PageState } from './types'; // PostDetailResponse 제거 (App.tsx에서 직접 사용 안함)
import type { SearchType } from './services/postApi'; // SearchType을 type-only import로 변경

function App() {
  const [posts, setPosts] = useState<PostLine[]>([]);
  const [pageState, setPageState] = useState<PageState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'new'>('list');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  // 검색 관련 상태 추가
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchType, setSearchType] = useState<SearchType>('title_contents');
  const [isSearching, setIsSearching] = useState(false); // 검색 API 호출 중 로딩 상태

  // const POSTS_PER_PAGE = 10; // pageState에서 totalElements, size 등을 활용하므로 불필요

  const loadPosts = useCallback(async (page: number, currentSearchType?: SearchType, currentSearchQuery?: string) => {
    setIsLoading(true);
    setError(null);
    const isActuallySearching = !!(currentSearchQuery && currentSearchQuery.trim());
    setIsSearching(isActuallySearching);

    try {
      let data;
      if (isActuallySearching) {
        data = await searchPostsAPI(currentSearchType || 'title_contents', currentSearchQuery || '', page);
      } else {
        data = await fetchPostsAPI(page);
      }
      setPosts(data.postLines);
      setPageState(data.pageState);
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError(err.backendMessage || '게시글을 불러오는 데 실패했습니다.');
      setPosts([]);
      setPageState(null);
    } finally {
        setIsLoading(false);
        setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    if (viewMode === 'list') {
      loadPosts(currentPage, searchType, searchQuery);
    }
  }, [currentPage, viewMode, searchQuery, searchType, loadPosts]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (type: SearchType, query: string) => {
    setSearchType(type);
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleNewPostClick = () => {
    // setViewMode('new'); // viewMode는 모달 표시와 직접적 연관 없음
    setShowNewPostModal(true);
  };

  const handlePostFormClose = (refreshNeeded?: boolean) => {
    setShowNewPostModal(false);
    // setViewMode('list'); // 모달 닫는다고 뷰 모드가 바뀌는 것은 아님
    if (refreshNeeded) {
        setSearchQuery('');
        if (currentPage === 1) {
            loadPosts(1, 'title_contents', ''); // 검색 조건 초기화하여 로드
        } else {
            setCurrentPage(1); // 이 경우 useEffect가 검색 조건 초기화된 상태로 로드
        }
    }
  };

  const handleViewPost = (postId: number) => {
    setSelectedPostId(postId);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedPostId(null);
    setViewMode('list');
    // viewMode 변경 시 useEffect에 의해 현재 searchType, searchQuery로 loadPosts 호출
  };
  
  const handlePostUpdated = () => {
    // 상세 뷰에서 수정 후 목록으로 돌아올 때, 현재 페이지와 검색조건으로 다시 로드
    if (viewMode === 'list') { 
        loadPosts(currentPage, searchType, searchQuery);
    }
    // 상세 뷰에 머무르는 경우, PostDetailView 내부에서 자체적으로 상세 정보를 갱신
  };

  const handlePostDeleted = () => {
    setViewMode('list');
    setSelectedPostId(null);
    // 삭제 후에는 검색 상태를 초기화하고 첫 페이지로.
    setSearchQuery(''); 
    setSearchType('title_contents');
    if (currentPage === 1) {
        loadPosts(1, 'title_contents', '');
    } else {
        setCurrentPage(1); // useEffect에 의해 초기화된 검색조건으로 1페이지 로드
    }
  };

  const handleRankingItemClick = (postId: number) => {
    setSelectedPostId(postId);
    setViewMode('detail');
  };

  // RankingList의 refresh 키를 위해 검색 관련 상태도 포함
  const rankingRefreshTrigger = `${viewMode}-${currentPage}-${searchQuery}-${searchType}`;

  // 홈으로 이동하는 함수 추가
  const handleGoHome = () => {
    setViewMode('list');
    setSelectedPostId(null);
    setSearchQuery('');
    setSearchType('title_contents');
    setCurrentPage(1);
    setShowNewPostModal(false); // 새 글 작성 모달도 닫음
    // useEffect에 의해 첫 페이지, 초기 검색 조건으로 게시글 로드됨
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main content area */}
        <main className="flex-grow md:w-2/3">
          {/* Header can be part of the main content or outside */}
          <div className="flex justify-between items-center mb-6">
            <h1 
              onClick={handleGoHome} 
              className="text-3xl font-bold text-gray-800 cursor-pointer hover:text-blue-700 transition-colors duration-150"
              title="홈으로 이동"
            >
              {viewMode === 'detail' && selectedPostId ? '게시글 상세' : 
               showNewPostModal ? '새 게시글 작성' : 
               searchQuery.trim() ? `'${searchQuery}' 검색 결과` : '게시판'}
            </h1>
            {viewMode === 'list' && !showNewPostModal && (
              <button
                onClick={handleNewPostClick}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-150"
              >
                새 글 작성
              </button>
            )}
          </div>

          {viewMode === 'list' && (
            <>
              {(isLoading && !isSearching) && <p className="text-center text-gray-500 py-4">게시글을 불러오는 중...</p>}
              {(isSearching) && <p className="text-center text-gray-500 py-4">'{searchQuery}' 검색 중...</p>}
              {error && <p className="text-center text-red-500 py-4">오류: {error}</p>}
              
              {!isLoading && !isSearching && !error && posts.length > 0 && pageState && (
                <>
                  <PostTable posts={posts} onPostClick={handleViewPost} /> 
                  <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 w-full">
                    <div className="order-2 sm:order-1 flex-shrink-0">
                      {pageState && pageState.totalPages > 0 && (
                        <Pagination
                          pageState={pageState}
                          totalPages={pageState.totalPages}
                          onPageChange={handlePageChange}
                        />
                      )}
                    </div>
                    <div className="order-1 sm:order-2 w-full sm:flex-grow flex justify-center">
                      <SearchBar onSearch={handleSearch} isSearching={isSearching || isLoading} />
                    </div>
                  </div>
                </>
              )}

              {!isLoading && !isSearching && !error && posts.length === 0 && (
                <>
                  <div className="w-full max-w-lg mx-auto mb-4">
                    <SearchBar onSearch={handleSearch} isSearching={isSearching || isLoading} />
                  </div>
                  <p className="text-center text-gray-500 py-4">
                    {searchQuery.trim() && !isSearching ? `'${searchQuery}'에 대한 검색 결과가 없습니다.` : '표시할 게시글이 없습니다.'}
                  </p>
                </>
              )}
            </>
          )}

          {viewMode === 'detail' && selectedPostId && (
            <PostDetailView 
              postId={selectedPostId} 
              onBackToList={handleBackToList} 
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          )}

          {/* NewPostForm Modal */}
          {showNewPostModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex justify-center items-center transition-opacity duration-300 ease-in-out">
              <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl mx-4 sm:mx-auto transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow">
                <NewPostForm 
                    onClose={handlePostFormClose} 
                />
              </div>
            </div>
          )}
        </main>

        {/* Sidebar for rankings */}
        <aside className="md:w-1/3 space-y-6 mt-10 md:mt-0">
          <RankingList 
            title="🏆 실시간 조회수 TOP 5" 
            fetchRankingData={fetchViewsRankingAPI} 
            onItemClick={handleRankingItemClick} 
            refreshDependency={rankingRefreshTrigger}
          />
          <RankingList 
            title="💖 실시간 추천수 TOP 5" 
            fetchRankingData={fetchLikesRankingAPI} 
            onItemClick={handleRankingItemClick} 
            refreshDependency={rankingRefreshTrigger}
          />
        </aside>
      </div>
      {/* Footer can be added here if needed */}
      {/* <BoardFooter year={new Date().getFullYear()} message="SuperBoard. All rights reserved." /> */}
    </div>
  );
}

export default App;
