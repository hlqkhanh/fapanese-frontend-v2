import api from "@/lib/axios";
import type { QuizAnswer, QuizSubmissionResponse } from "@/types/quiz";

const BASE_URL = "/questions";

export const quizService = {
  async submitAnswers(answers: QuizAnswer[]): Promise<QuizSubmissionResponse> {
    const res = await api.post(`${BASE_URL}/submit`, answers);
    return res.data;
  },
};
