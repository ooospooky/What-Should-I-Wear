import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchWeatherData } from "../services/weatherService";
import { WeatherForecast } from "../types/weather";
import { WeatherURLParams, URLParamsUtils } from "../types/url";

type WeatherQueryParams = Pick<
  WeatherURLParams,
  "locationId" | "locationName"
> & {
  dateRange: string;
};

export const useWeatherSuspenseQuery = (urlParams: WeatherURLParams) => {
  const queryParams: WeatherQueryParams = {
    locationId: urlParams.locationId,
    locationName: urlParams.district, // 使用 district 作為 API 的 locationName
    dateRange: URLParamsUtils.buildDateRange(urlParams.date),
  };

  return useSuspenseQuery({
    queryKey: [
      "weather",
      queryParams.locationId,
      queryParams.locationName,
      queryParams.dateRange,
    ],

    queryFn: (): Promise<WeatherForecast> => {
      return fetchWeatherData(queryParams);
    },
  });
};

export const createUserScheduleFromURLSuspense = (
  urlParams: WeatherURLParams
) => {
  return {
    goOutTime: urlParams.goOutTime,
    goHomeTime: urlParams.goHomeTime,
    transportation: urlParams.transportation,
  };
};
