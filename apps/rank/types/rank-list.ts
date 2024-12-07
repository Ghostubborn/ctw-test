import { RankType } from "./user-rank";

export interface RankListRequest {
  type: RankType;
  page: number;
  pageSize: number;
}

interface BadgeItem {
  id: string;
  name: string;
  icon: string;
}

export interface RankItem {
  rank: number;
  userId: string;
  nickname: string;
  avatar: string;
  score: number;
  rankChange: number;
  badges: BadgeItem[];
}

export interface RankListData {
  total: number;
  currentTime: string;
  nextUpdateTime: string;
  list: RankItem[];
}
