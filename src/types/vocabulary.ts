import type { ApiResponse } from "./common";

export interface Vocabulary {
  id: number;
  wordKana: string;
  wordKanji?: string | null;
  meaning: string;
  romaji?: string | null;
  lessonPartId: number;
}

export type VocabularyListResponse = ApiResponse<Vocabulary[]>;
