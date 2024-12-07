'use server';

import { CommonResponse } from "@/types/common";
import { RankDistributionData, RankDistributionRequest } from "@/types/rank-distribution";
import { RankListData, RankListRequest } from "@/types/rank-list";
import { UserRankDetailData, UserRankDetailRequest } from "@/types/user-rank";

type FetchArgs = Parameters<typeof fetch>;

type ResponseType<T> = {
  ok: false,
  message: string
} | {
  ok: true,
  data: T | undefined
}
/**
 * @type T response type
 * 
 * @param input fetch input arg
 * @param init fetch init arg
 * @returns 
 */
export default async function serverFetch<T>(
  input: FetchArgs[0],
  init: FetchArgs[1]
): Promise<ResponseType<T>> {
  const response = await fetch(input, init);
  if (!response.ok) {
    return {
      ok: false,
      // TODO: use response error message or http error
      message: ''
    };
  }

  let resultData: CommonResponse<T> | undefined = undefined;
  try {
    resultData = await response.json();
  } catch (e) {
    // TODO: use log lib, maybe winston
    console.log('request error', input, init, e);
  }

  if (!resultData || !resultData.success) {
    return {
      ok: false,
      message: ''
    }
  }

  return {
    ok: true,
    data: resultData.resultInfo
  }
}

export async function queryRankList(payload: RankListRequest) {
  const response = await serverFetch<RankListData>('/api/rank-list', {
    body: JSON.stringify(payload),
    method: 'POST'
  });

  return response.ok ? response.data : undefined;
}

export async function queryUserRankDetail(payload: UserRankDetailRequest) {
  const response = await serverFetch<UserRankDetailData>('/api/user-rank-detail', {
    body: JSON.stringify(payload),
    method: 'POST',
  });

  return response.ok ? response.data : undefined;
}

export async function queryRankDistribution(payload: RankDistributionRequest) {
  const response = await serverFetch<RankDistributionData>('/api/rank-distribution', {
    body: JSON.stringify(payload),
    method: 'POST'
  });

  return response.ok ? response.data : undefined;
}

export async function queryRankDistance(userId: string) {
  /**
   * 1. query userId detail
   * 2. query userId where score < {currentUserScore} order by score desc limit 1
   * 3. query userId where score > {currentUserScore} order by score asc limit 1
   * 4. query 3 rankDetails
   * 5. calc 3 scoreRate
   * 6. calc 2 scoreRateDiff and scoreDiff
   * 7. calc time to catch up front user, and time to be caught up by behind user
   */

  return {
    higherRankUser: { scoreDiff: 30, timeToCatchUp: 23000 }
  }
}
