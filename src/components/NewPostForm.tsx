import React, { useState } from 'react';
import type { CreatePostData } from '../types'; // 필요시 임포트
import { createPostAPI } from '../services/postApi'; // createPostAPI 임포트
import { ApiError } from '../services/apiErrors'; // ApiError 임포트

interface NewPostFormProps {
  onClose: (refreshNeeded?: boolean) => void; // refreshNeeded 파라미터 추가
}

const NewPostForm: React.FC<NewPostFormProps> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !contents.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      // await new Promise(resolve => setTimeout(resolve, 1000)); // 가상 지연 시간
      await createPostAPI({ title, contents }); 
      // alert('새 글이 성공적으로 작성되었습니다.'); // alert 대신 부모에게 알림
      onClose(true); // 성공 시 true 전달하여 목록 새로고침
    } catch (err) {
      console.error('Error creating post:', err);
      if (err instanceof ApiError) {
        setError(err.backendMessage || '글 작성 중 오류가 발생했습니다.');
      } else {
        setError('글 작성 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 font-sans bg-white shadow-md rounded-lg mt-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">새 게시글 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="contents" className="block text-sm font-medium text-gray-700 mb-1">
            내용
          </label>
          <textarea
            id="contents"
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            rows={10}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
            disabled={isSubmitting}
          />
        </div>
        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => onClose()} // 취소 시 refreshNeeded 없이 호출
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
          >
            {isSubmitting ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPostForm; 