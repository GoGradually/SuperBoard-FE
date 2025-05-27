import React, { useState, useEffect } from 'react';
import type { PostDetailResponse, Comment as CommentType } from '../types';
import { fetchPostDetailAPI, updatePostAPI, deletePostAPI } from '../services/postApi';
import CommentList from './CommentList';

interface PostDetailViewProps {
  postId: number;
  onBackToList: () => void; // 목록으로 돌아가기 함수
  onPostUpdated?: () => void; // 게시글이 성공적으로 삭제 또는 수정되었을 때 목록을 갱신하도록 알리는 콜백 (선택적)
}

const PostDetailView: React.FC<PostDetailViewProps> = ({ postId, onBackToList, onPostUpdated }) => {
  const [postDetail, setPostDetail] = useState<PostDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태
  const [editTitle, setEditTitle] = useState(''); // 수정용 제목
  const [editContents, setEditContents] = useState(''); // 수정용 내용

  useEffect(() => {
    const loadPostDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchPostDetailAPI(postId);
        setPostDetail(data);
        setEditTitle(data.title); // 수정 필드 초기화
        setEditContents(data.contents);
      } catch (err) {
        console.error(`Error fetching post detail in component for ID ${postId}:`, err);
        setError('게시글 상세 정보를 불러오는 데 실패했습니다.');
      }
      setIsLoading(false);
    };

    if (postId) {
      loadPostDetail();
    }
  }, [postId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (postDetail) { // 원래 값으로 복원
      setEditTitle(postDetail.title);
      setEditContents(postDetail.contents);
    }
  };

  const handleSave = async () => {
    if (!postDetail) return;
    setIsLoading(true); // 저장 중 로딩 표시
    try {
      const updatedPost = await updatePostAPI(postDetail.id, { title: editTitle, contents: editContents });
      setPostDetail(updatedPost);
      setIsEditing(false);
      setError(null); // 오류 상태 초기화
      alert('게시글이 성공적으로 수정되었습니다.');
      if (onPostUpdated) onPostUpdated(); // 목록 갱신 알림
    } catch (err) {
      console.error('Error saving post:', err);
      setError('게시글 수정에 실패했습니다.');
      // 수정 실패 시 사용자에게 알림
    } finally {
        setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!postDetail || !window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;
    setIsLoading(true); // 삭제 중 로딩 표시
    try {
      await deletePostAPI(postDetail.id);
      alert('게시글이 성공적으로 삭제되었습니다.');
      if (onPostUpdated) onPostUpdated(); // 목록 갱신 알림
      onBackToList(); // 목록으로 돌아가기
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('게시글 삭제에 실패했습니다.');
      setIsLoading(false); // 삭제 실패 시 로딩 상태 해제
    }
    // 성공 시에는 onBackToList가 호출되므로 별도의 로딩 해제 필요 없음
  };

  const handleCommentsChangeInList = (updatedComments: CommentType[]) => {
    if (postDetail) {
      setPostDetail(prevDetail => {
        if (!prevDetail) return null; // 혹시 모를 null 체크
        return { ...prevDetail, comments: updatedComments };
      });
    }
  };

  if (isLoading && !postDetail) { // 초기 로딩 시
    return <div className="text-center py-10">게시글 정보를 불러오는 중...</div>;
  }

  if (error && !isEditing) { // 에러 발생 시 (수정 중이 아닐 때만 전체 에러 화면 표시)
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

  if (!postDetail && !isLoading) { // 데이터 없고 로딩도 끝나면
    return <div className="text-center py-10">게시글 정보를 찾을 수 없습니다.</div>;
  }
  
  // postDetail이 로드된 이후의 렌더링
  return (
    <div className="container mx-auto p-4 font-sans bg-white shadow-lg rounded-lg mt-4">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={onBackToList}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm"
          disabled={isLoading} // 로딩 중 비활성화
        >
          &laquo; 목록으로
        </button>
        {!isEditing && postDetail && (
          <div className="space-x-2">
            <button 
              onClick={handleEdit} 
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors text-sm"
              disabled={isLoading} // 로딩 중 비활성화
            >
              수정
            </button>
            <button 
              onClick={handleDelete} 
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
              disabled={isLoading} // 로딩 중 비활성화
            >
              삭제
            </button>
          </div>
        )}
      </div>
      
      {isEditing && postDetail ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="mb-4">
            <label htmlFor="editTitle" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
            <input 
              type="text" 
              id="editTitle" 
              value={editTitle} 
              onChange={(e) => setEditTitle(e.target.value)} 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={isLoading} // 로딩 중 비활성화
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
              disabled={isLoading} // 로딩 중 비활성화
            />
          </div>
          {error && isEditing && <p className="text-red-500 text-sm mb-2">오류: {error}</p>} {/* 수정 중 에러 메시지 */} 
          <div className="flex justify-end space-x-2">
            <button 
              type="button" 
              onClick={handleCancelEdit} 
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              disabled={isLoading} // 로딩 중 비활성화
            >
              취소
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              disabled={isLoading} // 로딩 중 비활성화
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
            postId={postDetail.id} 
            initialComments={postDetail.comments} 
            onCommentsUpdatedInList={handleCommentsChangeInList}
          />
        </>
      )}
      {/* 로딩 중이면서 postDetail이 있는 경우 (수정/삭제 시 로딩) */} 
      {isLoading && postDetail && <div className="text-center py-4">처리 중...</div>}
    </div>
  );
};

export default PostDetailView; 