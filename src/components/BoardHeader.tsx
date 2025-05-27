import React from 'react';

interface BoardHeaderProps {
  title: string;
}

const BoardHeader: React.FC<BoardHeaderProps> = ({ title }) => (
  <header className="mb-8 text-center">
    <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
  </header>
);

export default BoardHeader;
