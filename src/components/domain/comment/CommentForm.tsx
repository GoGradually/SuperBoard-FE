import React, { useState } from 'react';
import { createCommentAPI } from '../../../services/comment.api';
import { ApiError } from '../../../services/apiErrors';

interface CommentFormProps {
  postId: number;
  onSubmitSuccess: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  onSubmitSuccess,
}) => {
  const [contents, setContents] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contents.trim()) {
      setError('댓글 내용을 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await createCommentAPI(postId, { contents });
      setContents('');
      onSubmitSuccess();
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
    <form onSubmit={handleSubmit} className="mt-2 mb-4">
      <textarea
        value={contents}
        onChange={(e) => setContents(e.target.value)}
        placeholder="댓글을 입력하세요..."
        rows={3}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 ease-in-out text-sm"
        required
        disabled={isSubmitting}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      <div className="flex justify-end items-center mt-2">
        <button 
          type="submit" 
          disabled={isSubmitting || !contents.trim()}
          className="px-4 py-1.5 text-xs font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '등록 중...' : '댓글 등록'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm; 