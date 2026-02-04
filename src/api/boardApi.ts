import { apiClient } from "./client";
import type {
  Board,
  BoardCategoryMap,
  BoardListResponse,
} from "@/src/types/board";

export type GetBoardsParams = {
  page?: number;
  size?: number;
};

/**
 * 글 목록 조회
 */
export const getBoards = async (
  params: GetBoardsParams = {},
  accessToken?: string,
) => {
  const page = params.page ?? 0;
  const size = params.size ?? 10;

  return apiClient<BoardListResponse>(`/boards?page=${page}&size=${size}`, {
    auth: true,
    retryOnAuthError: true,
    accessToken: accessToken ?? null,
  });
};

/**
 * 글 조뢰
 */
export const getBoardById = async (id: number) => {
  return apiClient<Board>(`/boards/${id}`, {
    auth: true,
    retryOnAuthError: true,
  });
};

/**
 * 게시판 카테고리 조회
 */
export const getBoardCategories = async (accessToken?: string) => {
  return apiClient<BoardCategoryMap>(`/boards/categories`, {
    auth: true,
    retryOnAuthError: true,
    accessToken: accessToken ?? null,
  });
};
