import type { PostLine, PostsApiResponse, PageState, PostDetailResponse, Comment, RankingItemData, CreatePostData } from '../types';
import { ApiError } from './apiErrors';

const API_BASE_URL = 'http://localhost:8080';
const POST_API_URL = `${API_BASE_URL}/post`;

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
  const response = await fetch(`${POST_API_URL}?page=${page}`);
  if (!response.ok) {
    throw await handleApiResponseError(response, '게시글 목록을 불러오는 데 실패했습니다.');
  }
  return response.json();
};

export const fetchPostDetailAPI = async (postId: number): Promise<PostDetailResponse> => {
  const response = await fetch(`${POST_API_URL}/${postId}`);
  if (!response.ok) {
    throw await handleApiResponseError(response, `ID ${postId} 게시글 상세 정보를 불러오는 데 실패했습니다.`);
  }
  return response.json();
};

export const updatePostAPI = async (postId: number, postData: { title: string; contents: string }): Promise<PostDetailResponse> => {
  const response = await fetch(`${POST_API_URL}/${postId}`, {
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
  const response = await fetch(`${POST_API_URL}/${postId}`, { method: 'DELETE' });
  if (!response.ok && response.status !== 204) { // 204는 성공으로 간주
    throw await handleApiResponseError(response, `ID ${postId} 게시글 삭제에 실패했습니다.`);
  }
  // 204 No Content는 성공, 별도 .json() 호출 없음
};

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
  if (!response.ok && response.status !== 204) { // 204는 성공으로 간주
    throw await handleApiResponseError(response, `댓글 ID ${commentId} 삭제 실패`);
  }
};

export const createPostAPI = async (postData: CreatePostData): Promise<string | null> => {
  try {
    const response = await fetch(POST_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    if (response.status !== 201) { 
      throw await handleApiResponseError(response, '게시글 생성에 실패했습니다.');
    }
    return response.headers.get('Location');
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// --- 랭킹 API 함수들 --- 
const RANKING_API_BASE_URL = `${API_BASE_URL}/api/ranking`; // 랭킹 API 기본 경로 (예시)

export const fetchViewsRankingAPI = async (): Promise<RankingItemData[]> => {
  try {
    const response = await fetch(`${RANKING_API_BASE_URL}/views`);
    if (!response.ok) {
      throw await handleApiResponseError(response, '조회수 랭킹을 불러오는 데 실패했습니다.');
    }
    const data: RankingItemData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching views ranking:', error);
    throw error; // 에러를 다시 throw하여 ErrorBoundary 또는 호출부에서 처리
  }
};

export const fetchLikesRankingAPI = async (): Promise<RankingItemData[]> => {
  try {
    const response = await fetch(`${RANKING_API_BASE_URL}/likes`);
    if (!response.ok) {
      throw await handleApiResponseError(response, '추천수 랭킹을 불러오는 데 실패했습니다.');
    }
    const data: RankingItemData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching likes ranking:', error);
    throw error;
  }
};

export type SearchType = 'title' | 'contents' | 'title_contents'; // 검색 타입 정의

export const searchPostsAPI = async (searchType: SearchType, query: string, page: number): Promise<PostsApiResponse> => {
  if (!query.trim()) {
    // 검색어가 비어있으면 일반 목록 조회로 처리하거나, 에러 또는 빈 결과 반환
    // 여기서는 예시로 빈 결과를 반환하도록 처리 (실제 구현에 따라 다를 수 있음)
    // 또는 throw new Error("검색어를 입력해주세요.");
    // 또는 return fetchPostsAPI(page); // 일반 목록으로 대체
    return { postLines: [], pageState: { currentPage: 1, totalPages: 0, startPage: 1, endPage: 0, prevBlockPage:1, nextBlockPage:0 } }; 
  }
  const response = await fetch(`${POST_API_URL}/search?type=${searchType}&query=${encodeURIComponent(query)}&page=${page}`);
  if (!response.ok) {
    throw await handleApiResponseError(response, '게시글 검색에 실패했습니다.');
  }
  return response.json();
}; 