import moment from "moment";
import { UserSchedule, TransportationType } from "./weather";

/**
 *  Home 和 Result 頁面間傳遞天氣查詢參數
 */
export interface WeatherURLParams extends UserSchedule {
  /** 地區 ID (API 參數) */
  locationId: string;
  /** 地區名稱 */
  locationName: string;
  /** 區域名稱 */
  district: string;
  /** 日期選擇 */
  date: "today" | "tomorrow" | "afterTomorrow";
}

/**
 * URL 參數工具函數
 */
export const URLParamsUtils = {
  /**
   * 將物件轉換為 URL 查詢參數字串
   */
  toURLSearchParams: (params: WeatherURLParams): URLSearchParams => {
    return new URLSearchParams(params as Record<string, string>);
  },

  /**
   * 從 URLSearchParams 解析天氣查詢參數
   */
  fromURLSearchParams: (
    searchParams: URLSearchParams
  ): Partial<WeatherURLParams> => {
    const params: Partial<WeatherURLParams> = {};

    const locationId = searchParams.get("locationId");
    if (locationId) params.locationId = locationId;

    const locationName = searchParams.get("locationName");
    if (locationName) params.locationName = locationName;

    const district = searchParams.get("district");
    if (district) params.district = district;

    const date = searchParams.get("date");
    if (date && ["today", "tomorrow", "afterTomorrow"].includes(date)) {
      params.date = date as WeatherURLParams["date"];
    }

    const goOutTime = searchParams.get("goOutTime");
    if (goOutTime) params.goOutTime = goOutTime;

    const goHomeTime = searchParams.get("goHomeTime");
    if (goHomeTime) params.goHomeTime = goHomeTime;

    const transportation = searchParams.get("transportation");
    if (
      transportation &&
      ["walking", "cycling", "driving", "public"].includes(transportation)
    ) {
      params.transportation = transportation as TransportationType;
    }

    return params;
  },

  /**
   * 驗證 URL 參數是否完整
   */
  isComplete: (
    params: Partial<WeatherURLParams>
  ): params is WeatherURLParams => {
    return !!(
      params.locationId &&
      params.locationName &&
      params.district &&
      params.date &&
      params.goOutTime &&
      params.goHomeTime &&
      params.transportation
    );
  },

  /**
   * 根據日期選擇構建 dateRange API 參數
   */
  buildDateRange: (date: WeatherURLParams["date"]): string => {
    switch (date) {
      case "today":
        return `&timeFrom=${moment()
          .format()
          .slice(0, 11)}00:00:00&timeTo=${moment()
          .add(1, "days")
          .format()
          .slice(0, 11)}00:00:01`;

      case "tomorrow":
        return `&timeFrom=${moment()
          .add(1, "days")
          .format()
          .slice(0, 11)}00:00:00&timeTo=${moment()
          .add(2, "days")
          .format()
          .slice(0, 11)}00:00:01`;

      case "afterTomorrow":
        return `&timeFrom=${moment()
          .add(2, "days")
          .format()
          .slice(0, 11)}00:00:00&timeTo=${moment()
          .add(3, "days")
          .format()
          .slice(0, 11)}00:00:01`;

      default:
        throw new Error(`Invalid date: ${date}`);
    }
  },
};
