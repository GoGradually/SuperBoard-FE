import type { PostLine, PostsApiResponse, PostDetailResponse, CreatePostData } from '../types/index';
import { API_BASE_URL, handleApiResponseError } from './apiClient';

const POST_API_URL = `${API_BASE_URL}/post`;

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
  if (!response.ok && response.status !== 204) {
    throw await handleApiResponseError(response, `ID ${postId} 게시글 삭제에 실패했습니다.`);
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

export type SearchType = 'title' | 'contents' | 'title_contents';

export const searchPostsAPI = async (searchType: SearchType, query: string, page: number): Promise<PostsApiResponse> => {
  if (!query.trim()) {
    return { postLines: [], pageState: { currentPage: 1, totalPages: 0, startPage: 1, endPage: 0, prevBlockPage:1, nextBlockPage:0 } }; 
  }
  const response = await fetch(`${POST_API_URL}/search?type=${searchType}&query=${encodeURIComponent(query)}&page=${page}`);
  if (!response.ok) {
    throw await handleApiResponseError(response, '게시글 검색에 실패했습니다.');
  }
  return response.json();
}; 