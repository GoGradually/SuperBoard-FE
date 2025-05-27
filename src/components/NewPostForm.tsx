import React, { useState } from 'react';

interface NewPostFormProps {
  onCancel: () => void; // 취소 버튼 클릭 시 호출될 함수
  onSubmit: (title: string, contents: string) => void; // 작성 버튼 클릭 시 호출될 함수
}

const NewPostForm: React.FC<NewPostFormProps> = ({ onCancel, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [contents, setContents] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // 입력값 유효성 검사 (간단한 예시)
    if (!title.trim() || !contents.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    onSubmit(title, contents);
    // 성공적으로 제출 후 입력 필드 초기화 (선택 사항)
    setTitle('');
    setContents('');
  };

  return (
    <div className="container mx-auto p-4 font-sans bg-white shadow-md rounded-lg mt-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">새 게시글 작성</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            제목
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="제목을 입력하세요"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="contents" className="block text-gray-700 text-sm font-bold mb-2">
            내용
          </label>
          <textarea
            id="contents"
            name="contents"
            placeholder="내용을 입력하세요"
            required
            rows={10}
            value={contents}
            onChange={(e) => setContents(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            작성
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPostForm; 