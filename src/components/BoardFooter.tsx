import React from 'react';

interface BoardFooterProps {
  year: number;
  message: string;
}

const BoardFooter: React.FC<BoardFooterProps> = ({ year, message }) => (
  <footer className="mt-12 text-center text-sm text-gray-500">
    <p>&copy; {year} {message}</p>
  </footer>
);

export default BoardFooter;