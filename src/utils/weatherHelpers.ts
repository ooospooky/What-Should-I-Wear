// 🛠️ 天氣資料處理工具函數

import { WeatherTimePoint, WeatherCalculation, UserSchedule } from '../types/weather';

// Constants - 避免 magic numbers
const WEATHER_INTERVALS = [0, 3, 6, 9, 12, 15, 18, 21] as const;
const RAIN_GEAR_THRESHOLD = 30; // 30% 以上建議攜帶雨具
const LAYERED_TEMP_DIFF = 8; // 溫差大於8度建議分層
const TEMP_THRESHOLDS = {
  LIGHT: 25,
  MEDIUM: 15
} as const;

/**
 * 將時間字串轉換為小時數
 * @example "18:30" -> 18, "09:00" -> 9
 */
export const parseTimeString = (timeString: string): number => {
  const hour = parseInt(timeString.split(':')[0], 10);
  if (isNaN(hour) || hour < 0 || hour > 23) {
    throw new Error(`Invalid time format: ${timeString}`);
  }
  return hour;
};

/**
 * 找到最接近的天氣資料點
 * @example targetHour: 10 -> 找到 hour: 9 的資料點 (最接近的3小時間隔)
 */
export const findClosestTimePoint = (
  timePoints: WeatherTimePoint[],
  targetHour: number
): WeatherTimePoint | null => {
  if (!timePoints.length) return null;
  
  // 找到最接近的3小時間隔點
  const closestHour = WEATHER_INTERVALS.reduce((prev, curr) => 
    Math.abs(curr - targetHour) < Math.abs(prev - targetHour) ? curr : prev
  );
  
  return timePoints.find(point => point.hour === closestHour) || null;
};

/**
 * 取得指定時間範圍內的天氣資料點
 * @example (9, 18) -> 取得 9:00-18:00 的所有資料點
 * @example (22, 2) -> 取得 22:00-隔日02:00 的跨日資料點
 */
export const getTimePointsInRange = (
  timePoints: WeatherTimePoint[],
  startHour: number,
  endHour: number
): WeatherTimePoint[] => {
  // Early return for invalid input
  if (!timePoints.length) return [];
  if (startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) {
    throw new Error('Invalid hour range');
  }
  
  // 處理跨日情況 (例如: 22:00 - 02:00)
  if (startHour > endHour) {
    const todayPoints = timePoints.filter(
      point => !point.isNextDay && point.hour >= startHour
    );
    const nextDayPoints = timePoints.filter(
      point => point.isNextDay && point.hour <= endHour
    );
    return [...todayPoints, ...nextDayPoints];
  }
  
  // 同日時間範圍
  return timePoints.filter(
    point => !point.isNextDay && point.hour >= startHour && point.hour <= endHour
  );
};

/**
 * 計算指定時間範圍的天氣統計
 * @example 輸入 9:00-18:00 行程 -> 輸出平均溫度、溫差、降雨機率等統計
 */
export const calculateWeatherStats = (
  timePoints: WeatherTimePoint[],
  schedule: UserSchedule
): WeatherCalculation => {
  // Early returns for validation
  if (!timePoints.length) {
    throw new Error('No weather data provided');
  }
  if (!schedule.goOutTime || !schedule.goHomeTime) {
    throw new Error('Invalid schedule data');
  }
  
  const startHour = parseTimeString(schedule.goOutTime);
  const endHour = parseTimeString(schedule.goHomeTime);
  
  const relevantPoints = getTimePointsInRange(timePoints, startHour, endHour);
  
  if (!relevantPoints.length) {
    throw new Error('No weather data available for the specified time range');
  }
  
  const temperatures = relevantPoints.map(point => point.temperature);
  const rainProbabilities = relevantPoints.map(point => point.rainProbability);
  
  const averageTemperature = Math.round(
    temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length
  );
  
  const maxTemperature = Math.max(...temperatures);
  const minTemperature = Math.min(...temperatures);
  const temperatureDifference = maxTemperature - minTemperature;
  
  const averageRainProbability = Math.round(
    rainProbabilities.reduce((sum, prob) => sum + prob, 0) / rainProbabilities.length
  );
  
  return {
    averageTemperature,
    maxTemperature,
    minTemperature,
    temperatureDifference,
    averageRainProbability,
    relevantTimePoints: relevantPoints
  };
};

/**
 * 內插計算精確時間的溫度
 * @example 10:30 介於 9:00(20°C) 和 12:00(26°C) 之間 -> 計算出約 23°C
 */
export const interpolateTemperature = (
  timePoints: WeatherTimePoint[],
  targetHour: number
): number => {
  // Early return for invalid input
  if (!timePoints.length) return 0;
  if (targetHour < 0 || targetHour > 23) {
    throw new Error('Invalid target hour');
  }
  
  const sortedPoints = [...timePoints].sort((a, b) => {
    const aTime = a.isNextDay ? a.hour + 24 : a.hour;
    const bTime = b.isNextDay ? b.hour + 24 : b.hour;
    return aTime - bTime;
  });
  
  for (let i = 0; i < sortedPoints.length - 1; i++) {
    const current = sortedPoints[i];
    const next = sortedPoints[i + 1];
    
    const currentTime = current.isNextDay ? current.hour + 24 : current.hour;
    const nextTime = next.isNextDay ? next.hour + 24 : next.hour;
    
    if (currentTime <= targetHour && targetHour <= nextTime) {
      // 線性內插
      const ratio = (targetHour - currentTime) / (nextTime - currentTime);
      return Math.round(
        current.temperature + (next.temperature - current.temperature) * ratio
      );
    }
  }
  
  // 如果找不到範圍，返回最接近的點
  const closest = findClosestTimePoint(timePoints, targetHour);
  return closest?.temperature || 0;
};

/**
 * 檢查是否需要雨具
 * @example 降雨機率 35% -> true (建議攜帶), 20% -> false
 */
export const needRainGear = (averageRainProbability: number): boolean => {
  return averageRainProbability >= RAIN_GEAR_THRESHOLD;
};

/**
 * 根據溫度範圍推薦衣物厚度等級
 * @example (28°C, 3°C溫差) -> { level: 'light', layered: false }
 * @example (20°C, 10°C溫差) -> { level: 'medium', layered: true }
 */
export const getClothingLevel = (averageTemp: number, tempDiff: number) => {
  const layered = tempDiff > LAYERED_TEMP_DIFF;
  
  if (averageTemp >= TEMP_THRESHOLDS.LIGHT) {
    return { level: 'light' as const, layered };
  }
  
  if (averageTemp >= TEMP_THRESHOLDS.MEDIUM) {
    return { level: 'medium' as const, layered };
  }
  
  return { level: 'heavy' as const, layered };
};