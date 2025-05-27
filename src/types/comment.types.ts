export interface Comment {
  id: number;
  postId: number;
  userId: number;
  username: string;
  contents: string;
  createdAt: string;
  updatedAt: string;
  parentId: number | null;
}

export interface CommentWithChildren extends Comment {
  children: CommentWithChildren[];
} 