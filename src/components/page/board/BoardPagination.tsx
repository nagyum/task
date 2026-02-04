// src/components/board/BoardPagination.tsx
import Link from "next/link";

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
  const prev = Math.max(page - 1, 0);
  const next = Math.min(page + 1, totalPages - 1);

  return (
    <nav style={{ display: "flex", gap: 8, marginTop: 16 }}>
      <Link
        aria-disabled={isFirst}
        href={`/board?page=${prev}&size=${size}`}
        style={{
          pointerEvents: isFirst ? "none" : "auto",
          opacity: isFirst ? 0.4 : 1,
        }}
      >
        이전
      </Link>

      <span>
        {page + 1} / {totalPages}
      </span>

      <Link
        aria-disabled={isLast}
        href={`/board?page=${next}&size=${size}`}
        style={{
          pointerEvents: isLast ? "none" : "auto",
          opacity: isLast ? 0.4 : 1,
        }}
      >
        다음
      </Link>
    </nav>
  );
}
