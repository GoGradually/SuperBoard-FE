export interface Comment {
  commentId: number;
  postId: number;
  contents: string;
}

export interface CommentWithChildren extends Comment {
  children: CommentWithChildren[];
} 