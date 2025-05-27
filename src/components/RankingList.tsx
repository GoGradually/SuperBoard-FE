import React, { useState, useEffect } from 'react';
import type { RankingItemData } from '../types';
import RankingItem from './RankingItem';

interface RankingListProps {
  title: string;
  fetchRankingData: () => Promise<RankingItemData[]>;
  onItemClick: (postId: number) => void;
  refreshDependency?: string | number; // 데이터 새로고침을 트리거할 값
}

const RankingList: React.FC<RankingListProps> = ({ title, fetchRankingData, onItemClick, refreshDependency }) => {
  const [rankingData, setRankingData] = useState<RankingItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchRankingData();
        setRankingData(data);
      } catch (err: any) {
        console.error(`Error fetching ${title}:`, err);
        setError(err.backendMessage || '랭킹 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

  }, [fetchRankingData, title, refreshDependency]);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">{title}</h3>
      {isLoading && <p className="text-sm text-gray-500">로딩 중...</p>}
      {error && <p className="text-sm text-red-500">오류: {error}</p>}
      {!isLoading && !error && rankingData.length === 0 && (
        <p className="text-sm text-gray-500">랭킹 정보가 없습니다.</p>
      )}
      {!isLoading && !error && rankingData.length > 0 && (
        <ul className="divide-y divide-gray-200">
          {rankingData.map((item, index) => (
            <RankingItem 
              key={item.postId} 
              item={item} 
              rank={index + 1} 
              onItemClick={onItemClick} 
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default RankingList; 