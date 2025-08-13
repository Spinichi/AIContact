export type LettersResponse = BabyLetterResponse[];

type BabyLetterResponse = {
  id: number;
  content: string;
  isRead: boolean;
  createdAt: string;
};
