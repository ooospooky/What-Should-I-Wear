import { useState } from "react";
import { city, districts } from "../../Assets/rawData";
import { TimeOption } from "../../Components/TimeOption";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { WeatherURLParams, URLParamsUtils } from "../../types/url";
import { Player } from "@lottiefiles/react-lottie-player";
import sunNcloudAnimation from "../../Assets/animation/sunNcloud.json";
import { LoadingSpinner } from "@/components/LoadingSpinner";

type DateType = "today" | "tomorrow" | "afterTomorrow";
type TrafficType = "walking" | "cycling" | "driving" | "public";

const SunAnimation = () => (
  <Player className="sun-animation" autoplay loop src={sunNcloudAnimation} />
);

// 日期選擇按鈕組件
interface DateButtonProps {
  id: string;
  label: string;
  date: string;
  selectedDate: DateType;
  onDateChange: (
    date: DateType,
    goOutTime?: string,
    goHomeTime?: string
  ) => void;
  showAnimation?: boolean;
  dateValue?: string;
}

const DateButton = ({
  id,
  label,
  date,
  selectedDate,
  onDateChange,
  showAnimation = false,
  dateValue,
}: DateButtonProps) => {
  const isSelected = selectedDate === date;

  return (
    <div className="mb-2 w-full">
      <input
        type="radio"
        id={id}
        checked={isSelected}
        onChange={() => {
          if (date === "today") {
            onDateChange(date as DateType, moment().format("HH:00"));
          } else {
            onDateChange(date as DateType, "09:00", "18:00");
          }
        }}
        className="hidden"
      />
      <label
        htmlFor={id}
        className={`relative m-2 mt-0 block cursor-pointer rounded-3xl border-none text-primary transition-all duration-200 ${isSelected ? "date-btn-bg h-40 md:h-52" : "date-btn-bg"} `}
      >
        <div className="flex justify-between p-5">
          <p className="font-display text-xl sm:text-lg md:text-xl">{label}</p>
          {isSelected && (
            <p className="font-display text-xl sm:text-lg md:text-xl">
              {dateValue}
            </p>
          )}
        </div>
        {isSelected && showAnimation && <SunAnimation />}
      </label>
    </div>
  );
};

// 日期選擇區域組件
interface DateSectionProps {
  selectedDate: DateType;
  onDateChange: (
    date: DateType,
    goOutTime?: string,
    goHomeTime?: string
  ) => void;
}

const DateSection = ({ selectedDate, onDateChange }: DateSectionProps) => (
  <div className="flex w-full flex-col justify-center text-sm font-medium sm:mt-2 sm:h-1/2 md:mt-0 md:h-auto">
    <DateButton
      id="today"
      label="TODAY"
      date="today"
      selectedDate={selectedDate}
      onDateChange={onDateChange}
      showAnimation={true}
      dateValue={moment().format("M/D")}
    />
    <DateButton
      id="tomorrow"
      label="TOMORROW"
      date="tomorrow"
      selectedDate={selectedDate}
      onDateChange={onDateChange}
      showAnimation={true}
      dateValue={moment().add(1, "days").format("M/D")}
    />
    <DateButton
      id="afterTomorrow"
      label="AFTER TOMORROW"
      date="afterTomorrow"
      selectedDate={selectedDate}
      onDateChange={onDateChange}
      showAnimation={true}
      dateValue={moment().add(2, "days").format("M/D")}
    />
  </div>
);

// 地區選擇組件
interface LocationSelectorProps {
  region: string[];
  district: string;
  onRegionChange: (value: string) => void;
  onDistrictChange: (value: string) => void;
}

