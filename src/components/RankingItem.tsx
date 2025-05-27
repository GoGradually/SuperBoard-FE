import React from 'react';
import type { RankingItemData } from '../types';

interface RankingItemProps {
  item: RankingItemData;
  rank: number;
  onItemClick: (postId: number) => void;
}

const RankingItem: React.FC<RankingItemProps> = ({ item, rank, onItemClick }) => {
  return (
    <li 
      className="py-2 px-3 flex justify-between items-center hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
      onClick={() => onItemClick(item.postId)}
    >
      <span className="text-sm font-medium text-gray-700 mr-2">{rank}.</span>
      <span className="text-sm text-gray-800 truncate flex-1" title={item.postTitle}>{item.postTitle}</span>
      <span className="text-xs text-gray-500 ml-2">({item.count})</span>
    </li>
  );
};

export default RankingItem; 