import { useMemo } from "react";
import {
  calculateWeatherStats,
  parseTimeString,
} from "../utils/weatherHelpers";
import {
  WeatherCalculation,
  WeatherForecast,
  UserSchedule,
} from "../types/weather";

/**
 * 計算天氣統計的 Hook
 * @param weatherData 天氣預報資料
 * @param schedule 使用者行程
 * @returns 天氣統計資料或 null
 */
export const useWeatherCalculation = (
  weatherData: WeatherForecast | null,
  schedule: UserSchedule | null
): WeatherCalculation | null => {
  return useMemo(() => {
    if (!weatherData || !schedule) return null;

    try {
      return calculateWeatherStats(weatherData.timePoints, schedule);
    } catch (error) {
      console.error("Weather calculation error:", error);
      return null;
    }
  }, [weatherData, schedule]);
};

/**
 * 計算特定時間的溫度
 * @param weatherData 天氣預報資料
 * @param timeString 時間字串 (如 "14:30")
 * @returns 溫度值或 null
 */
export const useTemperatureAtTime = (
  weatherData: WeatherForecast | null,
  timeString: string | null
): number | null => {
  return useMemo(() => {
    if (!weatherData || !timeString) return null;

    try {
      const targetHour = parseTimeString(timeString);
      const timePoints = weatherData.timePoints;

      // 找最接近的時間點
      const closestPoint = timePoints.reduce((closest, current) => {
        const closestDiff = Math.abs(closest.hour - targetHour);
        const currentDiff = Math.abs(current.hour - targetHour);
        return currentDiff < closestDiff ? current : closest;
      });

      return closestPoint.temperature;
    } catch (error) {
      console.error("Temperature calculation error:", error);
      return null;
    }
  }, [weatherData, timeString]);
};
