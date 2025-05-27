import type { Comment, CommentWithChildren } from '../types/index';

export const buildCommentTree = (comments: Comment[]): CommentWithChildren[] => {
  const commentsById: { [key: number]: CommentWithChildren } = {};
  const rootComments: CommentWithChildren[] = [];

  // 각 댓글을 CommentWithChildren 타입으로 변환하고 children 배열 초기화
  comments.forEach(comment => {
    commentsById[comment.id] = { ...comment, children: [] };
  });

  // 트리를 구성
  comments.forEach(comment => {
    const currentCommentNode = commentsById[comment.id];
    if (comment.parentId && commentsById[comment.parentId]) {
      commentsById[comment.parentId].children.push(currentCommentNode);
    } else {
      rootComments.push(currentCommentNode);
    }
  });

  return rootComments;
}; 