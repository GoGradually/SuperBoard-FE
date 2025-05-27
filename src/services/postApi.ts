import type { PostLine, PostsApiResponse, PageState, PostDetailResponse, Comment } from '../types';
import { ApiError } from './apiErrors';

const API_BASE_URL = 'http://localhost:8080/post';

// 공통 에러 처리 함수
async function handleApiResponseError(response: Response, defaultErrorMessage: string): Promise<ApiError> {
  let backendMessage = defaultErrorMessage;
  try {
    // 백엔드가 문자열로 에러 메시지를 보낸다고 가정
    const errorText = await response.text(); 
    if (errorText) {
      backendMessage = errorText;
    }
  } catch (e) {
    // 응답 본문 파싱 실패 시 기본 메시지 사용
    console.error('Failed to parse error response body:', e);
  }
  return new ApiError(defaultErrorMessage, response.status, backendMessage);
}

export const fetchPostsAPI = async (page: number): Promise<PostsApiResponse> => {
  const response = await fetch(`${API_BASE_URL}?page=${page}`);
  if (!response.ok) {
    throw await handleApiResponseError(response, '게시글 목록을 불러오는 데 실패했습니다.');
  }
  return response.json();
};

export const fetchPostDetailAPI = async (postId: number): Promise<PostDetailResponse> => {
  const response = await fetch(`${API_BASE_URL}/${postId}`);
  if (!response.ok) {
    throw await handleApiResponseError(response, `ID ${postId} 게시글 상세 정보를 불러오는 데 실패했습니다.`);
  }
  return response.json();
};

export const updatePostAPI = async (postId: number, postData: { title: string; contents: string }): Promise<PostDetailResponse> => {
  const response = await fetch(`${API_BASE_URL}/${postId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  if (!response.ok) {
    throw await handleApiResponseError(response, `ID ${postId} 게시글 수정에 실패했습니다.`);
  }
  return response.json();
};

export const deletePostAPI = async (postId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${postId}`, { method: 'DELETE' });
  if (!response.ok && response.status !== 204) { // 204는 성공으로 간주
    throw await handleApiResponseError(response, `ID ${postId} 게시글 삭제에 실패했습니다.`);
  }
  // 204 No Content는 성공, 별도 .json() 호출 없음
};

export const createCommentAPI = async (postId: number, commentData: { contents: string; parentId?: number | null }): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/${postId}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentData),
  });
  if (!response.ok) {
    throw await handleApiResponseError(response, `게시글 ID ${postId}에 댓글 생성 실패`);
  }
  return response.json();
};

export const updateCommentAPI = async (postId: number, commentId: number, commentData: { contents: string }): Promise<Comment> => {
  const response = await fetch(`${API_BASE_URL}/${postId}/comment/${commentId}`, {
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
  const response = await fetch(`${API_BASE_URL}/${postId}/comment/${commentId}`, { method: 'DELETE' });
  if (!response.ok && response.status !== 204) { // 204는 성공으로 간주
    throw await handleApiResponseError(response, `댓글 ID ${commentId} 삭제 실패`);
  }
}; 