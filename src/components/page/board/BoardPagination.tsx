// src/components/board/BoardPagination.tsx
import Link from "next/link";
import style from "./BoardPagination.module.scss";

type Props = {
  page: number;
  size: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
};

export default function BoardPagination({
  page,
  size,
  totalPages,
  isFirst,
  isLast,
}: Props) {
  const displayTotalPages = Math.max(totalPages, 1);
  const prev = Math.max(page - 1, 0);
  const next = Math.min(page + 1, displayTotalPages - 1);
  const prevPageParam = prev + 1;
  const nextPageParam = next + 1;
  const pageParam = page + 1;

  return (
    <nav className={style.nav}>
      <div className={style.pagination}>
        <Link
          aria-disabled={isFirst}
          href={`/board?page=${prevPageParam}&size=${size}`}
          className={isFirst ? style.disabled : style.link}
        >
          이전
        </Link>

        <span className={style.pageInfo}>
          {pageParam} / {displayTotalPages}
        </span>

        <Link
          aria-disabled={isLast}
          href={`/board?page=${nextPageParam}&size=${size}`}
          className={isLast ? style.disabled : style.link}
        >
          다음
        </Link>
      </div>
    </nav>
  );
}
