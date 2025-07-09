import { useSearchParams, useNavigate } from "react-router-dom";
import { URLParamsUtils } from "../../types/url";
import {
  useWeatherSuspenseQuery,
  createUserScheduleFromURLSuspense,
} from "../../hooks/useWeatherSuspenseQuery";
import {
  useWeatherCalculation,
  useTemperatureAtTime,
} from "../../hooks/useWeatherCalculation";
import { useAISuggestionMutation } from "../../hooks/useAISuggestionQuery";
import moment from "moment";
import { Player } from "@lottiefiles/react-lottie-player";
import { memo, useMemo, useCallback, useState } from "react";

// Animations
import resultSun from "../../Assets/animation/resultSun.json";
import resultCloudy from "../../Assets/animation/resultCloudy.json";
import resultRain from "../../Assets/animation/resultRain.json";
import resultMoon from "../../Assets/animation/resultMoon.json";

// Clothing SVGs
import shirt from "../../Assets/svg/shirt.svg";
import gloves from "../../Assets/svg/gloves.svg";
import hoodie from "../../Assets/svg/hoodie.svg";
import longpants from "../../Assets/svg/longpants.svg";
import longshirt from "../../Assets/svg/longshirt.svg";
import shortpants from "../../Assets/svg/pants.svg";
import pufferjacket from "../../Assets/svg/puffer-jacket.svg";
import raincoat from "../../Assets/svg/raincoat.svg";
import thinJacket from "../../Assets/svg/thinJacket.svg";
import insideshirt from "../../Assets/svg/insideshirt.svg";

// Clothing images
import manShortPants from "../../Assets/img/manShortPants.png";
import womanShortPants from "../../Assets/img/womanShortPants.png";
import manTshirtLognPants from "../../Assets/img/manTshirtLognPants.png";
import womanTshirtLongPants1 from "../../Assets/img/womanTshirtLongPants2.png";
import manLongShirtPants from "../../Assets/img/manLongShirtPants2.png";
import womanLongShirtPants from "../../Assets/img/womanLongShirtPantsWithBag.png";
import manHoodie from "../../Assets/img/manHoodie2.png";
import womanSweater from "../../Assets/img/womanSweater.png";
import manJacket from "../../Assets/img/manJacket.png";
import womanJacket from "../../Assets/img/womanJacket.png";
import manPufferJacket from "../../Assets/img/manPufferJacket.png";
import womanPufferJacket from "../../Assets/img/womanPufferJacket.png";

const TEMPERATURE_THRESHOLDS = {
  HOT: 26,
  WARM: 22,
  MILD: 20,
  COOL: 16,
  COLD: 12,
} as const;

const RAIN_THRESHOLD = 10;
const NIGHT_START_HOUR = 18;
const NIGHT_END_HOUR = 6;

const RAIN_PROBABILITY_THRESHOLDS = {
  LOW: 20,
  MODERATE: 40,
} as const;

const GLOVES_TEMPERATURE = 12;

interface ClothingItem {
  icon: string;
  name: string;
  description: string;
}

interface ClothingConfig {
  womanImage: string;
  manImage: string;
  items: ClothingItem[];
  additionalItems?: ClothingItem[];
}

type TemperatureRange = "hot" | "warm" | "mild" | "cool" | "cold" | "freezing";

interface WeatherData {
  locationName: string;
}

interface UserSchedule {
  transportation: string;
  goOutTime: string;
  goHomeTime: string;
}

interface WeatherCalculation {
  averageTemperature: number;
  temperatureDifference: number;
  averageRainProbability: number;
}

