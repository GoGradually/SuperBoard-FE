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
  contents: string;
  parentId: number | null;
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
