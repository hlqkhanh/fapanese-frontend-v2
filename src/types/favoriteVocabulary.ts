export interface FavoriteVocabulary {
  id: number;
  userId: number;
  vocabularyId: number;
  createdAt: string;
}

export interface FavoriteVocabularyWithDetails extends FavoriteVocabulary {
  vocabulary: {
    id: number;
    wordKana: string;
    meaning: string;
    romaji: string;
  };
}

export interface FavoriteVocabularyRequest {
  vocabularyId: number;
}
