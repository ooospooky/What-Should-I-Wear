import axios from "axios";
import {
  WeatherForecast,
  UserSchedule,
  WeatherCalculation,
} from "../types/weather";

export interface GeminiAIPayload {
  weatherData: WeatherForecast;
  userSchedule: UserSchedule;
  calculation: WeatherCalculation;
}

interface AIResponse {
  suggestion: string;
}

/**
 * 從 gemini API 獲取衣物建議
 * @param data 包含天氣資料、用戶行程和計算結果的完整資料
 * @returns AI suggestion
 */
export const fetchClothingSuggestion = async (
  data: GeminiAIPayload
): Promise<string> => {
  const response = await axios.post<AIResponse>(
    "https://johnny-weather-api.bm414148.workers.dev/ai-suggestion",
    data,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.suggestion;
};
