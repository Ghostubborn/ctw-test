import { RankType } from "./user-rank";

export interface RankDistributionRequest {
  type: RankType
}

interface DistributionItem {
  scoreRange: string;
  count: number;
  topScore: number;
  bottomScore: number;
}

interface PercentileItem {
  percentage: number;
  score: number;
}

export interface RankDistributionData {
  total: number;
  distribution: DistributionItem[];
  percentiles: PercentileItem[];
}