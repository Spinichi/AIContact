import { apiFetch } from "../fetchClient";
import type { ApiResponse } from "../types/common";
import type { MeUserResponse } from "./response";
import type { SignUpRequest } from "./request";

export const UsersApi = {
  /** 현재 로그인한 사용자 정보 조회 */
  getMe: (options?: RequestInit) =>
    apiFetch<ApiResponse<MeUserResponse>>("/users/me", options),

  /** 회원가입 */
  signUp: (payload: SignUpRequest) => {
    const formData = new FormData();
    formData.append("email", payload.email);
    formData.append("password", payload.password);
    formData.append("name", payload.name);
    formData.append("birthDate", payload.birthDate);
    formData.append("file", payload.file);

    return apiFetch<ApiResponse<void>>("/users/sign-up", {
      method: "POST",
      body: formData,
    });
  },
};