const CLOTHING_CONFIG: Record<TemperatureRange, ClothingConfig> = {
  hot: {
    womanImage: womanShortPants,
    manImage: manShortPants,
    items: [
      { icon: shirt, name: "短袖", description: "短袖" },
      { icon: shortpants, name: "短褲", description: "短褲" },
    ],
  },
  warm: {
    womanImage: womanTshirtLongPants1,
    manImage: manTshirtLognPants,
    items: [
      { icon: shirt, name: "短袖", description: "短袖" },
      {
        icon: longpants,
        name: "長褲",
        description: "長褲優先，怕熱的話短褲也不錯",
      },
    ],
  },
  mild: {
    womanImage: womanLongShirtPants,
    manImage: manLongShirtPants,
    items: [
      { icon: longshirt, name: "薄長袖", description: "薄長袖" },
      { icon: longpants, name: "長褲", description: "長褲" },
    ],
  },
  cool: {
    womanImage: womanSweater,
    manImage: manHoodie,
    items: [
      { icon: hoodie, name: "大學t或帽t", description: "大學T或帽T" },
      { icon: longpants, name: "長褲", description: "長褲" },
    ],
  },
  cold: {
    womanImage: womanJacket,
    manImage: manJacket,
    items: [
      { icon: hoodie, name: "大學t或帽t", description: "大學T或帽T" },
      { icon: insideshirt, name: "發熱衣", description: "加上一件發熱衣保暖" },
      { icon: longpants, name: "長褲", description: "長褲" },
    ],
  },
  freezing: {
    womanImage: womanPufferJacket,
    manImage: manPufferJacket,
    items: [
      { icon: hoodie, name: "大學t", description: "大學t或帽t" },
      { icon: insideshirt, name: "發熱衣", description: "加上一件發熱衣保暖" },
      { icon: longpants, name: "長褲", description: "長褲" },
      { icon: pufferjacket, name: "厚外套", description: "厚外套" },
    ],
  },
};

const MODERN_STYLES = {
  main: "min-h-screen bg-gradient-primary flex flex-col lg:flex-row justify-center items-center p-4 gap-6",
  weatherSection:
    "w-full lg:w-96 xl:w-80 2xl:w-96 grid grid-cols-2 gap-3 sm:gap-4 text-white",
  weatherHeader:
    "col-span-2 flex flex-col items-center justify-center bg-primary/20 backdrop-blur-sm rounded-3xl p-6 transition-all duration-300 hover:bg-primary/30",
  weatherIcon:
    "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 transition-transform duration-300 hover:scale-110",
  temperature:
    "text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent",
  locationText:
    "text-sm sm:text-base lg:text-lg font-medium text-center mt-2 opacity-90",
  weatherCard:
    "bg-primary/40 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-center text-center transition-all duration-300 hover:bg-primary/50 hover:scale-105 hover:shadow-lg",
  weatherCardText: "text-sm sm:text-base lg:text-lg font-medium",
  weatherCardSmallText: "text-xs sm:text-sm lg:text-base font-medium",
  suggestionSection: "w-full lg:w-auto flex-1 max-w-4xl",
  suggestionContainer: "flex flex-col lg:flex-row items-center gap-8 lg:gap-12",
  imagesContainer: "flex flex-row gap-4 sm:gap-6",
  clothingImage: "w-48 h-80 sm:w-56 sm:h-96 lg:w-64 lg:h-[26rem] ",
  suggestionText: "text-white flex flex-col items-start gap-4 flex-1",
  suggestionTitle:
    "text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent",
  clothingGrid: "grid grid-cols-1 sm:grid-cols-2 gap-3 w-full",
  clothingItem:
    "flex items-center gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-xl transition-all duration-300 hover:bg-white/20 hover:scale-105",
  clothingIcon: "w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0",
  clothingText: "text-sm sm:text-base font-medium",
  backButton:
    "fixed bottom-6 right-6 lg:absolute lg:bottom-8 lg:right-8 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:bg-white/30 hover:scale-105 shadow-lg border border-white/20",
};

const WeatherCard = memo(
  ({
    title,
    value,
    className = "",
  }: {
    title: string;
    value: string;
    className?: string;
  }) => (
    <div className={`${MODERN_STYLES.weatherCard} ${className}`}>
      <div>
        <div className={MODERN_STYLES.weatherCardText}>{title}</div>
        <div className="mt-1 text-lg font-bold sm:text-xl lg:text-2xl">
          {value}
        </div>
      </div>
    </div>
  )
);

