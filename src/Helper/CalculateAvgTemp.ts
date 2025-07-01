import { useContext } from "react";
import { WeatherContext } from "../Contexts/WeatherContext";

const CalculateAvgTemp = () => {
  const context = useContext(WeatherContext) as any;
  const { weatherTemp, formData } = context;

  if (!weatherTemp || !formData) {
    return { averageTemp: 0, tempDiff: 0 };
  }

  // 暫時返回預設值
  const temps = Object.values(weatherTemp) as number[];
  if (!temps.length) {
    return { averageTemp: 0, tempDiff: 0 };
  }

  const averageTemp = Math.round(
    temps.reduce((sum, temp) => sum + temp, 0) / temps.length
  );
  const max = Math.max(...temps);
  const min = Math.min(...temps);

  return { averageTemp, tempDiff: max - min };
};

export default CalculateAvgTemp;
