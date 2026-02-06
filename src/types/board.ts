export type BoardCategory = "NOTICE" | "FREE" | "QNA" | "ETC";

/**
 * GET /boards/categories 응답
 * { "NOTICE": "공지", "FREE": "자유", ... }
 */
export type BoardCategoryMap = Record<BoardCategory, string>;

/** 목록 조회용 */
export type Board = {
  id: number;
  title: string;
  category: BoardCategory;
  createdAt: string;
};

/** 상세 조회용 (GET /boards/{id}) */
export type BoardDetail = {
  id: number;
  title: string;
  content: string;
  boardCategory: BoardCategory;
  imageUrl?: string | null;
  createdAt: string;
};

/** 글 등록/수정 요청 */
export type BoardRequest = {
  title: string;
  content: string;
  category: BoardCategory;
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

export type GetBoardsParams = {
  page?: number;
  size?: number;
};

export type TokenParams = {
  accessToken?: string;
  refreshToken?: string;
};
