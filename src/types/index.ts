export * from './post.types';
export * from './comment.types';
export * from './shared.types';
export * from './ranking.types';

export interface PostDetailResponse {
  postId: number;
  title: string;
  contents: string;
  comments: import('./comment.types').Comment[];
  likeCount: number;
}
