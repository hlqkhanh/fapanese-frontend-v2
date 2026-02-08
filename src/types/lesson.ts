import type { ApiResponse } from "./common";

export interface Lesson {
  id: number;
  lessonTitle: string;
  description?: string;
  courseId: number;
  orderIndex?: number;
}

export type LessonResponse = ApiResponse<Lesson>;
export type LessonListResponse = ApiResponse<Lesson[]>;
