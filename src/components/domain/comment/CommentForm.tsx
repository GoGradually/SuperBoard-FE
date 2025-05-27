import React, { useState } from 'react';
import { createCommentAPI } from '../../../services/comment.api'; // 경로 수정
import { ApiError } from '../../../services/apiErrors'; // ApiError 임포트

interface CommentFormProps {
  postId: number; // 댓글이 달릴 게시글 ID
  parentId?: number | null; // 대댓글인 경우 부모 댓글 ID
  onSubmitSuccess: () => void; // 타입 변경: 인자 없이 호출
  onCancel?: () => void; // 폼 취소 시 호출 (대댓글 폼 닫기 등)
  submitButtonText?: string;
  placeholderText?: string;
  autoFocus?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  parentId = null,
  onSubmitSuccess,
  onCancel,
  submitButtonText = '댓글 등록',
  placeholderText = '댓글을 입력하세요...',
  autoFocus = false,
}) => {
  const [contents, setContents] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null); // 에러 상태 추가

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contents.trim()) {
      setError('댓글 내용을 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      // createCommentAPI 직접 호출
      await createCommentAPI(postId, { contents, parentId });
      setContents(''); // 성공 후 입력 필드 초기화
      onSubmitSuccess(); // 성공 콜백 호출 (인자 없음)
      
      // 대댓글 폼의 경우 성공 후 폼을 닫는 로직은 onSubmitSuccess 콜백 내에서 (CommentItem에서) 처리하거나,
      // onCancel을 호출하는 기존 로직을 유지할 수 있습니다.
      // 여기서는 CommentItem의 handleReplySubmitSuccess에서 setShowReplyForm(false)를 하므로 추가 작업 불필요.
    } catch (err: any) {
      console.error('Error submitting comment form:', err);
      if (err instanceof ApiError) {
        setError(err.backendMessage || '댓글 등록 중 오류가 발생했습니다.');
      } else {
        setError('댓글 등록에 실패했습니다. 네트워크 연결을 확인해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`mt-2 mb-4 ${parentId ? 'ml-8 pl-4 border-l-2 border-gray-200' : ''}`}>
      <textarea
        value={contents}
        onChange={(e) => setContents(e.target.value)}
        placeholder={placeholderText}
        rows={parentId ? 2 : 3} // 대댓글은 좀 더 작게
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 ease-in-out text-sm"
        required
        autoFocus={autoFocus}
        disabled={isSubmitting}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>} {/* 에러 메시지 표시 */}
      <div className="flex justify-end items-center mt-2 space-x-2">
        {onCancel && (
           <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400 transition-colors disabled:opacity-50"
          >
            취소
          </button>
        )}
        <button 
          type="submit" 
          disabled={isSubmitting || !contents.trim()}
          className="px-4 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '등록 중...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default CommentForm; 