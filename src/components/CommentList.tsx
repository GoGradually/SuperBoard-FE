import React, { useState, useEffect } from 'react';
import type { Comment as CommentType, CommentWithChildren } from '../types';
import CommentItem from './CommentItem';
import { createCommentAPI } from '../services/postApi';
import { buildCommentTree } from '../utils/commentUtils';

interface CommentListProps {
  initialComments: CommentType[];
  postId: number;
  onCommentsUpdatedInList: (updatedFlatComments: CommentType[]) => void;
}

const CommentList: React.FC<CommentListProps> = ({ initialComments, postId, onCommentsUpdatedInList }) => {
  const [commentTree, setCommentTree] = useState<CommentWithChildren[]>([]);
  const [flatComments, setFlatComments] = useState<CommentType[]>(initialComments);
  const [newCommentContents, setNewCommentContents] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setFlatComments(initialComments);
    setCommentTree(buildCommentTree(initialComments));
  }, [initialComments]);

  const handleCommentCreated = (newComment: CommentType) => {
    const updatedFlatComments = [newComment, ...flatComments];
    setFlatComments(updatedFlatComments);
    setCommentTree(buildCommentTree(updatedFlatComments));
    onCommentsUpdatedInList(updatedFlatComments);
  };

  const handleNewCommentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newCommentContents.trim()) {
      setSubmitError('댓글 내용을 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const createdComment = await createCommentAPI(postId, { contents: newCommentContents, parentId: null });
      handleCommentCreated(createdComment);
      setNewCommentContents('');
    } catch (err) {
      console.error('Error submitting new comment:', err);
      setSubmitError(err instanceof Error ? err.message : '댓글 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentUpdated = (updatedComment: CommentType) => {
    const updatedFlatComments = flatComments.map(c => c.id === updatedComment.id ? updatedComment : c);
    setFlatComments(updatedFlatComments);
    setCommentTree(buildCommentTree(updatedFlatComments));
    onCommentsUpdatedInList(updatedFlatComments);
  };

  const handleCommentDeleted = (commentId: number) => {
    const updatedFlatComments = flatComments.filter(c => c.id !== commentId);
    setFlatComments(updatedFlatComments);
    setCommentTree(buildCommentTree(updatedFlatComments));
    onCommentsUpdatedInList(updatedFlatComments);
  };

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">댓글 ({flatComments.length}개)</h3>
      
      <form onSubmit={handleNewCommentSubmit} className="mb-6 space-y-2">
        <textarea 
          value={newCommentContents} 
          onChange={(e) => setNewCommentContents(e.target.value)} 
          rows={3} 
          placeholder="따뜻한 댓글을 남겨주세요..."
          className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-gray-50 transition-shadow focus:shadow-md"
          disabled={isSubmitting}
        />
        <div className="flex justify-between items-center">
          {submitError && <p className="text-xs text-red-600">{submitError}</p>}
          {!submitError && <div />}
          <button 
            type="submit" 
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-60 transition-colors"
            disabled={isSubmitting}
          >
            {isSubmitting ? '등록 중...' : '댓글 등록'}
          </button>
        </div>
      </form>

      {commentTree.length === 0 && !isSubmitting && (
         <div className="text-center py-4 text-gray-500 border-dashed border-2 border-gray-300 rounded-md">
           <p className="text-sm">아직 댓글이 없습니다.</p>
           <p className="text-xs mt-1">첫 댓글을 작성해보세요!</p>
         </div>
      )}

      <div className="space-y-0">
        {commentTree.map(commentNode => (
          <CommentItem 
            key={commentNode.id} 
            comment={commentNode} 
            postId={postId} 
            onCommentUpdated={handleCommentUpdated} 
            onCommentDeleted={handleCommentDeleted}
            onReplyCreated={handleCommentCreated}
            level={0}
          />
        ))}
      </div>
    </div>
  );
};

export default CommentList; 