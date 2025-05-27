import React, { useState } from 'react';
import type { CommentWithChildren, Comment as CommentType } from '../types';
import { updateCommentAPI, deleteCommentAPI, createCommentAPI } from '../services/postApi';

interface CommentItemProps {
  comment: CommentWithChildren;
  postId: number;
  onCommentUpdated: (updatedComment: CommentType) => void;
  onCommentDeleted: (commentId: number) => void;
  onReplyCreated: (newReply: CommentType) => void;
  level: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, postId, onCommentUpdated, onCommentDeleted, onReplyCreated, level }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContents, setEditedContents] = useState(comment.contents);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContents, setReplyContents] = useState('');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContents(comment.contents);
    setError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!editedContents.trim()) {
      setError('댓글 내용을 입력해주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const updatedComment = await updateCommentAPI(postId, comment.id, { contents: editedContents });
      onCommentUpdated(updatedComment);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating comment:', err);
      setError(err instanceof Error ? err.message : '댓글 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      setIsLoading(true);
      setError(null);
      try {
        await deleteCommentAPI(postId, comment.id);
        onCommentDeleted(comment.id);
      } catch (err) {
        console.error('Error deleting comment:', err);
        setError(err instanceof Error ? err.message : '댓글 삭제에 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
    setReplyContents('');
    setReplyError(null);
  };

  const handleReplySubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!replyContents.trim()) {
      setReplyError('대댓글 내용을 입력해주세요.');
      return;
    }
    setIsSubmittingReply(true);
    setReplyError(null);
    try {
      const newReply = await createCommentAPI(postId, { 
        contents: replyContents, 
        parentId: comment.id
      });
      onReplyCreated(newReply);
      setShowReplyForm(false);
      setReplyContents('');
    } catch (err) {
      console.error('Error submitting reply:', err);
      setReplyError(err instanceof Error ? err.message : '대댓글 등록에 실패했습니다.');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const marginLeft = level * 25;

  return (
    <div style={{ marginLeft: `${marginLeft}px` }} className={`mb-3`}>
      <div className={`bg-white p-3 rounded-lg shadow-sm border border-gray-200 ${isEditing ? 'ring-2 ring-blue-200' : ''}`}>
        {!isEditing ? (
          <div className="flex justify-between items-start">
            <p className="text-sm text-gray-700 whitespace-pre-wrap flex-grow break-words leading-relaxed">{comment.contents}</p>
            <div className="flex-shrink-0 ml-3 space-x-2">
              {level === 0 && (
                <button onClick={toggleReplyForm} className="text-xs font-medium text-green-600 hover:text-green-800 focus:outline-none" disabled={isLoading || isSubmittingReply}>답글</button>
              )}
              <button onClick={handleEdit} className="text-xs font-medium text-blue-600 hover:text-blue-800 focus:outline-none" disabled={isLoading || isSubmittingReply}>수정</button>
              <button onClick={handleDelete} className="text-xs font-medium text-red-600 hover:text-red-800 focus:outline-none" disabled={isLoading || isSubmittingReply}>삭제</button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <textarea value={editedContents} onChange={(e) => setEditedContents(e.target.value)} rows={3} className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 shadow-inner bg-gray-50" disabled={isLoading} placeholder="댓글 수정..."/>
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
            <div className="flex justify-end space-x-2 items-center">
              {isLoading && <p className="text-xs text-gray-500 mr-2">처리 중...</p>}
              <button onClick={handleCancelEdit} className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md focus:outline-none" disabled={isLoading}>취소</button>
              <button onClick={handleSave} className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none" disabled={isLoading}>저장</button>
            </div>
          </div>
        )}
      </div>

      {showReplyForm && level === 0 && (
        <form onSubmit={handleReplySubmit} className="mt-2 ml-4 p-3 bg-gray-50 rounded-md border border-gray-200 space-y-2">
          <textarea 
            value={replyContents} 
            onChange={(e) => setReplyContents(e.target.value)} 
            rows={2} 
            placeholder={`@${comment.id} (원본 댓글 ID) 님에게 답글 작성...`} 
            className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500 shadow-sm"
            disabled={isSubmittingReply}
          />
          {replyError && <p className="text-xs text-red-600">{replyError}</p>}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={toggleReplyForm} className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md" disabled={isSubmittingReply}>취소</button>
            <button type="submit" className="px-3 py-1 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-md" disabled={isSubmittingReply}>
              {isSubmittingReply ? '등록 중...' : '답글 등록'}
            </button>
          </div>
        </form>
      )}

      {level === 0 && comment.children && comment.children.length > 0 && (
        <div className="mt-2">
          {comment.children.map(childComment => (
            <CommentItem 
              key={childComment.id} 
              comment={childComment} 
              postId={postId} 
              onCommentUpdated={onCommentUpdated} 
              onCommentDeleted={onCommentDeleted}
              onReplyCreated={onReplyCreated}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem; 