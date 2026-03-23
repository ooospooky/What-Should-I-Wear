import axios from "axios";
import type {
  WeatherForecast,
  UserSchedule,
  WeatherCalculation,
} from "../types/weather";
import type {
  AISuggestionResponse,
  AISuggestion,
} from "../types/ai-suggestion";

export interface GeminiAIPayload {
  weatherData: WeatherForecast;
  userSchedule: UserSchedule;
  calculation: WeatherCalculation;
}

const AI_SUGGESTION_API_URL =
  "https://johnny-weather-api.bm414148.workers.dev/ai-suggestion";

/**
 * AI 建議錯誤類別
 * 包含結構化的錯誤碼和詳細資訊
 */
export class AISuggestionError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: string
  ) {
    super(message);
    this.name = "AISuggestionError";
  }
}

/**
 * 從 Gemini API 獲取結構化穿搭建議
 * @param data 包含天氣資料、用戶行程和計算結果的完整資料
 * @returns 結構化的 AI 穿搭建議
 * @throws {AISuggestionError} 當 API 回傳錯誤或驗證失敗時
 */
export const fetchClothingSuggestion = async (
  data: GeminiAIPayload
): Promise<AISuggestion> => {
  const response = await axios.post<AISuggestionResponse>(
    AI_SUGGESTION_API_URL,
    data
  );

  // 檢查新格式的成功回應
  if (response.data.success === true) {
    return response.data.data;
  }

  // 檢查新格式的錯誤回應
  if (response.data.success === false && response.data.error) {
    throw new AISuggestionError(
      response.data.error.code,
      response.data.error.message,
      response.data.error.details
    );
  }

  // 未知的回應格式
  throw new AISuggestionError(
    "UNKNOWN_RESPONSE_FORMAT",
    "後端 API 回傳格式不符預期，請確認後端已部署最新版本"
  );
};
