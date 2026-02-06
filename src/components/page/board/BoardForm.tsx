"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import type {
  BoardCategory,
  BoardCategoryMap,
  BoardDetail,
} from "@/src/types/board";
import { createBoard, updateBoard } from "@/src/api/boardApi";
import { getStoredAccessToken } from "@/src/api/client";
import style from "./BoardForm.module.scss";

type Props =
  | {
      mode: "create";
      categories: BoardCategoryMap;
    }
  | {
      mode: "edit";
      categories: BoardCategoryMap;
      board: BoardDetail;
    };

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://front-mission.bigs.or.kr";

export default function BoardForm(props: Props) {
  const { mode, categories } = props;
  const board = mode === "edit" ? props.board : null;

  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(board?.title ?? "");
  const [content, setContent] = useState(board?.content ?? "");
  const [category, setCategory] = useState<BoardCategory>(
    board?.boardCategory ?? "FREE",
  );
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    board?.imageUrl ? `${BASE_URL}${board.imageUrl}` : null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      setError("내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const accessToken = getStoredAccessToken();
      const data = { title: title.trim(), content: content.trim(), category };

      if (mode === "create") {
        await createBoard(data, image, accessToken ?? undefined);
      } else {
        await updateBoard(board!.id, data, image, accessToken ?? undefined);
      }

      router.push("/board");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(
        mode === "create"
          ? "글 등록에 실패했습니다."
          : "글 수정에 실패했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryEntries = Object.entries(categories) as [
    BoardCategory,
    string,
  ][];

  return (
    <div className={style.container}>
      <h1 className={style.title}>
        {mode === "create" ? "새 글 작성" : "글 수정"}
      </h1>

      <form onSubmit={handleSubmit} className={style.form}>
        {error && <p className={style.error}>{error}</p>}

        <div className={style.field}>
          <label htmlFor="category" className={style.label}>
            카테고리
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as BoardCategory)}
            className={style.select}
          >
            {categoryEntries.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className={style.field}>
          <label htmlFor="title" className={style.label}>
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={style.input}
            placeholder="제목을 입력하세요"
            maxLength={100}
          />
        </div>

        <div className={style.field}>
          <label htmlFor="content" className={style.label}>
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={style.textarea}
            placeholder="내용을 입력하세요"
            rows={10}
          />
        </div>

        <div className={style.actions}>
          <button
            type="button"
            onClick={() => router.back()}
            className={style.cancelButton}
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={style.submitButton}
          >
            {isSubmitting
              ? mode === "create"
                ? "등록 중..."
                : "수정 중..."
              : mode === "create"
                ? "등록"
                : "수정"}
          </button>
        </div>
      </form>
    </div>
  );
}
