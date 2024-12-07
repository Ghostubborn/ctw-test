export type RankType = 'daily' | 'weekly' | 'monthly';

export interface UserRankDetailRequest {
  userId: string;
  type: RankType
}

interface RankHistoryItem {
  time: string;
  rank: number;
  score: number;
}

interface AchievementItem {
  id: string;
  name: string;
  icon: string;
  obtainTime: string;
}

export interface UserRankDetailData {
  currentRank: number;
  bestRank: number;
  rankHistory: RankHistoryItem[];
  achievements: AchievementItem[];
}