const ClothingItem = memo(({ item }: { item: ClothingItem }) => (
  <div className={MODERN_STYLES.clothingItem}>
    <img
      src={item.icon}
      alt={item.name}
      className={MODERN_STYLES.clothingIcon}
      loading="lazy"
    />
    <span className={MODERN_STYLES.clothingText}>{item.description}</span>
  </div>
));

const ClothingImages = memo(({ config }: { config: ClothingConfig }) => (
  <div className={MODERN_STYLES.imagesContainer}>
    <img
      src={config.womanImage}
      alt="女性穿搭建議"
      className={MODERN_STYLES.clothingImage}
      loading="lazy"
    />
    <img
      src={config.manImage}
      alt="男性穿搭建議"
      className={MODERN_STYLES.clothingImage}
      loading="lazy"
    />
  </div>
));

function ResultSuspense() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const aiMutation = useAISuggestionMutation();

  const urlParams = useMemo(
    () => URLParamsUtils.fromURLSearchParams(searchParams),
    [searchParams]
  );

  if (!URLParamsUtils.isComplete(urlParams)) {
    return <InvalidParamsRedirect />;
  }

  const { data: weatherData } = useWeatherSuspenseQuery(urlParams);
  const userSchedule = createUserScheduleFromURLSuspense(urlParams);
  const calculation = useWeatherCalculation(weatherData, userSchedule);
  const goOutTemp = useTemperatureAtTime(weatherData, userSchedule.goOutTime);
  const goHomeTemp = useTemperatureAtTime(weatherData, userSchedule.goHomeTime);

  if (!calculation) {
    throw new Error("無法計算天氣數據");
  }

  const {
    averageTemperature: averageTemp,
    temperatureDifference: tempDiff,
    averageRainProbability: averagePop,
  } = calculation;

  const date = useMemo(() => moment().format("MMM Do"), []);

  const getTemperatureRange = useCallback((temp: number): TemperatureRange => {
    if (temp >= TEMPERATURE_THRESHOLDS.HOT) return "hot";
    if (temp >= TEMPERATURE_THRESHOLDS.WARM) return "warm";
    if (temp >= TEMPERATURE_THRESHOLDS.MILD) return "mild";
    if (temp >= TEMPERATURE_THRESHOLDS.COOL) return "cool";
    if (temp >= TEMPERATURE_THRESHOLDS.COLD) return "cold";
    return "freezing";
  }, []);

  const cyclingGear = useMemo((): ClothingItem | null => {
    if (userSchedule.transportation !== "cycling") return null;

    return averageTemp < GLOVES_TEMPERATURE
      ? {
          icon: gloves,
          name: "手套",
          description: "騎車時可以戴上手套保暖",
        }
      : {
          icon: thinJacket,
          name: "薄外套",
          description: "建議在騎車時穿上薄外套擋風",
        };
  }, [userSchedule.transportation, averageTemp]);

  const rainGear = useMemo((): ClothingItem | null => {
    return averagePop > RAIN_THRESHOLD
      ? {
          icon: raincoat,
          name: "雨衣",
          description: `降雨機率為${averagePop}%建議帶上雨衣或雨傘`,
        }
      : null;
  }, [averagePop]);

  const clothingSuggestion = useMemo(() => {
    const tempRange = getTemperatureRange(averageTemp);
    const config = CLOTHING_CONFIG[tempRange];

    const allItems = [
      ...config.items,
      ...(cyclingGear ? [cyclingGear] : []),
      ...(rainGear ? [rainGear] : []),
    ];

    return { config, allItems };
  }, [averageTemp, cyclingGear, rainGear, getTemperatureRange]);

  const isNightTime = useMemo(() => {
    const goOutHour = parseInt(userSchedule.goOutTime.slice(0, 2));
    const goHomeHour = parseInt(userSchedule.goHomeTime.slice(0, 2));

    return (
      goOutHour >= NIGHT_START_HOUR ||
      (goOutHour < NIGHT_END_HOUR && goHomeHour <= NIGHT_END_HOUR)
    );
  }, [userSchedule.goOutTime, userSchedule.goHomeTime]);

  const weatherAnimationSrc = useMemo(() => {
    if (averagePop <= RAIN_PROBABILITY_THRESHOLDS.LOW) {
      return isNightTime ? resultMoon : resultSun;
    }
    if (averagePop <= RAIN_PROBABILITY_THRESHOLDS.MODERATE) {
      return resultCloudy;
    }
    return resultRain;
  }, [averagePop, isNightTime]);

  const handleBackClick = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  const handleAISuggestion = useCallback(async () => {
    try {
      const result = await aiMutation.mutateAsync({
        weatherData,
        userSchedule,
        calculation,
      });
      setAiSuggestion(result);
    } catch (error) {
      console.error("Failed to get AI suggestion:", error);
    }
  }, [weatherData, userSchedule, calculation, aiMutation]);

  const formattedSuggestion = useMemo(() => {
    if (!aiSuggestion) return null;

    // **重點內容**，顯示成粗體
    return aiSuggestion.split(/(\*\*.*?\*\*)/).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      ) : (
        part
      )
    );
  }, [aiSuggestion]);

  return (
    <main className={MODERN_STYLES.main}>
      <section className={MODERN_STYLES.weatherSection} aria-label="天氣資訊">
        <div className={MODERN_STYLES.weatherHeader}>
          <div className="flex items-center gap-4">
            <Player
              className={MODERN_STYLES.weatherIcon}
              autoplay
              loop
              src={weatherAnimationSrc}
            />
            <span className={MODERN_STYLES.temperature}>
              {averageTemp}&deg;C
            </span>
          </div>
          <div className={MODERN_STYLES.locationText}>
            {date} • {weatherData.locationName}
          </div>
        </div>

        <WeatherCard title="出門" value={`${goOutTemp ?? "--"}°C`} />
        <WeatherCard title="回家" value={`${goHomeTemp ?? "--"}°C`} />
        <WeatherCard
          title="平均溫度"
          value={`${averageTemp}°C`}
          className="col-span-2"
        />
        <WeatherCard title="最大溫差" value={`${tempDiff}°C`} />
        <WeatherCard title="降雨機率" value={`${averagePop}%`} />
      </section>

      <section
        className={MODERN_STYLES.suggestionSection}
        aria-label="穿搭建議"
      >
        <div className={MODERN_STYLES.suggestionContainer}>
          <ClothingImages config={clothingSuggestion.config} />
          <div className={MODERN_STYLES.suggestionText}>
            <div className="flex items-center gap-2">
              <h2 className={MODERN_STYLES.suggestionTitle}>穿搭建議</h2>
              <button
                onClick={handleAISuggestion}
                disabled={aiMutation.isPending}
                className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-600 disabled:opacity-50"
              >
                {aiMutation.isPending ? "AI 分析中..." : "🤖 AI 建議"}
              </button>
            </div>

            {aiSuggestion && (
              <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-gray-700">
                <h3 className="mb-2 font-semibold text-blue-800">
                  AI 專業建議：
                </h3>
                <div className="whitespace-pre-wrap">{formattedSuggestion}</div>
              </div>
            )}

            {aiMutation.isError && (
              <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
                無法取得 AI 建議，請稍後再試
              </div>
            )}

            <div className={MODERN_STYLES.clothingGrid}>
              {clothingSuggestion.allItems.map((item, index) => (
                <ClothingItem key={`${item.name}-${index}`} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <button
        className={MODERN_STYLES.backButton}
        onClick={handleBackClick}
        aria-label="返回首頁"
      >
        ← 返回
      </button>
    </main>
  );
}

const InvalidParamsRedirect = memo(() => {
  const navigate = useNavigate();

  const handleHomeClick = useCallback(() => {
    navigate("/home");
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-primary p-4">
      <div className="mx-auto max-w-md text-center">
        <div className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
            參數不完整
          </h2>
          <p className="mb-8 text-base text-white/80 sm:text-lg">
            請重新選擇天氣查詢條件
          </p>
          <button
            className="rounded-full border border-white/20 bg-white/20 px-8 py-4 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/30"
            onClick={handleHomeClick}
            aria-label="返回首頁"
          >
            ← 返回首頁
          </button>
        </div>
      </div>
    </main>
  );
});

export default ResultSuspense;
