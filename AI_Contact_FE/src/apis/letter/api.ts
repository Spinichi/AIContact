import { apiFetch } from "../fetchClient";
import type { ApiResponse } from "../types/common";
import type { GetLettersRequest } from "./request";
import type { LettersResponse } from "./response";

export const LetterApi = {
  /* 아이 편지 목록 조회 */
  getAll: (params: GetLettersRequest) =>
    apiFetch<ApiResponse<LettersResponse>>(
      `/summary/letters?userId=${params.userId}`
    ),
};
