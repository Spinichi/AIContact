import { apiFetch } from "../fetchClient";
import type { ApiResponse } from "../types/common";
import { UsersApi } from "../user";
import type { DailyScheduleRequest, DailyScheduleUpdate } from "./request";
import type { DailyScheduleResponse } from "./response";

const res = await UsersApi.getMe();
const coupleId = res.data.coupleId as number;

export const dailySchedulesApi = {

    /* 일정 등록 */
    createSchedule: (payload: DailyScheduleRequest) =>
        apiFetch<ApiResponse<DailyScheduleResponse>>("/schedules", {
            method: "POST",
            body: JSON.stringify(payload),
    }),

    updateSchedule: (scheduleId : number, payload: DailyScheduleUpdate) =>
        apiFetch<ApiResponse<DailyScheduleResponse>>(`/schedules/${scheduleId}`, {
            method: "PUT",
            body: JSON.stringify(payload),
    }),

    deleteSchedule: (scheduleId : number) => 
        apiFetch<ApiResponse<string>>(`/schedules/${scheduleId}`, {
            method: "DELETE",
    }),

    getSchedulesByDate: (date : string) => {
        const queryParams = new URLSearchParams({
            date : date,
            coupleId : coupleId.toString(),
        });
        return apiFetch<ApiResponse<DailyScheduleResponse[]>>(`/schedules/day?${queryParams.toString()}`, {
            method: "GET",
        });
    },

    getSchedulesByMonth: (year: number, month: number) => {
        const queryParams = new URLSearchParams({
            coupleId: coupleId.toString(),
            year: year.toString(),
            month: month.toString(),
        });
        return apiFetch<ApiResponse<DailyScheduleResponse[]>>(`/schedules/month?${queryParams.toString()}`, {
            method: "GET",
        });
    }
}