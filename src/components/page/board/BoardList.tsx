// src/components/board/BoardList.tsx
import type { BoardCategoryMap, BoardListResponse } from "@/src/types/board";
import BoardListItem from "./BoardListItem";
import BoardPagination from "./BoardPagination";

type Props = {
  data: BoardListResponse;
  categories: BoardCategoryMap;
  page: number;
  size: number;
};

export default function BoardList({ data, categories, page, size }: Props) {
  return (
    <section>
      <h1>커뮤니티</h1>

      <ul>
        {data.content.map((b) => (
          <BoardListItem key={b.id} board={b} label={categories[b.category]} />
        ))}
      </ul>

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
