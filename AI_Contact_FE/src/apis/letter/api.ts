import { apiFetch } from "../fetchClient";
import type { ApiResponse } from "../types/common";
import type { LettersResponse } from "./response";

export const LetterApi = {
  getAll: () =>
    apiFetch<ApiResponse<LettersResponse>>(`/summary/letters`),



  create: () => apiFetch<ApiResponse<string>>("/summary/letter", { method: "GET" }),

  unreadCount: () =>
    apiFetch<ApiResponse<number>>(`/summary/letters/unread-count`),

  markAsRead: async (letterId: number) => {
    return await apiFetch(`/summary/letters/${letterId}/read`, {
      method: 'PATCH'
    });
  }
};