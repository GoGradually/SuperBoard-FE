import React from 'react';
import type { PostLine } from '../../../types/index'; // 공용 타입 임포트

interface PostTableProps {
  posts: PostLine[];
  onPostClick: (postId: number) => void;
}

const PostTable: React.FC<PostTableProps> = ({ posts, onPostClick }) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        게시글이 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md sm:rounded-lg mt-4">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-100">
        <tr>
            <th scope="col" className="px-6 py-3">
            ID
          </th>
            <th scope="col" className="px-6 py-3">
            제목
          </th>
            <th scope="col" className="px-6 py-3 text-center">
            댓글 수
          </th>
        </tr>
      </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.postId} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {post.postId}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onPostClick(post.postId)}
                  className="font-medium text-blue-600 hover:underline focus:outline-none"
                >
                  {post.postTitle}
                </button>
              </td>
              <td className="px-6 py-4 text-center">
                {post.commentCount}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);
};

export default PostTable;