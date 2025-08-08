import { apiFetch } from "../fetchClient";
import type { ApiResponse } from "../types/common";
import type { GetLettersRequest } from "./request";
import type { LettersResponse } from "./response";

export const LetterApi = {
  getAll: () =>
    apiFetch<ApiResponse<LettersResponse>>(`/summary/letters`),
};