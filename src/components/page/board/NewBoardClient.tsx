"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import BoardForm from "./BoardForm";
import type { BoardCategoryMap } from "@/src/types/board";
import { getBoardCategories } from "@/src/api/boardApi";
import { getStoredAccessToken } from "@/src/api/client";
import style from "./BoardForm.module.scss";

function getErrorStatus(err: unknown): number | null {
  if (typeof err !== "object" || err === null) return null;
  if (!("status" in err)) return null;

  const status = (err as { status?: unknown }).status;
  return typeof status === "number" ? status : null;
}

export default function NewBoardClient() {
  const router = useRouter();
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

      getBoardCategories(accessToken)
        .then((categoryResult) => {
          if (cancelled) return;
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
            "카테고리를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
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
  }, [router]);

  if (loading) {
    return (
      <div className={style.container}>
        <h1 className={style.title}>새 글 작성</h1>
        <p>불러오는 중...</p>
      </div>
    );
  }

  if (!categories) {
    return (
      <div className={style.container}>
        <h1 className={style.title}>새 글 작성</h1>
        {errorMessage && <p className={style.error}>{errorMessage}</p>}
      </div>
    );
  }

  return <BoardForm mode="create" categories={categories} />;
}
