import { queryRankList } from "@/server-actions";
import { RankListRequest } from "@/types/rank-list";
import { redirect } from "next/navigation";
import TabsBar from "./_components/tabs-bar";
import RankList from "./_components/rank-list";

type SearchParams = {
  // TODO: refine type as params,
  //      so client components can get current rankType from url using useLayoutSegment
  type: string;
  page: string;
  pageSize: string;
}

/**
 * validate, return validation result and parse data
 * when not valid, redirect to valid params page
 * 
 * @param searchParams 
 */
function parseSearchParams(searchParams: SearchParams) {
  // TODO: use zod to validate
  const result: RankListRequest = {
    type: searchParams.type as RankListRequest['type'],
    page: +searchParams.page as RankListRequest['page'],
    pageSize: +searchParams.pageSize as RankListRequest['pageSize'],
  }

  return {
    isValid: true,
    data: result
  }
}

export default async function ListPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const validationResult = parseSearchParams(await searchParams);
  if (!validationResult.isValid) {
    const url = new URL('/rank');
    if (validationResult.data.type) {
      url.searchParams.set('type', validationResult.data.type);
    }
    if (validationResult.data.page) {
      url.searchParams.set('page', validationResult.data.page.toString());
    }
    if (validationResult.data.pageSize) {
      url.searchParams.set('pageSize', validationResult.data.pageSize.toString());
    }
    redirect(url.href)
  }

  const data = await queryRankList(validationResult.data);

  return (
    <main className="flex flex-col items-center gap-4">
      <TabsBar currentTab={validationResult.data.type} />
      <RankList currentTab={validationResult.data.type} data={data?.list || []} />
      
    </main>
  );
}