const LocationSelector = ({
  region,
  district,
  onRegionChange,
  onDistrictChange,
}: LocationSelectorProps) => (
  <div className="flex items-center">
    <ion-icon
      name="location-outline"
      className="mr-2 text-2xl text-accent-yellow"
    />
    <select
      className="mr-4 h-8 w-28 rounded-xl bg-white text-base text-black sm:mr-3 sm:w-24 md:mr-4 md:w-28"
      onChange={(e) => onRegionChange(e.target.value)}
    >
      {city.map((data) => (
        <option key={data} value={data}>
          {data[0]}
        </option>
      ))}
    </select>
    <select
      className="h-8 w-28 rounded-xl bg-white text-base text-black sm:w-24 md:w-28"
      value={district}
      onChange={(e) => onDistrictChange(e.target.value)}
    >
      {districts[region[0]].map((data) => (
        <option key={data} value={data}>
          {data}
        </option>
      ))}
    </select>
  </div>
);

interface TimeSelectionProps {
  date: DateType;
  goOutTime: string;
  goHomeTime: string;
  onGoOutTimeChange: (time: string) => void;
  onGoHomeTimeChange: (time: string) => void;
  errorMessage: string;
}

const TimeSelection = ({
  date,
  goOutTime,
  goHomeTime,
  onGoOutTimeChange,
  onGoHomeTimeChange,
  errorMessage,
}: TimeSelectionProps) => (
  <div>
    <div className="flex w-full items-center justify-between sm:flex-col sm:space-y-4 md:flex-row md:space-y-0">
      <div className="flex items-center">
        <label className="mr-1 text-sm md:mr-2">
          <h3>出門時間</h3>
        </label>
        <TimeOption
          onChange={(e) => onGoOutTimeChange(e.target.value)}
          date={date}
          defaultTime={goOutTime}
        />
      </div>
      <div className="flex items-center">
        <label className="mr-1 text-sm md:mr-2">
          <h3>回家時間</h3>
        </label>
        <TimeOption
          onChange={(e) => onGoHomeTimeChange(e.target.value)}
          date={date}
          defaultTime={goHomeTime}
        />
      </div>
    </div>
    {errorMessage && (
      <span className="mt-2 inline-block text-sm text-error">
        {errorMessage}
      </span>
    )}
  </div>
);

interface TransportationSelectorProps {
  selectedTraffic: TrafficType;
  onTrafficChange: (traffic: TrafficType) => void;
}

const TransportationSelector = ({
  selectedTraffic,
  onTrafficChange,
}: TransportationSelectorProps) => {
  const transportOptions = [
    { id: "walk", value: "walking", icon: "walk", label: "步行" },
    { id: "moto", value: "cycling", icon: "bicycle", label: "騎車" },
    { id: "car", value: "driving", icon: "car-sport", label: "開車" },
    { id: "bus", value: "public", icon: "bus", label: "大眾運輸" },
  ];

  return (
    <>
      <h3 className="mb-2 mt-4">交通工具</h3>
      <div className="flex justify-evenly">
        {transportOptions.map(({ id, value, icon }) => (
          <div key={id}>
            <input
              type="radio"
              id={id}
              value={value}
              className="hidden"
              onChange={(event) =>
                onTrafficChange(event.target.value as TrafficType)
              }
              checked={selectedTraffic === value}
            />
            <label
              htmlFor={id}
              className={`cursor-pointer text-4xl transition-colors duration-200 ${
                selectedTraffic === value ? "text-accent-yellow" : "text-white"
              } `}
            >
              <ion-icon name={icon} />
            </label>
          </div>
        ))}
      </div>
    </>
  );
};

interface SubmitButtonProps {
  disabled: boolean;
  onClick: (event: React.FormEvent) => void;
}

const SubmitButton = ({ disabled, onClick }: SubmitButtonProps) => (
  <div className="mt-8 flex justify-center">
    <button
      disabled={disabled}
      className="group relative min-w-0 flex-shrink-0 transform-gpu overflow-hidden rounded-full border-0 bg-button-primary px-8 py-4 text-base font-semibold text-white shadow-button transition-all duration-300 ease-out before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-button-hover hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 active:translate-y-0 active:scale-95 active:shadow-button-active disabled:transform-none disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-600 disabled:opacity-50 disabled:shadow-none group-hover:before:opacity-100 sm:text-lg"
      onClick={onClick}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 whitespace-nowrap">
        What Should I Wear?
      </span>
    </button>
  </div>
);

