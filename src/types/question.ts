import type { ApiResponse } from "./common";

export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL";

export const QuestionType = {
  MULTIPLE_CHOICE: "MULTIPLE_CHOICE",
  TRUE_FALSE: "TRUE_FALSE",
  FILL: "FILL",
} as const;

export interface Question {
  id: number;
  content: string;
  questionType: QuestionType;
  category: string;
  
  // Multiple choice options
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  
  // Answers
  correctAnswer?: string;
  fillAnswer?: string;
  
  lessonPartId: number;
}

export type QuestionListResponse = ApiResponse<Question[]>;
