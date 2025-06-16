import React, { useState, useEffect, useCallback } from 'react';
import type { PostDetailResponse } from '../../../types/index';
import { fetchPostDetailAPI, updatePostAPI, deletePostAPI } from '../../../services/post.api';
import CommentList from '../comment/CommentList';
import { ApiError } from '../../../services/apiErrors';

interface PostDetailViewProps {
  postId: number;
  onBackToList: () => void; // 목록으로 돌아가기 함수
  onPostUpdated: () => void; // 게시글이 성공적으로 삭제 또는 수정되었을 때 목록을 갱신하도록 알리는 콜백 (선택적)
  onPostDeleted: () => void; // 게시글 삭제 후 호출될 콜백
}

const PostDetailView: React.FC<PostDetailViewProps> = ({ postId, onBackToList, onPostUpdated, onPostDeleted }) => {
  const [postDetail, setPostDetail] = useState<PostDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [editTitle, setEditTitle] = useState(''); // 수정용 제목
  const [editContents, setEditContents] = useState(''); // 수정용 내용

  const loadPostDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPostDetailAPI(postId);
      setPostDetail(data);
      setEditTitle(data.title); // 수정 필드 초기화
      setEditContents(data.contents);
    } catch (err: any) {
      console.error(`Error fetching post detail for ID ${postId}:`, err);
      setError(err.backendMessage || `ID ${postId} 게시글 상세 정보를 불러오는 데 실패했습니다.`);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadPostDetail();
  }, [loadPostDetail]);

  const handleEditToggle = () => {
    if (isEditing && postDetail) {
      setEditTitle(postDetail.title);
      setEditContents(postDetail.contents);
    }
    setIsEditing(!isEditing);
  };

  const handleUpdatePost = async () => {
    if (!postDetail) return;
    setIsLoading(true);
    setError(null);
    try {
      const updatedPost = await updatePostAPI(postId, { title: editTitle, contents: editContents });
      setPostDetail(updatedPost);
      setIsEditing(false);
      onPostUpdated();
      alert('게시글이 성공적으로 수정되었습니다.');
    } catch (err: any) {
      console.error('Error updating post:', err);
      if (err instanceof ApiError) {
        setError(err.backendMessage || '게시글 수정 중 오류가 발생했습니다.');
      } else {
        setError('게시글 수정 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      setIsLoading(true);
      setError(null);
      try {
        await deletePostAPI(postId);
        alert('게시글이 삭제되었습니다.');
        onPostDeleted();
      } catch (err: any) {
        console.error('Error deleting post:', err);
        if (err instanceof ApiError) {
          setError(err.backendMessage || '게시글 삭제 중 오류가 발생했습니다.');
        } else {
          setError('게시글 삭제 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.');
        }
        setIsLoading(false);
      }
    }
  };

  const handleCommentsUpdated = useCallback(() => {
    loadPostDetail();
  }, [loadPostDetail]);

  if (isLoading && !postDetail) {
    return <div className="text-center py-10">게시글 정보를 불러오는 중...</div>;
  }

  if (error && !isEditing) {
    return (
      <div className="text-center py-10 text-red-500">
        <p>{error}</p>
        <button 
          onClick={onBackToList}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  if (!postDetail && !isLoading) {
    return <div className="text-center py-10">게시글 정보를 찾을 수 없습니다.</div>;
  }
  
  return (
    <div className="container mx-auto p-4 font-sans bg-white shadow-lg rounded-lg mt-4">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBackToList}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
          disabled={isLoading}
        >
          &laquo; 목록으로
        </button>
        {!isEditing && postDetail && (
          <div className="space-x-2">
            <button 
              onClick={handleEditToggle} 
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm"
              disabled={isLoading}
            >
              수정
            </button>
            <button 
              onClick={handleDeletePost} 
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
              disabled={isLoading}
            >
              {isLoading && isEditing === false ? '삭제 중...' : '삭제'}
            </button>
          </div>
        )}
      </div>
      
      {isEditing && postDetail ? (
        <form onSubmit={(e) => { e.preventDefault(); handleUpdatePost(); }}>
          <div className="mb-4">
            <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input 
              type="text" 
              id="editTitle" 
              value={editTitle} 
              onChange={(e) => setEditTitle(e.target.value)} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={isLoading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="editContents" className="block text-sm font-medium text-gray-700 mb-1">내용</label>
            <textarea 
              id="editContents" 
              value={editContents} 
              onChange={(e) => setEditContents(e.target.value)} 
              rows={10} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={isLoading}
            />
          </div>
          {error && isEditing && <p className="text-red-500 text-sm mb-2">오류: {error}</p>}
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={handleEditToggle} 
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              disabled={isLoading}
            >
              취소
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? '저장 중...' : '저장'} 
            </button>
          </div>
        </form>
      ) : postDetail && (
        <>
          <h1 className="text-3xl font-bold mb-4 text-gray-800 border-b pb-2">{postDetail.title}</h1>
          <div className="prose max-w-none mb-8 text-gray-700" style={{ whiteSpace: 'pre-wrap' }}>
            {postDetail.contents}
          </div>
          <CommentList 
            postId={postDetail.postId} 
            commentsData={postDetail.comments || []}
            onCommentsUpdated={handleCommentsUpdated}
          />
        </>
      )}
      {isLoading && postDetail && <div className="text-center py-4">처리 중...</div>}
    </div>
  );
};

export default PostDetailView; 