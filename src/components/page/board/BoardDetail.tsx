"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import type { BoardCategoryMap, BoardDetail as BoardDetailType } from "@/src/types/board";
import { deleteBoard } from "@/src/api/boardApi";
import { getApiBaseUrl, getStoredAccessToken } from "@/src/api/client";
import style from "./BoardDetail.module.scss";

type Props = {
  board: BoardDetailType;
  categories: BoardCategoryMap;
};

const BASE_URL = getApiBaseUrl();

export default function BoardDetail({ board, categories }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryLabel = categories[board.boardCategory] ?? board.boardCategory;
  const imageUrl = board.imageUrl ? `${BASE_URL}${board.imageUrl}` : null;
  const createdAt = new Date(board.createdAt).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    setIsDeleting(true);
    try {
      const accessToken = getStoredAccessToken();
      await deleteBoard(board.id, accessToken ?? undefined);
      router.push("/board");
      router.refresh();
    } catch (err) {
      alert("삭제에 실패했습니다.");
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className={style.container}>
      <header className={style.header}>
        <span className={style.category}>{categoryLabel}</span>
        <h1 className={style.title}>{board.title}</h1>
        <time className={style.date}>
          {createdAt}
        </time>
      </header>

      {imageUrl && (
        <figure className={style.imageWrapper}>
          <Image
            src={imageUrl}
            alt={board.title}
            width={800}
            height={400}
            className={style.image}
            unoptimized
          />
        </figure>
      )}

      <div className={style.content}>
        {board.content.split("\n").map((line, i) => (
          <p key={i}>{line || <br />}</p>
        ))}
      </div>

      <footer className={style.footer}>
        <button
          type="button"
          className={style.backButton}
          onClick={() => router.back()}
        >
          목록으로
        </button>
        <div className={style.actions}>
          <Link href={`/board/${board.id}/edit`} className={style.editButton}>
            수정
          </Link>
          <button
            type="button"
            className={style.deleteButton}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </footer>
    </article>
  );
}
