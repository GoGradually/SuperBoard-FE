import React, { useState } from 'react';
import type { CommentWithChildren } from '../../../types/index';
import CommentForm from './CommentForm';
import { ApiError } from '../../../services/apiErrors'; // 에러 처리를 위해 유지할 수 있음

interface CommentItemProps {
  comment: CommentWithChildren;
  postId: number;
  onCommentUpdated: (commentId: number, updatedContents: string) => Promise<void> | void;
  onCommentDeleted: (commentId: number) => Promise<void> | void;
  onReplyCreated: () => void;
  level: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, postId, onCommentUpdated, onCommentDeleted, onReplyCreated, level }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContents, setEditedContents] = useState(comment.contents);
  const [editError, setEditError] = useState<string | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedContents(comment.contents);
      setEditError(null);
    }
    setIsEditing(!isEditing);
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editedContents.trim()) {
      setEditError('댓글 내용을 입력해주세요.');
      return;
    }
    setIsEditSubmitting(true);
    setEditError(null);
    try {
      await onCommentUpdated(comment.id, editedContents);
      setIsEditing(false);
    } catch (err: any) {
      console.error(`Error updating comment ${comment.id}:`, err);
      if (err instanceof ApiError) {
        setEditError(err.backendMessage || '댓글 수정 중 오류가 발생했습니다.');
      } else {
        setEditError('댓글 수정에 실패했습니다.');
      }
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      try {
        await onCommentDeleted(comment.id);
      } catch (err) {
        console.error(`Error deleting comment ${comment.id} from CommentItem:`, err);
        alert('댓글 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleReplyFormToggle = () => {
    setShowReplyForm(!showReplyForm);
  };

  const handleReplySubmitSuccess = () => {
    onReplyCreated();
    setShowReplyForm(false);
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
                <button onClick={handleReplyFormToggle} className="text-xs font-medium text-green-600 hover:text-green-800 focus:outline-none" disabled={isEditSubmitting}>답글</button>
              )}
              <button onClick={handleEditToggle} className="text-xs font-medium text-blue-600 hover:text-blue-800 focus:outline-none" disabled={isEditSubmitting}>수정</button>
              <button onClick={handleDelete} className="text-xs font-medium text-red-600 hover:text-red-800 focus:outline-none" disabled={isEditSubmitting}>삭제</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateSubmit} className="space-y-2" id={`comment-edit-form-${comment.id}`}>
            <textarea value={editedContents} onChange={(e) => setEditedContents(e.target.value)} rows={3} className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 shadow-inner bg-gray-50" disabled={isEditSubmitting} placeholder="댓글 수정..."/>
            {editError && <p className="text-xs text-red-600 mt-1">{editError}</p>}
            <div className="flex justify-end space-x-2 items-center">
              {isEditSubmitting && <p className="text-xs text-gray-500 mr-2">처리 중...</p>}
              <button onClick={handleEditToggle} type="button" className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md focus:outline-none" disabled={isEditSubmitting}>취소</button>
              <button type="submit" className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none" disabled={isEditSubmitting || !editedContents.trim()}>저장</button>
            </div>
          </form>
        )}
      </div>

      {showReplyForm && level === 0 && (
        <CommentForm 
          postId={postId} 
          parentId={comment.id} 
          onSubmitSuccess={handleReplySubmitSuccess}
          onCancel={handleReplyFormToggle}
          submitButtonText="답글 등록"
          placeholderText={`${comment.username}님에게 답글 남기기...`}
          autoFocus={true}
        />
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