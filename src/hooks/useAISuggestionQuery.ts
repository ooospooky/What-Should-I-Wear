import { useMutation } from "@tanstack/react-query";
import {
  fetchClothingSuggestion,
  AISuggestionError,
  type GeminiAIPayload,
} from "../services/aiService";
import type { AISuggestion } from "../types/ai-suggestion";

export const useAISuggestionMutation = () => {
  return useMutation<AISuggestion, AISuggestionError, GeminiAIPayload>({
    mutationFn: fetchClothingSuggestion,
    onError: (error) => {
      console.error(
        "AI suggestion error:",
        error.code,
        error.message,
        error.details
      );
    },
  });
};
