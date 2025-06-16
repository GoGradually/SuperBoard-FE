import React, { useState } from 'react';
import type { Comment as CommentType } from '../../../types/comment.types';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';
import { updateCommentAPI, deleteCommentAPI } from '../../../services/comment.api';
import { ApiError } from '../../../services/apiErrors';

interface CommentListProps {
  postId: number;
  commentsData: CommentType[];
  onCommentsUpdated?: () => void;
}

const CommentList: React.FC<CommentListProps> = ({ postId, commentsData, onCommentsUpdated }) => {
  const [error, setError] = useState<string | null>(null);

  const handleCommentCreated = async () => {
    setError(null);
    try {
      if (onCommentsUpdated) {
        onCommentsUpdated();
      }
    } catch (err: any) {
      console.error('Error in handleCommentCreated (should be handled by CommentForm):', err);
    }
  };

  const handleCommentUpdated = async (commentId: number, updatedContents: string) => {
    setError(null);
    try {
      await updateCommentAPI(postId, commentId, { contents: updatedContents });
      if (onCommentsUpdated) onCommentsUpdated();
    } catch (err: any) {
      console.error(`Error updating comment ${commentId} in CommentList:`, err);
      if (err instanceof ApiError) {
        setError(err.backendMessage || '댓글 수정 중 오류가 발생했습니다.');
      } else {
        setError('댓글을 수정하는 동안 오류가 발생했습니다.');
      }
    }
  };

  const handleCommentDeleted = async (commentId: number) => {
    setError(null);
    try {
      await deleteCommentAPI(postId, commentId);
      if (onCommentsUpdated) onCommentsUpdated();
    } catch (err: any) {
      console.error(`Error deleting comment ${commentId} in CommentList:`, err);
      if (err instanceof ApiError) {
        setError(err.backendMessage || '댓글 삭제 중 오류가 발생했습니다.');
      } else {
        setError('댓글을 삭제하는 동안 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">댓글 ({commentsData.length})</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          <p>{error}</p>
        </div>
      )}
      <CommentForm postId={postId} onSubmitSuccess={handleCommentCreated} />

      {commentsData.length > 0 ? (
        <ul className="space-y-4 mt-4">
          {commentsData.map(comment => (
            <CommentItem
              key={comment.id}
              postId={postId}
              comment={comment}
              onCommentUpdated={handleCommentUpdated}
              onCommentDeleted={handleCommentDeleted}
            />
          ))}
        </ul>
      ) : (
        !error && <p className="text-sm text-gray-500 mt-4">아직 댓글이 없습니다.</p>
      )}
    </div>
  );
};

export default CommentList; 