import BoardList from "@/src/components/page/board/BoardList";

type Props = {
  searchParams?: Promise<{
    page?: string | string[];
    size?: string | string[];
  }>;
};

function toNumber(value: string | string[] | undefined, fallback: number) {
  const v = Array.isArray(value) ? value[0] : value;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export default async function BoardPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const pageParam = toNumber(resolvedSearchParams?.page, 1);
  const size = toNumber(resolvedSearchParams?.size, 10);
  const page = Math.max(pageParam - 1, 0);

  return <BoardList page={page} size={size} />;
}
