import type { ApiResponse } from "./common";

export interface QuizAnswer {
  questionId: number;
  userAnswer: string;
}

export interface QuizDetailedResult {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  detailedResults?: QuizDetailedResult[];
}

export type QuizSubmissionResponse = ApiResponse<QuizResult>;
