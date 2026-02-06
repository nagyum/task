"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { BoardCategoryMap, BoardListResponse } from "@/src/types/board";
import BoardListItem from "./BoardListItem";
import BoardPagination from "./BoardPagination";
import BoardListSkeleton from "./BoardListSkeleton";
import style from "./BoardList.module.scss";
import { getBoardCategories, getBoards } from "@/src/api/boardApi";
import { getStoredAccessToken } from "@/src/api/client";

type Props = {
  page: number;
  size: number;
};

function getErrorStatus(err: unknown): number | null {
  if (typeof err !== "object" || err === null) return null;
  if (!("status" in err)) return null;

  const status = (err as { status?: unknown }).status;
  return typeof status === "number" ? status : null;
}

export default function BoardList({ page, size }: Props) {
  const router = useRouter();
  const [data, setData] = useState<BoardListResponse | null>(null);
  const [categories, setCategories] = useState<BoardCategoryMap | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const accessToken = getStoredAccessToken();

    if (!accessToken) {
      router.push("/signin");
      return;
    }

    (async () => {
      await Promise.resolve();
      if (cancelled) return;

      setLoading(true);
      setErrorMessage(null);

      Promise.all([
        getBoards({ page, size }, accessToken),
        getBoardCategories(accessToken),
      ])
        .then(([listResult, categoryResult]) => {
          if (cancelled) return;
          setData(listResult);
          setCategories(categoryResult);
        })
        .catch((err) => {
          if (cancelled) return;
          const status = getErrorStatus(err);
          if (status === 401 || status === 403) {
            router.push("/signin");
            return;
          }
          setErrorMessage(
            "게시글을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
          );
        })
        .finally(() => {
          if (cancelled) return;
          setLoading(false);
        });
    })();

    return () => {
      cancelled = true;
    };
  }, [page, size, router]);

  if (loading) {
    return <BoardListSkeleton />;
  }

  if (!data || !categories) {
    return (
      <section className={style.container}>
        <header className={style.header}>
          <h1 className={style.title}>커뮤니티</h1>
          <Link href="/board/new" className={style.newButton}>
            새 글 작성
          </Link>
        </header>
        {errorMessage && <p className={style.error}>{errorMessage}</p>}
      </section>
    );
  }

  return (
    <section className={style.container}>
      <header className={style.header}>
        <h1 className={style.title}>커뮤니티</h1>
        <Link href="/board/new" className={style.newButton}>
          새 글 작성
        </Link>
      </header>

      {data.content.length === 0 ? (
        <p className={style.empty}>등록된 글이 없습니다.</p>
      ) : (
        <ul className={style.list}>
          {data.content.map((b) => (
            <BoardListItem key={b.id} board={b} label={categories[b.category]} />
          ))}
        </ul>
      )}

      <BoardPagination
        page={page}
        size={size}
        totalPages={data.totalPages}
        isFirst={data.first}
        isLast={data.last}
      />
    </section>
  );
}
