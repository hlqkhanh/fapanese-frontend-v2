import api from "@/lib/axios";
import type { Vocabulary } from "@/types/vocabulary";

const BASE_URL = "/favorite-vocabularies";

export const favoriteVocabularyService = {
  /**
   * Add a vocabulary to favorites
   */
  async add(vocabularyId: number): Promise<void> {
    await api.post(BASE_URL, { vocabularyId });
  },

  /**
   * Remove a vocabulary from favorites
   */
  async remove(vocabularyId: number): Promise<void> {
    await api.delete(`${BASE_URL}/${vocabularyId}`);
  },

  /**
   * Get list of favorite vocabulary IDs (lightweight for checking favorite status)
   */
  async getFavoriteIds(): Promise<number[]> {
    const res = await api.get(`${BASE_URL}/ids`);
    return res.data.result || [];
  },

  /**
   * Get all favorite vocabularies with full details
   */
  async getAll(): Promise<Vocabulary[]> {
    const res = await api.get(BASE_URL);
    const favorites = res.data.result || [];
    return favorites.map((item: any) => item.vocabulary);
  },

  /**
   * Check if a vocabulary is favorited
   */
  async isFavorite(vocabularyId: number): Promise<boolean> {
    const favoriteIds = await this.getFavoriteIds();
    return favoriteIds.includes(vocabularyId);
  },

  /**
   * Get all favorite vocabularies with detailed response (for FavoritesPage)
   */
  async getAllDetailed(): Promise<any[]> {
    const res = await api.get(BASE_URL);
    return res.data.result || [];
  },
};
