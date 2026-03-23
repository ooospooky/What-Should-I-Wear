import { type } from "arktype";

// === ArkType Schema ===

/**
 * 衣物項目 Schema
 * type: 衣物類型（上衣、下身、外套）
 * item: 衣物名稱
 * reason: 推薦原因
 */
export const OutfitItemSchema = type({
  type: "'top' | 'bottom' | 'outerwear'",
  item: "string",
  reason: "string",
});

/**
 * 配件項目 Schema
 * item: 配件名稱
 * reason: 推薦原因
 */
export const AccessorySchema = type({
  item: "string",
  reason: "string",
});

/**
 * AI 穿搭建議完整 Schema
 * outfit: 衣物搭配陣列
 * accessories: 配件建議陣列
 * transportTips: 交通方式相關提醒
 * warnings: 天氣注意事項
 */
export const AISuggestionSchema = type({
  outfit: OutfitItemSchema.array(),
  accessories: AccessorySchema.array(),
  transportTips: "string[]",
  warnings: "string[]",
});

// === 型別推斷 ===
export type OutfitItem = typeof OutfitItemSchema.infer;
export type Accessory = typeof AccessorySchema.infer;
export type AISuggestion = typeof AISuggestionSchema.infer;

// === Gemini JSON Schema（必須與 ArkType Schema 同步）===
export const AI_SUGGESTION_JSON_SCHEMA = {
  type: "object",
  properties: {
    outfit: {
      type: "array",
      description: "衣物搭配建議，包含上衣、下身、外套等",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: ["top", "bottom", "outerwear"],
            description: "衣物類型：top=上衣, bottom=下身, outerwear=外套",
          },
          item: {
            type: "string",
            description: "衣物名稱，例如「短袖上衣」、「牛仔褲」",
          },
          reason: {
            type: "string",
            description: "推薦這件衣物的原因",
          },
        },
        required: ["type", "item", "reason"],
      },
    },
    accessories: {
      type: "array",
      description: "配件建議，如雨傘、帽子、手套等",
      items: {
        type: "object",
        properties: {
          item: {
            type: "string",
            description: "配件名稱",
          },
          reason: {
            type: "string",
            description: "推薦原因",
          },
        },
        required: ["item", "reason"],
      },
    },
    transportTips: {
      type: "array",
      description: "交通方式相關提醒，最多 2 項",
      items: {
        type: "string",
      },
    },
    warnings: {
      type: "array",
      description: "天氣注意事項，最多 2 項",
      items: {
        type: "string",
      },
    },
  },
  required: ["outfit", "accessories", "transportTips", "warnings"],
} as const;

// === API Response 型別 ===
export interface AISuggestionSuccessResponse {
  success: true;
  data: AISuggestion;
}

export interface AISuggestionErrorResponse {
  success: false;
  error: {
    code: "VALIDATION_ERROR" | "GEMINI_API_ERROR" | "UNKNOWN_ERROR";
    message: string;
    details?: string;
  };
}

export type AISuggestionResponse =
  | AISuggestionSuccessResponse
  | AISuggestionErrorResponse;
