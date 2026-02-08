// ==================== Exam Structure Types ====================

export interface SpeakingQuestion {
  id: number;
  question: string;
  questionRomaji: string;
  questionMeaning: string;
  answer: string;
  answerRomaji: string;
  answerMeaning: string;
}

export interface PassagePart {
  id: number;
  topic: string;
  passage: string;
}

export interface PicturePart {
  id: number;
  topic: string;
  imgUrl: string;
  questions: SpeakingQuestion[];
}

export interface QuestionPart {
  id: number;
  topic: string;
  questions: SpeakingQuestion[];
}

export interface GeneratedTestResponse {
  passagePart: PassagePart;
  picturePart: PicturePart;
  questionPart: QuestionPart;
}

// ==================== Grading Types ====================

export interface GradingPayload {
  passageTranscript: string;
  passageOriginal: string;
  pictureQuestion: string;
  pictureAnswerTranscript: string;
  pictureAnswerSample: string;
  q1Question: string;
  q1AnswerTranscript: string;
  q1AnswerSample: string;
  q2Question: string;
  q2AnswerTranscript: string;
  q2AnswerSample: string;
}

export interface GradingFeedback {
  passage: string;
  picture: string;
  question1: string;
  question2: string;
  overall: string;
}

// ==================== State Types ====================

export type ExamPart =
  | "idle"
  | "loadingTest"
  | "passage"
  | "picture"
  | "question1"
  | "question2"
  | "grading"
  | "REVIEW_ALL";

export type RecordingStatus = 
  | "idle" 
  | "recording" 
  | "transcribing" 
  | "speaking" 
  | "error";

export interface Transcripts {
  passage: string;
  picture: string;
  q1: string;
  q2: string;
}

export interface Recordings {
  passage: string;
  picture: string;
  q1: string;
  q2: string;
}

// ==================== API Response Types ====================

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface STTResponse {
  text: string;
}
