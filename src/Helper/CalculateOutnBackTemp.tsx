import { useContext } from "react";
import { WeatherContext } from "../Contexts/WeatherContext";

/**
 * 計算特定時間的內插溫度組件
 * @param opt "goOutTime" 或 "goHomeTime"
 * @returns 計算後的溫度值或 Loading 組件
 */
const CalculateOutnBackTemp = ({
  opt,
}: {
  opt: "goOutTime" | "goHomeTime";
}) => {
  const context = useContext(WeatherContext) as any;
  const { weatherTemp, formData } = context;

  if (!weatherTemp) {
    return <h3>Loading...</h3>;
  }

  if (!formData?.[opt]) {
    return 0;
  }

  // 臨時使用簡化邏輯，找最接近的時間點
  const targetHour = parseInt(formData[opt].slice(0, 2), 10);
  const availableHours = Object.keys(weatherTemp);

  // 找最接近的小時
  let closestHour = "00";
  let minDiff = 24;

  for (const hour of availableHours) {
    if (hour === "Nextday00") continue;
    const hourNum = parseInt(hour, 10);
    const diff = Math.abs(hourNum - targetHour);
    if (diff < minDiff) {
      minDiff = diff;
      closestHour = hour;
    }
  }

  return weatherTemp[closestHour] || 0;
};

export default CalculateOutnBackTemp;
