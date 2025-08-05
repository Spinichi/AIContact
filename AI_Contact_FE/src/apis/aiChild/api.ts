import { apiFetch } from "../fetchClient";
import type { ApiResponse } from "../types/common";
import type { CreateAiChildRequest, UpdateAiChildRequest } from "./request";
import type { AiChildResponse } from "./response";

const BASE_PATH = "/children";

export const aiChildApi = {

  createChild: (payload: CreateAiChildRequest) =>
    apiFetch<ApiResponse<AiChildResponse>>(BASE_PATH, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMyChildren: () =>
    apiFetch<ApiResponse<AiChildResponse>>(BASE_PATH),

  updateChild: (id: number, payload: UpdateAiChildRequest) =>
    apiFetch<ApiResponse<AiChildResponse>>(`${BASE_PATH}/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteChild: (id: number) =>
    apiFetch<ApiResponse<string>>(`${BASE_PATH}/${id}`, {
      method: "DELETE",
    }),
};
