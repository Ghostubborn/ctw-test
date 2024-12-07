'use client';

import { RankItem, RankListData } from "@/types/rank-list";
import { Avatar, Button, useDisclosure } from "@nextui-org/react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserModal from "./user-modal";
import { RankType } from "@/types/user-rank";

type Props = {
  currentTab: RankType;
  data: RankListData['list'];
}

function RankListItem({ data, onSelect }: { data: RankItem, onSelect: () => void }) {
  return (
    // @ts-expect-error onExit is valid
    <motion.li onExit={{ opacity: 0 }}>
      <Avatar src={data.avatar} />
      <span>{data.nickname}</span>
      <span>{data.rank}</span>
      <span className={clsx(
        data.rankChange > 0 ? 'text-red-500' : 'text-green-500'
      )}>{data.rankChange}</span>
      <Button variant="ghost" onClick={() => onSelect}>详情</Button>
    </motion.li>
  )
}

export default function RankList({ currentTab, data }: Props) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [currentUser, setCurrentUser] = useState<RankItem>();
  const [higherRankUser, setHigherRankUser] = useState<RankItem>();
  const [lowerRankUser, setLowerRankUser] = useState<RankItem>();

  const router = useRouter();
  useEffect(() => {
    const timer = setInterval(() => {
      router.refresh();
    });

    return () => {
      clearInterval(timer);
    }
  }, [router]);

  return (
    <>
      <ul className="p-3 rounded flex flex-col gap-3">
        <AnimatePresence>
          {data.map((item, index) => (
            <RankListItem
              data={item}
              key={item.userId}
              onSelect={() => {
                setCurrentUser(item)
                // TODO: better to use an api to request belowing data
                setHigherRankUser(data[index - 1]);
                setLowerRankUser(data[index + 1]);
                onOpen();
              }}
            />
          ))}
        </AnimatePresence>
      </ul>
      {
        currentUser && (
          <UserModal
            higherRankUser={higherRankUser}
            lowerRankUser={lowerRankUser}
            currentTab={currentTab}
            data={currentUser}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          />
        )
      }
    </>
  )
}
