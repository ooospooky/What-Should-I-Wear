// 🌤️ 理想的天氣資料型別設計

/**
 * 天氣時間點資料
 */
export interface WeatherTimePoint {
  /** 時間 (24小時制，0-23) */
  hour: number;
  /** 溫度 (攝氏) */
  temperature: number;
  /** 降雨機率 (0-100%) */
  rainProbability: number;
  /** 原始時間字串 (用於 debug) */
  timeString: string;
  /** 是否為隔日 */
  isNextDay: boolean;
}

/**
 * 天氣預報資料
 */
export interface WeatherForecast {
  /** 地點名稱 */
  locationName: string;
  /** 地點ID */
  locationId: string;
  /** 預報時間點陣列 (按時間排序) */
  timePoints: WeatherTimePoint[];
  /** 資料更新時間 */
  updatedAt: Date;
  /** 預報日期範圍 */
  dateRange: {
    startDate: Date;
    endDate: Date;
  };
}

/**
 * 使用者行程資料
 */
export interface UserSchedule {
  /** 出門時間 (24小時制，如: "09:30") */
  goOutTime: string;
  /** 回家時間 (24小時制，如: "18:00") */
  goHomeTime: string;
  /** 交通方式 */
  transportation?: 'walking' | 'cycling' | 'driving' | 'public';
}

/**
 * 穿著建議資料
 */
export interface ClothingRecommendation {
  /** 平均溫度 */
  averageTemperature: number;
  /** 溫差 */
  temperatureDifference: number;
  /** 平均降雨機率 */
  averageRainProbability: number;
  /** 建議的衣物類型 */
  recommendedClothing: ClothingItem[];
  /** 是否需要雨具 */
  needRainGear: boolean;
}

/**
 * 衣物項目
 */
export interface ClothingItem {
  /** 衣物ID */
  id: string;
  /** 衣物名稱 */
  name: string;
  /** 衣物類型 */
  type: 'top' | 'bottom' | 'outerwear' | 'accessories' | 'footwear';
  /** 適用溫度範圍 */
  temperatureRange: {
    min: number;
    max: number;
  };
  /** 圖片路徑 */
  imagePath: string;
}

/**
 * API 回應格式
 */
export interface WeatherApiResponse {
  success: boolean;
  data?: WeatherForecast;
  error?: {
    code: string;
    message: string;
  };
}

/**
 * 天氣計算工具函數的回傳型別
 */
export interface WeatherCalculation {
  /** 平均溫度 */
  averageTemperature: number;
  /** 最高溫度 */
  maxTemperature: number;
  /** 最低溫度 */
  minTemperature: number;
  /** 溫差 */
  temperatureDifference: number;
  /** 平均降雨機率 */
  averageRainProbability: number;
  /** 相關的時間點 */
  relevantTimePoints: WeatherTimePoint[];
}