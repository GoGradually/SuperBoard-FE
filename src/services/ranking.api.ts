import type { RankingItemData } from '../types/index';
import { API_BASE_URL, handleApiResponseError } from './apiClient';

const RANKING_API_BASE_URL = `${API_BASE_URL}/api/ranking`;

export const fetchViewsRankingAPI = async (): Promise<RankingItemData[]> => {
  try {
    const response = await fetch(`${RANKING_API_BASE_URL}/views`);
    if (!response.ok) {
      throw await handleApiResponseError(response, '조회수 랭킹을 불러오는 데 실패했습니다.');
    }
    const data: RankingItemData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching views ranking:', error);
    throw error;
  }
};

export const fetchLikesRankingAPI = async (): Promise<RankingItemData[]> => {
  try {
    const response = await fetch(`${RANKING_API_BASE_URL}/likes`);
    if (!response.ok) {
      throw await handleApiResponseError(response, '추천수 랭킹을 불러오는 데 실패했습니다.');
    }
    const data: RankingItemData[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching likes ranking:', error);
    throw error;
  }
}; 