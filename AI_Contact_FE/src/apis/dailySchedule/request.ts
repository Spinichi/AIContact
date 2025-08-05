export type DailyScheduleRequest = {
  coupleId: number;
  creatorId: number;
  scheduleDate: string;
  title: string;
  memo: string;
};

export type DailyScheduleUpdate = {
  title: string;
  memo: string;
  scheduleDate: string;
}