function Home() {
  const [date, setDate] = useState<DateType>("today");
  const [goOutTime, setGoOutTime] = useState(moment().format("HH:00"));
  const [goHomeTime, setGoHomeTime] = useState("18:00");
  const [traffic, setTraffic] = useState<TrafficType>("cycling");
  const [region, setRegion] = useState(city[0]);
  const [district, setDistrict] = useState(districts[region[0]][0]);
  const [showTransition, setShowTransition] = useState(false);
  const navigate = useNavigate();

  let errorMessage = "";

  // 時間邏輯修正
  if (goOutTime > goHomeTime) {
    setGoHomeTime(
      String(Number(goOutTime.slice(0, 2)) + 1).padStart(2, "0") + ":00"
    );
  }

  // 驗證當天出門時間
  if (
    goOutTime < String(moment().hour()).padStart(2, "0") + ":00" &&
    date === "today"
  ) {
    errorMessage = "出門時間要大於目前時間";
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setShowTransition(true);

    const urlParams: WeatherURLParams = {
      locationId: region[1],
      locationName: region[0],
      district: district,
      date: date as WeatherURLParams["date"],
      goOutTime,
      goHomeTime,
      transportation: traffic as WeatherURLParams["transportation"],
    };

    const searchParams = URLParamsUtils.toURLSearchParams(urlParams);

    setTimeout(() => {
      navigate(`/result?${searchParams.toString()}`);
    }, 700);
  };

  const handleRegionChange = (value: string) => {
    const regionArray = value.split(",");
    setRegion(regionArray);
    setDistrict(districts[regionArray[0]][0]);
  };

  const handleDistrictChange = (value: string) => {
    setDistrict(value);
  };

  const handleDateChange = (
    newDate: DateType,
    goOutTime?: string,
    goHomeTime?: string
  ) => {
    setDate(newDate);
    if (goOutTime) setGoOutTime(goOutTime);
    if (goHomeTime) setGoHomeTime(goHomeTime);
  };

  const handleGoOutTimeChange = (time: string) => {
    setGoOutTime(time);
  };

  const handleGoHomeTimeChange = (time: string) => {
    setGoHomeTime(time);
  };

  const handleTrafficChange = (traffic: TrafficType) => {
    setTraffic(traffic);
  };

  if (showTransition) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-primary text-white">
      <form
        onSubmit={handleSubmit}
        className="flex h-full w-full flex-col px-4 py-8 sm:w-4/5 sm:px-8 md:grid md:h-4/5 md:w-3/5 md:grid-cols-[1fr_2fr] md:gap-8 md:px-0 md:py-0"
      >
        {/* 日期選擇區域 */}
        <DateSection selectedDate={date} onDateChange={handleDateChange} />

        {/* 右側控制區域 */}
        <div className="mt-8 flex flex-col justify-center gap-5 space-y-6 sm:mt-6 sm:space-y-8 md:mt-0 md:justify-center md:space-y-0">
          {/* 地區選擇 */}
          <LocationSelector
            region={region}
            district={district}
            onRegionChange={handleRegionChange}
            onDistrictChange={handleDistrictChange}
          />
          <div className="mt-8 rounded-xl border border-gray-400 p-4 sm:mt-4 sm:p-3 md:mt-6 md:p-4">
            {/* 時間選擇 */}
            <TimeSelection
              date={date}
              goOutTime={goOutTime}
              goHomeTime={goHomeTime}
              onGoOutTimeChange={handleGoOutTimeChange}
              onGoHomeTimeChange={handleGoHomeTimeChange}
              errorMessage={errorMessage}
            />

            {/* 交通工具選擇 */}
            <TransportationSelector
              selectedTraffic={traffic}
              onTrafficChange={handleTrafficChange}
            />

            {/* 提交按鈕 */}
            <SubmitButton disabled={!!errorMessage} onClick={handleSubmit} />
          </div>
        </div>
      </form>
    </div>
  );
}

export default Home;
