import { useContext } from "react";
import { WeatherContext } from "../Contexts/WeatherContext";

const CalculatePop = () => {
  const context = useContext(WeatherContext) as any;
  const { pop } = context;

  if (!pop) {
    return 0;
  }

  const probs = Object.values(pop) as number[];
  if (!probs.length) {
    return 0;
  }

  return Math.round(probs.reduce((sum, prob) => sum + prob, 0) / probs.length);
};

export default CalculatePop;
