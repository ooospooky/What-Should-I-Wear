import axios from "axios";
import { WeatherForecast, WeatherTimePoint } from "../types/weather";

/**
 * 從 API 獲取天氣資料並轉換為乾淨的格式
 * @param params API 參數
 * @returns 乾淨的天氣預報資料
 */
//TODO: React Query and api key
export const fetchWeatherData = async ({
  dateRange,
  locationId,
  locationName,
}: {
  dateRange: string;
  locationId: string;
  locationName: string;
}): Promise<WeatherForecast> => {
  // Cloudflare Worker API
  const response = await axios.get(
    "https://johnny-weather-api.bm414148.workers.dev",
    {
      params: {
        locationId,
        locationName,
        dateRange,
      },
    }
  );

  const locationData = response.data.records.Locations[0].Location[0];
  const weatherElement = locationData.WeatherElement;

  const weatherDescriptionData = weatherElement.find(
    ({ ElementName }: any) => ElementName === "天氣預報綜合描述"
  ).Time;

  const timePoints: WeatherTimePoint[] = [];

  weatherDescriptionData.forEach((timeData: any, index: number) => {
    const { StartTime } = timeData;
    const weatherDescription = timeData.ElementValue[0].WeatherDescription;

    // 解析溫度和降雨機率
    const rainMatch = weatherDescription.match(/降雨機率(\d+)%/);
    const rainProbability = rainMatch ? parseInt(rainMatch[1], 10) : 0;

    const tempMatch = weatherDescription.match(/溫度攝氏(\d+)/);
    const temperature = tempMatch ? parseInt(tempMatch[1], 10) : 0;

    // 解析小時
    const hour = parseInt(StartTime.slice(11, 13), 10);
    const isNextDay = index === weatherDescriptionData.length - 1;

    timePoints.push({
      hour,
      temperature,
      rainProbability,
      timeString: StartTime,
      isNextDay,
    });
  });

  return {
    locationName,
    locationId,
    timePoints,
    updatedAt: new Date(),
    dateRange: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 明天
    },
  };
};
