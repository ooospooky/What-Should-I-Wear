import { createContext, useContext } from "react";
import { WeatherForecast, UserSchedule } from "../types/weather";

/**
 * 天氣 Context 的值型別
 * TODO: Maybe use zustand is better
 */
export interface WeatherContextValue {
  weatherData: WeatherForecast | null;
  setWeatherData: (data: WeatherForecast | null) => void;

  userSchedule: UserSchedule | null;
  setUserSchedule: (schedule: UserSchedule | null) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  error: string | null;
  setError: (error: string | null) => void;
}

/**
 * 天氣 Context
 */
export const WeatherContext = createContext<WeatherContextValue | null>(null);

/**
 * 天氣 Context Hook
 * @returns WeatherContextValue
 * @throws Error 如果在 Provider 外使用
 */
export const useWeatherContext = (): WeatherContextValue => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeatherContext must be used within a WeatherProvider");
  }
  return context;
};
