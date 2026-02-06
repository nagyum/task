// src/components/board/BoardList.tsx
import Link from "next/link";
import type { BoardCategoryMap, BoardListResponse } from "@/src/types/board";
import BoardListItem from "./BoardListItem";
import BoardPagination from "./BoardPagination";
import style from "./BoardList.module.scss";

type Props = {
  data: BoardListResponse;
  categories: BoardCategoryMap;
  page: number;
  size: number;
};

export default function BoardList({ data, categories, page, size }: Props) {
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
