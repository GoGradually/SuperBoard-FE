import type { PageState } from './shared.types';
import type { Comment } from './comment.types';

export interface PostLine {
  postId: number;
  postTitle: string;
  commentCount: number;
  viewCount: number;
}

export interface PostsApiResponse {
  postLines: PostLine[];
  pageState: PageState;
}

export interface PostDetailResponse {
  id: number;
  title: string;
  contents: string;
  comments: Comment[];
  viewCount: number;
}

export interface CreatePostData {
  title: string;
  contents: string;
} 