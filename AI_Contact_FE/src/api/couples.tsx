import { apiFetch } from "./fetchClient";

export type VerificationCodeRequest = {
  verificationCode: string;
};

export type CoupleJoinResponse = {
  matched: boolean;
  partnerId: number | null;
};

export type CoupleMatchingRequest = {
  partnerId: number;
  startDate?: string | null; // ISO(YYYY-MM-DD)
  coupleName?: string | null;
};

export type CoupleInfoResponse = {
  coupleId: number;
  user1Id: number;
  user2Id: number;
  matchedAt: string; // ISO date-time
  startDate: string | null;
  coupleName: string | null;
};

export type MyCodeResponse = {
  verificationCode: string;
};

export const CouplesApi = {
  joinByCode: (code: string) =>
    apiFetch<CoupleJoinResponse>("/api/v1/couples/join", {
      method: "POST",
      body: JSON.stringify({ verificationCode: code }),
    }),

  matching: (payload: CoupleMatchingRequest) =>
    apiFetch<CoupleInfoResponse>("/api/v1/couples/matching", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMyCode: () => apiFetch<MyCodeResponse>("/api/v1/couples/myCode"),

  getCoupleInfo: () => apiFetch<CoupleInfoResponse>("/api/v1/couples"),
};
