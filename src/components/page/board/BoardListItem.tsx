// src/components/board/BoardListItem.tsx
import type { Board } from "@/src/types/board";
import Link from "next/link";

type Props = {
  board: Board;
  label: string;
};

export default function BoardListItem({ board, label }: Props) {
  return (
    <li>
      <Link href={`/board/${board.id}`}>
        <strong>[{label}]</strong> {board.title}
      </Link>
      <span style={{ marginLeft: 8, opacity: 0.7 }}>
        {new Date(board.createdAt).toLocaleString()}
      </span>
    </li>
  );
}
