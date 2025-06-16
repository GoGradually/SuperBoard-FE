import React, { useState } from 'react';
import { likePostAPI, dislikePostAPI } from '../../../services/post.api';
import { ApiError } from '../../../services/apiErrors';

interface PostLikeButtonsProps {
  postId: number;
  likeCount: number;
  onLikeUpdated: () => void;
}

const PostLikeButtons: React.FC<PostLikeButtonsProps> = ({ postId, likeCount, onLikeUpdated }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLike = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await likePostAPI(postId);
      onLikeUpdated();
    } catch (err: any) {
      console.error('Error liking post:', err);
      if (err instanceof ApiError) {
        setError(err.backendMessage || '추천 처리 중 오류가 발생했습니다.');
      } else {
        setError('추천 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDislike = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await dislikePostAPI(postId);
      onLikeUpdated();
    } catch (err: any) {
      console.error('Error disliking post:', err);
      if (err instanceof ApiError) {
        setError(err.backendMessage || '비추천 처리 중 오류가 발생했습니다.');
      } else {
        setError('비추천 처리 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 mb-6">

      <button
        onClick={handleLike}
        disabled={isSubmitting}
        className="flex items-center gap-1 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
      >
        <span className="text-xl">👍</span>
      </button>
      <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
        <span className="text-lg font-semibold text-gray-700">{likeCount}</span>
        <span className="text-sm text-gray-500">추천</span>
      </div>

      <button
        onClick={handleDislike}
        disabled={isSubmitting}
        className="flex items-center gap-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
      >
        <span className="text-xl">👎</span>
      </button>
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
};

export default PostLikeButtons; 