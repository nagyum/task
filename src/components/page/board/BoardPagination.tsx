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

const SIZE_OPTIONS = [5, 10, 30, 100];

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

  return (
    <nav className={style.nav}>
      <div className={style.pagination}>
        <Link
          aria-disabled={isFirst}
          href={`/board?page=${prev}&size=${size}`}
          className={isFirst ? style.disabled : style.link}
        >
          이전
        </Link>

        <span className={style.pageInfo}>
          {page + 1} / {displayTotalPages}
        </span>

        <Link
          aria-disabled={isLast}
          href={`/board?page=${next}&size=${size}`}
          className={isLast ? style.disabled : style.link}
        >
          다음
        </Link>
      </div>

      <div className={style.sizeSelector}>
        <span className={style.sizeLabel}>페이지당</span>
        {SIZE_OPTIONS.map((option) => (
          <Link
            key={option}
            href={`/board?page=0&size=${option}`}
            className={size === option ? style.sizeActive : style.sizeOption}
          >
            {option}
          </Link>
        ))}
      </div>
    </nav>
  );
}
