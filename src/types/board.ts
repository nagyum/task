export type BoardCategory = "NOTICE" | "FREE" | "QNA" | "ETC";

/**
 * GET /boards/categories 응답
 * { "NOTICE": "공지", "FREE": "자유", ... }
 */
export type BoardCategoryMap = Record<BoardCategory, string>;

export type Board = {
  id: number;
  title: string;
  category: BoardCategory;
  createdAt: string;
};

export type Sort = {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
};

export type Pageable = {
  pageNumber: number;
  pageSize: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
  sort: Sort;
};

/**
 * GET /boards?page=0&size=10 응답
 */
export type BoardListResponse = {
  content: Board[];

  pageable: Pageable;
  totalPages: number;
  totalElements: number;

  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  empty: boolean;
};
