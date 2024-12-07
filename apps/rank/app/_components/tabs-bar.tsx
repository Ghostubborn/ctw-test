'use client';

import { RankType } from "@/types/user-rank";
import { Tab, Tabs } from "@nextui-org/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type Props = {
  currentTab: RankType
}

const tabsData: {
  key: RankType;
  name: string;
}[] = [
  {
    key: 'daily',
    name: '日排名',
  },
  {
    key: 'weekly',
    name: '周排名',
  },
  {
    key: 'monthly',
    name: '月排名',
  },
]

export default function TabsBar({ currentTab }: Props) {
  const [selectedKey, setSelectedKey] = useState<RankType>(currentTab);
  // TODO: use custom hook to handle searchParams changes
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const updateTab = (key: RankType) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('type', key);
    newSearchParams.set('page', '1');
    router.replace(`${pathname}&${newSearchParams.toString()}`);
  }

  return (
    <Tabs
      items={tabsData}
      selectedKey={selectedKey}
      onSelectionChange={(key) => {
        const newRankType = key as RankType;
        setSelectedKey(newRankType);
        updateTab(newRankType);
      }}
    >
      {(item) => (
        <Tab key={item.key} title={item.name} />
      )}
    </Tabs>
  );
}
