'use client';

import { queryUserRankDetail } from "@/server-actions";
import { RankItem } from "@/types/rank-list";
import { RankType } from "@/types/user-rank";
import { Avatar, Button, Modal, ModalBody, ModalContent, ModalFooter, Skeleton } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import UserRankChart from "./user-rank-chart";
import Image from "next/image";
import { useMemo } from "react";
import moment from "moment";

type Props = {
  data: RankItem;
  higherRankUser?: RankItem;
  lowerRankUser?: RankItem;
  isOpen: boolean;
  onOpenChange: () => void;
  currentTab: RankType;
}

type RankChangeHistoryItem = {
  time: string;
  rankChange: number;
  scoreChange: number;
  duration: string;
}

function UserRankSkeleton() {
  return (
    <Skeleton>
      <section>
        <div className="w-10 h-4"></div>
      </section>
      <div className="w-96 h-36"></div>
      <ul className="flex gap-3">
        <li className="basis-0 h-24"></li>
        <li className="basis-0 h-24"></li>
        <li className="basis-0 h-24"></li>
      </ul>
    </Skeleton>
  );
}

export default function UserModal({
  currentTab,
  data,
  higherRankUser,
  lowerRankUser,
  isOpen,
  onOpenChange
}: Props) {
  const { data: userRankDetail, isLoading } = useQuery({
    queryKey: ['user-rank-detail', data.userId],
    queryFn: () => queryUserRankDetail({
      type: currentTab,
      userId: data.userId
    }),
  });
  const { data: higherRankUserDetail } = useQuery({
    queryKey: ['user-rank-detail', higherRankUser!.userId],
    queryFn: () => queryUserRankDetail({
      type: currentTab,
      userId: higherRankUser!.userId
    }),
    enabled: !!higherRankUser?.userId
  });
  const { data: lowerRankUserDetail } = useQuery({
    queryKey: ['user-rank-detail', lowerRankUser!.userId],
    queryFn: () => queryUserRankDetail({
      type: currentTab,
      userId: lowerRankUser!.userId
    }),
    enabled: !!lowerRankUser?.userId
  })

  const rankChanges: RankChangeHistoryItem[] = useMemo(() => {
    if (!userRankDetail) {
      return [];
    }

    // assume user rank history is ordered by time desc
    const result = [];
    const list = userRankDetail.rankHistory;
    for (let i = 0; i <= list.length - 2; i++) {
      const change: RankChangeHistoryItem = {
        time: list[i].time,
        rankChange: list[i].rank - list[i + 1].rank,
        scoreChange: list[i].score - list[i + 1].score,
        duration: moment.duration(moment(list[i].time).diff(moment(list[i + 1].time))).humanize()
      }

      result.push(change)
    }

    return result;
  }, [userRankDetail])

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalBody>
              <section className="flex gap-2">
                <h2>用户信息</h2>
                <Avatar src={data.avatar} />
                <span>{data.nickname}</span>
              </section>
              {isLoading ? (<UserRankSkeleton />) : (
                <>
                  <section className="flex flex-col gap-2">
                    <div>
                      <span>历史最佳排名: </span>
                      <span>{userRankDetail?.bestRank}</span>
                    </div>
                  </section>
                  <section className="flex items-center">
                    <h2>排名变化</h2>
                    <UserRankChart width={384} height={144} data={userRankDetail?.rankHistory || []} />
                  </section>
                  <section>
                    <h2>成就徽章</h2>
                    <ul>
                      {(userRankDetail?.achievements || []).map(item => (
                        <li className="flex flex-col gap-2" key={item.id}>
                          <Image src={item.icon} alt={item.name} width={36} height={36} />
                          <span>{item.name}</span>
                          <span className="text-neutral-600">{item.obtainTime}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                  <section>
                    <h2>排名及得分变化历史</h2>
                    {rankChanges.map((item) => (
                      <p key={item.time}>
                        <span>{item.time}</span>
                        排名
                        {item.rankChange > 0 ? (
                          <span className='text-red-500'>+{item.rankChange}</span>
                        ) : (
                          <span className='text-green-500'>{item.rankChange}</span>
                        )}
                        分数
                        {item.scoreChange > 0 ? (
                          <span className='text-red-500'>+{item.scoreChange}</span>
                        ) : (
                          <span className='text-green-500'>{item.scoreChange}</span>
                        )}
                        用时
                        <span>{item.duration}</span>
                      </p>
                    ))}
                  </section>
                  <section>
                  </section>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => onClose()}>关闭</Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
