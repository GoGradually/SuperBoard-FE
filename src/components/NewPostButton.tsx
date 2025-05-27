import React from 'react';
import { Edit3 } from 'lucide-react';

interface NewPostButtonProps {
  onClick: () => void;
}

const NewPostButton: React.FC<NewPostButtonProps> = ({ onClick }) => (
  <div className="mb-6 flex justify-end">
    <button
      onClick={onClick}
      className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
    >
      <Edit3 size={18} className="mr-2" />
      글 쓰기
    </button>
  </div>
);

export default NewPostButton;