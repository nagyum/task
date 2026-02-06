import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import BoardDetail from "@/src/components/page/board/BoardDetail";
import { getBoardById, getBoardCategories } from "@/src/api/boardApi";

type Props = {
  params: Promise<{ id: string }>;
};

function getErrorStatus(err: unknown): number | null {
  if (typeof err !== "object" || err === null) return null;
  if (!("status" in err)) return null;

  const status = (err as { status?: unknown }).status;
  return typeof status === "number" ? status : null;
}

export default async function BoardDetailPage({ params }: Props) {
  const { id } = await params;
  const boardId = Number(id);

  if (Number.isNaN(boardId)) {
    redirect("/board");
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken && !refreshToken) {
    redirect("/signin");
  }

  const tokens = { accessToken, refreshToken };

  let board;
  let categories;

  try {
    [board, categories] = await Promise.all([
      getBoardById(boardId, tokens),
      getBoardCategories(tokens),
    ]);
  } catch (err) {
    const status = getErrorStatus(err);

    if (status === 401 || status === 403) {
      redirect("/signin");
    }

    if (status === 404) {
      notFound();
    }

    throw err;
  }

  return <BoardDetail board={board} categories={categories} />;
}
