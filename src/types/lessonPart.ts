import type { ApiResponse } from "./common";

export const LessonPartType = {
  VOCABULARY: "VOCABULARY",
  GRAMMAR: "GRAMMAR",
  SPEAKING: "SPEAKING",
  TEST: "TEST",
} as const;

export type LessonPartType = typeof LessonPartType[keyof typeof LessonPartType];

export interface LessonPart {
  id: number;
  type: LessonPartType;
  title?: string;
  lessonId: number;
}

export type LessonPartListResponse = ApiResponse<LessonPart[]>;
