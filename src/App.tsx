import React, { useState, useEffect } from 'react';
import BoardHeader from './components/BoardHeader';
import NewPostButton from './components/NewPostButton';
import PostTable from './components/PostTable';
import Pagination from './components/Pagination';
import BoardFooter from './components/BoardFooter';
import NewPostForm from './components/NewPostForm';
import PostDetailView from './components/PostDetailView';
import { fetchPostsAPI } from './services/postApi';
import type { PostLine, PageState } from './types';

// 기본 페이지 상태 초기화
const initialPageState: PageState = {
  currentPage: 1,
  totalPages: 0,
  startPage: 1,
  endPage: 0,
  prevBlockPage: 1,
  nextBlockPage: 1,
};

const App: React.FC = () => {
  const [postLines, setPostLines] = useState<PostLine[]>([]);
  const [pageState, setPageState] = useState<PageState>(initialPageState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'new'>('list');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const fetchPosts = async (pageToFetch: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const apiResponse = await fetchPostsAPI(pageToFetch);
      setPostLines(apiResponse.postLines);
      setPageState(apiResponse.pageState);
      setCurrentPage(apiResponse.pageState.currentPage);
    } catch (err) {
      console.error('Error fetching posts in App:', err);
      setError('게시글을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
      setPostLines([]);
      setPageState(initialPageState);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (viewMode === 'list') {
      fetchPosts(currentPage);
    }
  }, [currentPage, viewMode]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= pageState.totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleNewPostClick = () => {
    setViewMode('new');
  };

  const handleCancelNewPost = () => {
    setViewMode('list');
  };

  const handleSubmitNewPost = async (title: string, contents: string) => {
    console.log('새 글 제출:', { title, contents });
    setViewMode('list');
    alert('새 글이 성공적으로 작성되었습니다. 목록을 새로고침합니다.');
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchPosts(1);
    }
  };

  const handlePostClick = (postId: number) => {
    setSelectedPostId(postId);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedPostId(null);
    if (!postLines.length || error || pageState.currentPage !== currentPage) {
      fetchPosts(currentPage);
    }
  };

  const handlePostUpdated = () => {
    if (viewMode === 'list') {
      fetchPosts(currentPage);
    }
  };

  const renderContent = () => {
    if (viewMode === 'list') {
      return (
        <>
          <NewPostButton onClick={handleNewPostClick} />
          {isLoading && <div className="text-center py-4">로딩 중...</div>}
          {error && <div className="text-center py-4 text-red-500">{error}</div>}
          {!isLoading && !error && postLines.length > 0 && (
            <>
              <PostTable posts={postLines} onPostClick={handlePostClick} />
              <Pagination
                pageState={pageState}
                onPageChange={handlePageChange}
                totalPages={pageState.totalPages}
              />
            </>
          )}
          {!isLoading && !error && postLines.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              게시글이 없습니다.
            </div>
          )}
        </>
      );
    } else if (viewMode === 'new') {
      return <NewPostForm onSubmit={handleSubmitNewPost} onCancel={handleCancelNewPost} />;
    } else if (viewMode === 'detail' && selectedPostId !== null) {
      return <PostDetailView postId={selectedPostId} onBackToList={handleBackToList} onPostUpdated={handlePostUpdated} />;
    } else {
      setViewMode('list');
      return null;
    }
  };

  return (
    <div className="container mx-auto p-4 font-sans bg-gray-50 min-h-screen">
      <BoardHeader title={viewMode === 'detail' ? "게시글 상세" : viewMode === 'new' ? "새 게시글 작성" : "게시글 목록"} />
      {renderContent()}
      <BoardFooter year={new Date().getFullYear()} message="게시판. 모든 권리 보유." />
    </div>
  );
};

export default App;
