import type { PostDetailResponse } from '../types/index'; // updateCommentAPI 반환 타입
import { API_BASE_URL, handleApiResponseError } from './apiClient';

const POST_API_URL = `${API_BASE_URL}/post`; // 게시글 ID가 필요하므로 유지

export const createCommentAPI = async (postId: number, commentData: { contents: string; parentId?: number | null }): Promise<string | null> => {
  const response = await fetch(`${POST_API_URL}/${postId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData),
  });

  if (response.status !== 201) { 
    throw await handleApiResponseError(response, `게시글 ID ${postId}에 댓글 생성 실패`);
  }
  return response.headers.get('Location'); 
};

export const updateCommentAPI = async (postId: number, commentId: number, commentData: { contents: string }): Promise<PostDetailResponse> => {
  const response = await fetch(`${POST_API_URL}/${postId}/comments/${commentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData),
  });
  if (!response.ok) {
    throw await handleApiResponseError(response, `댓글 ID ${commentId} 수정 실패`);
  }
  return response.json();
};

export const deleteCommentAPI = async (postId: number, commentId: number): Promise<void> => {
  const response = await fetch(`${POST_API_URL}/${postId}/comments/${commentId}`, { method: 'DELETE' });
  if (!response.ok && response.status !== 204) {
    throw await handleApiResponseError(response, `댓글 ID ${commentId} 삭제 실패`);
  }
}; 