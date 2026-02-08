import type { ApiResponse } from "./common";

export interface GrammarDetail {
  structure: string;
  meaning: string;
  exampleSentence: string;
  exampleMeaning: string;
}

export interface Grammar {
  id: number;
  title: string;
  explanation: string;
  details: GrammarDetail[];
  lessonPartId: number;
}

export type GrammarListResponse = ApiResponse<Grammar[]>;
