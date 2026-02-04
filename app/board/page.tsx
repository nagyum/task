import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import BoardList from "@/src/components/page/board/BoardList";
import { getBoardCategories, getBoards } from "@/src/api/boardApi";

type Props = {
  searchParams?: {
    page?: string | string[];
    size?: string | string[];
  };
};

function toNumber(value: string | string[] | undefined, fallback: number) {
  const v = Array.isArray(value) ? value[0] : value;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function getErrorStatus(err: unknown): number | null {
  if (typeof err !== "object" || err === null) return null;
  if (!("status" in err)) return null;

  const status = (err as { status?: unknown }).status;
  return typeof status === "number" ? status : null;
}

export default async function BoardPage({ searchParams }: Props) {
  const page = toNumber(searchParams?.page, 0);
  const size = toNumber(searchParams?.size, 10);

  const accessToken = (await cookies()).get("accessToken")?.value;
  if (!accessToken) redirect("/signin");

  let list;
  let categories;

  try {
    [list, categories] = await Promise.all([
      getBoards({ page, size }, accessToken),
      getBoardCategories(accessToken),
    ]);
  } catch (err) {
    const status = getErrorStatus(err);

    if (status === 401 || status === 403) {
      redirect("/signin");
    }

    throw err;
  }

  return (
    <BoardList data={list} categories={categories} page={page} size={size} />
  );
}
