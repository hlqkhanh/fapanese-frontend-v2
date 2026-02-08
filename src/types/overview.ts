import type { ApiResponse } from "./common";

// ==================== Overview Part Types ====================

export type OverviewPartType = "SPEAKING" | "MIDDLE_EXAM" | "FINAL_EXAM";

export interface OverviewPart {
  id: number;
  overviewId: number;
  title: string;
  type: OverviewPartType;
}

// ==================== Speaking Types ====================

export interface SpeakingQuestion {
  id: number;
  question: string;
  questionRomaji?: string;
  questionMeaning?: string;
  answer?: string;
  answerRomaji?: string;
  answerMeaning?: string;
}

export type SpeakingType = "PASSAGE" | "PICTURE" | "QUESTION";

export interface SpeakingItem {
  id: number;
  topic: string;
  speakingType: SpeakingType;
  passage?: string;
  passageRomaji?: string;
  passageMeaning?: string;
  description?: string;
  imgUrl?: string;
  speakingQuestions: SpeakingQuestion[];
}

export interface SpeakingGroup {
  id: number;
  overviewPartId: number;
  title: string;
  type: string;
  description?: string;
  speakings: SpeakingItem[];
}

// ==================== Exam Types ====================

export type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK";

export interface ExamQuestion {
  id: number;
  content: string;
  category: string;
  questionType: QuestionType;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer: string;
}

export interface Exam {
  id: number;
  overviewPartId: number;
  examTitle: string;
  semester: string;
  type: string;
  year: number;
  questions: ExamQuestion[];
}

// ==================== Submission Types ====================

export interface UserAnswer {
  questionId: number;
  userAnswer: string;
}

export interface DetailedResult {
  questionId: number;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface ExamSubmitResult {
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  detailedResults: DetailedResult[];
}

// ==================== Overview Main Type ====================

export interface Overview {
  id: number;
  courseCode: string;
  title: string;
  description?: string;
}

// ==================== API Response Types ====================

export type OverviewResponse = ApiResponse<Overview>;
export type OverviewPartsResponse = ApiResponse<OverviewPart[]>;
export type SpeakingGroupsResponse = ApiResponse<SpeakingGroup[]>;
export type ExamsResponse = ApiResponse<Exam[]>;
export type ExamSubmitResponse = ApiResponse<ExamSubmitResult>;
export type AIExplanationResponse = ApiResponse<string>;
