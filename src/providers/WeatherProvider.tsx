// 🌤️ 天氣資料 Provider - 管理全局天氣狀態

import { useState, ReactNode } from 'react';
import { WeatherContext, WeatherContextValue } from '../Contexts/WeatherContext';
import { WeatherForecast, UserSchedule } from '../types/weather';

interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider = ({ children }: WeatherProviderProps) => {
  const [weatherData, setWeatherData] = useState<WeatherForecast | null>(null);
  const [userSchedule, setUserSchedule] = useState<UserSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const value: WeatherContextValue = {
    weatherData,
    setWeatherData,
    userSchedule,
    setUserSchedule,
    isLoading,
    setIsLoading,
    error,
    setError,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};