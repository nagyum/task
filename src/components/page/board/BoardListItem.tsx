// src/components/board/BoardListItem.tsx
import type { Board } from "@/src/types/board";
import Link from "next/link";
import style from "./BoardListItem.module.scss";

type Props = {
  board: Board;
  label: string;
};

export default function BoardListItem({ board, label }: Props) {
  return (
    <li className={style.item}>
      <Link href={`/board/${board.id}`} className={style.link}>
        <span className={style.category}>{label}</span>
        <span className={style.title}>{board.title}</span>
        <time className={style.date}>
          {new Date(board.createdAt).toLocaleDateString()}
        </time>
      </Link>
    </li>
  );
}
