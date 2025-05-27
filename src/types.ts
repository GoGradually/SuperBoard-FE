export interface PostLine {
  postId: number;
  postTitle: string;
  commentCount: number;
}

export interface PageState {
  startPage: number;
  endPage: number;
  currentPage: number;
  prevBlockPage: number;
  nextBlockPage: number;
  totalPages: number;
}

export interface PostsApiResponse {
  postLines: PostLine[];
  pageState: PageState;
}

export interface Comment {
  id: number;
  postId: number;
  writerNick: string;
  contents: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: number | null;
  children?: Comment[];
}

export interface CommentWithChildren extends Comment {
  children: CommentWithChildren[];
}

export interface PostDetailResponse {
  id: number;
  title: string;
  contents: string;
  comments: Comment[];
}

export interface RankingItemData {
  postId: number;
  postTitle: string;
  count: number; // 조회수 또는 추천수
}

export interface CreatePostData {
  title: string;
  contents: string;
}
