import { useState, useEffect } from 'react';
import './App.css';
// import BoardHeader from './components/BoardHeader'; // 삭제
// import NewPostButton from './components/NewPostButton'; // 삭제
import PostTable from './components/domain/post/PostTable';
import Pagination from './components/domain/shared/Pagination';
// import BoardFooter from './components/BoardFooter'; // 삭제
import NewPostForm from './components/domain/post/NewPostForm';
import PostDetailView from './components/domain/post/PostDetailView';
import RankingList from './components/domain/ranking/RankingList';
import SearchBar from './components/domain/post/SearchBar';
import { fetchLikesRankingAPI } from './services/ranking.api';
import type { SearchType } from './services/post.api';
import { usePosts } from './hooks/usePosts';

function App() {
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'new'>('list');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const {
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
    handleSearch: originalHandleSearch,
    setCurrentPage,
    setSearchQuery,
    setSearchType,
  } = usePosts();

  useEffect(() => {
    if (viewMode === 'list') {
      loadPosts(currentPage, searchType, searchQuery);
    }
  }, [viewMode, currentPage, searchType, searchQuery, loadPosts]);
  
  const handleSearch = (type: SearchType, query: string) => {
    originalHandleSearch(type, query);
    setViewMode('list');
  };

  const handleNewPostClick = () => {
    setViewMode('new');
    setSelectedPostId(null);
  };

  const handlePostFormClose = (refreshNeeded?: boolean) => {
    setViewMode('list');
    if (refreshNeeded) {
      setSearchQuery(''); 
      setSearchType('title_contents');
      if (currentPage === 1) {
        loadPosts(1, 'title_contents', ''); 
      } else {
        setCurrentPage(1); 
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
  };
  
  const handlePostUpdated = () => {
    if (viewMode === 'list') { 
      loadPosts(currentPage, searchType, searchQuery);
    }
  };

  const handlePostDeleted = () => {
    setViewMode('list');
    setSelectedPostId(null);
    setSearchQuery(''); 
    setSearchType('title_contents');
    if (currentPage === 1) {
      loadPosts(1, 'title_contents', '');
    } else {
      setCurrentPage(1);
    }
  };

  const handleRankingItemClick = (postId: number) => {
    setSelectedPostId(postId);
    setViewMode('detail');
  };

  const rankingRefreshTrigger = `${viewMode}-${currentPage}-${searchQuery}-${searchType}`;

  const handleGoHome = () => {
    setViewMode('list');
    setSelectedPostId(null);
    setSearchQuery('');
    setSearchType('title_contents');
    setCurrentPage(1);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <main className="flex-grow md:w-2/3">
            <div className="flex justify-between items-center mb-6">
              <h1 
                onClick={handleGoHome} 
                className="text-3xl font-bold text-gray-800 cursor-pointer hover:text-blue-700 transition-colors duration-150"
                title="홈으로 이동"
              >
                {viewMode === 'detail' && selectedPostId ? '게시글 상세' :
                 viewMode === 'new' ? '새 게시글 작성' :
                 searchQuery.trim() ? `'${searchQuery}' 검색 결과` : '게시판'}
              </h1>
              {viewMode === 'list' && (
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

            {viewMode === 'new' && (
              <NewPostForm onClose={handlePostFormClose} />
            )}
          </main>

          <aside className="md:w-1/3 space-y-6 mt-10 md:mt-0">
            <RankingList 
              title="💖 실시간 추천수 TOP 5" 
              fetchRankingData={fetchLikesRankingAPI} 
              onItemClick={handleRankingItemClick} 
              refreshDependency={rankingRefreshTrigger}
            />
          </aside>
        </div>
      </div>
    </>
  );
}

export default App;
