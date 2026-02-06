import { apiClient, getApiBaseUrl } from "./client";
import type {
  BoardCategoryMap,
  BoardDetail,
  BoardListResponse,
  BoardRequest,
  GetBoardsParams,
  TokenParams,
} from "@/src/types/board";

/**
 * 글 목록 조회
 */
export const getBoards = async (
  params: GetBoardsParams = {},
  tokens?: TokenParams | string,
) => {
  const page = params.page ?? 0;
  const size = params.size ?? 10;

  // 하위 호환: string으로 전달되면 accessToken만 있는 것
  const tokenParams =
    typeof tokens === "string" ? { accessToken: tokens } : tokens;

  return apiClient<BoardListResponse>(
    `/boards?page=${page}&size=${size}&sort=createdAt,desc`,
    {
      auth: true,
      retryOnAuthError: true,
      accessToken: tokenParams?.accessToken ?? null,
      refreshToken: tokenParams?.refreshToken ?? null,
    },
  );
};

/**
 * 글 상세 조회
 */
export const getBoardById = async (id: number, tokens?: TokenParams) => {
  return apiClient<BoardDetail>(`/boards/${id}`, {
    auth: true,
    retryOnAuthError: true,
    accessToken: tokens?.accessToken ?? null,
    refreshToken: tokens?.refreshToken ?? null,
  });
};

/**
 * 게시판 카테고리 조회
 */
export const getBoardCategories = async (tokens?: TokenParams | string) => {
  const tokenParams =
    typeof tokens === "string" ? { accessToken: tokens } : tokens;

  return apiClient<BoardCategoryMap>(`/boards/categories`, {
    auth: true,
    retryOnAuthError: true,
    accessToken: tokenParams?.accessToken ?? null,
    refreshToken: tokenParams?.refreshToken ?? null,
  });
};

const BASE_URL = getApiBaseUrl();

/**
 * 글 등록 (multipart/form-data)
 */
export const createBoard = async (
  data: BoardRequest,
  image?: File | null,
  accessToken?: string,
): Promise<void> => {
  const formData = new FormData();

  const requestBlob = new Blob([JSON.stringify(data)], {
    type: "application/json",
  });
  formData.append("request", requestBlob);

  if (image) {
    formData.append("image", image);
  }

  const res = await fetch(`${BASE_URL}/boards`, {
    method: "POST",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }

  if (res.status === 204) return;
  await res.json();
};

/**
 * 글 수정 (multipart/form-data)
 */
export const updateBoard = async (
  id: number,
  data: BoardRequest,
  image?: File | null,
  accessToken?: string,
): Promise<void> => {
  const formData = new FormData();

  const requestBlob = new Blob([JSON.stringify(data)], {
    type: "application/json",
  });
  formData.append("request", requestBlob);

  if (image) {
    formData.append("image", image);
  }

  const res = await fetch(`${BASE_URL}/boards/${id}`, {
    method: "PATCH",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }

  if (res.status === 204) return;
  await res.json();
};

/**
 * 글 삭제
 */
export const deleteBoard = async (
  id: number,
  accessToken?: string,
): Promise<void> => {
  const res = await fetch(`${BASE_URL}/boards/${id}`, {
    method: "DELETE",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }
};
