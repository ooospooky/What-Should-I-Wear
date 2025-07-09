import { useMutation } from "@tanstack/react-query";
import {
  fetchClothingSuggestion,
  type GeminiAIPayload,
} from "../services/aiService";

export const useAISuggestionMutation = () => {
  return useMutation({
    mutationFn: (data: GeminiAIPayload) => fetchClothingSuggestion(data),
    onError: (error) => {
      console.error("AI suggestion error:", error);
    },
  });
};
