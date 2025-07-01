// 🌤️ Result 頁面 - Suspense 版本

import "./Result.scss";
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
import moment from "moment";
import { Player } from "@lottiefiles/react-lottie-player";

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

function ResultSuspense() {
  const containerStyle = {
    "--view-height": `${window.innerHeight}px`,
  };

  const [searchParams] = useSearchParams();
  const urlParams = URLParamsUtils.fromURLSearchParams(searchParams);

  // 檢查參數完整性，如果不完整則導向首頁
  if (!URLParamsUtils.isComplete(urlParams)) {
    return <InvalidParamsRedirect />;
  }

  const { data: weatherData } = useWeatherSuspenseQuery(urlParams);

  const userSchedule = createUserScheduleFromURLSuspense(urlParams);

  const navigate = useNavigate();

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

  // 格式化日期
  const date = moment().format("MMM Do");

  // 衣物建議渲染函數
  const renderClothingSuggestion = (
    imageSrc: string,
    altText: string,
    description: string
  ) => (
    <div>
      <img src={imageSrc} alt={altText} />
      <span>{description}</span>
    </div>
  );

  const motoOrNot = () => {
    if (userSchedule.transportation === "cycling") {
      if (averageTemp < 12)
        return renderClothingSuggestion(
          gloves,
          "手套",
          "騎車時可以戴上手套保暖"
        );
      return renderClothingSuggestion(
        thinJacket,
        "薄外套",
        "建議在騎車時穿上薄外套擋風"
      );
    }
    return null;
  };

  const needRaincoat = () => {
    return averagePop > 10
      ? renderClothingSuggestion(
          raincoat,
          "雨衣",
          `降雨機率為${averagePop}%建議帶上雨衣或雨傘`
        )
      : null;
  };

  const suggestion = () => {
    if (averageTemp >= 26) {
      return (
        <>
          <div className="result__right__imgdiv">
            <img
              className="result__right__img"
              src={womanShortPants}
              alt="womanShortPants"
            />
            <img
              className="result__right__img"
              src={manShortPants}
              alt="manShortPants"
              style={{ marginLeft: "1rem" }}
            />
          </div>
          <div className="description">
            <h3 style={{ marginLeft: "1rem" }}>衣著建議</h3>
            <>
              {renderClothingSuggestion(shirt, "短袖", "短袖")}
              {renderClothingSuggestion(shortpants, "短褲", "短褲")}
              {needRaincoat()}
            </>
          </div>
        </>
      );
    }

    if (averageTemp < 26 && averageTemp >= 22) {
      return (
        <>
          <div className="result__right__imgdiv">
            <img
              className="result__right__img"
              src={womanTshirtLongPants1}
              alt="womanTshirtLongPants1"
            />
            <img
              className="result__right__img"
              src={manTshirtLognPants}
              alt="manTshirtLognPants"
            />
          </div>
          <div className="description">
            <h3>衣著建議</h3>
            <>
              {renderClothingSuggestion(shirt, "短袖", "短袖")}
              {renderClothingSuggestion(
                longpants,
                "長褲",
                "長褲優先，怕熱的話短褲也不錯"
              )}
              {motoOrNot()}
              {needRaincoat()}
            </>
          </div>
        </>
      );
    }

    if (averageTemp < 22 && averageTemp >= 20) {
      return (
        <>
          <div className="result__right__imgdiv">
            <img
              className="result__right__img"
              src={womanLongShirtPants}
              alt="womanLongShirtPants"
            />
            <img
              className="result__right__img"
              src={manLongShirtPants}
              alt="manLongShirtPants"
            />
          </div>
          <div className="description">
            <h3>衣著建議</h3>
            <>
              {renderClothingSuggestion(longshirt, "薄長袖", "薄長袖")}
              {renderClothingSuggestion(longpants, "長褲", "長褲")}
              {motoOrNot()}
              {needRaincoat()}
            </>
          </div>
        </>
      );
    }

    if (averageTemp < 20 && averageTemp >= 16) {
      return (
        <>
          <div className="result__right__imgdiv">
            <img
              className="result__right__img"
              src={womanSweater}
              alt="womanSweater"
            />
            <img
              className="result__right__img result__right__hoodieManImg"
              src={manHoodie}
              alt="manHoodie"
              style={{ marginLeft: ".5rem" }}
            />
          </div>
          <div className="description">
            <h3>衣著建議</h3>
            <>
              {renderClothingSuggestion(hoodie, "大學t或帽t", "大學T或帽T")}
              {renderClothingSuggestion(longpants, "長褲", "長褲")}
              {motoOrNot()}
              {needRaincoat()}
            </>
          </div>
        </>
      );
    }

    if (averageTemp < 16 && averageTemp >= 12) {
      return (
        <>
          <div className="result__right__imgdiv">
            <img
              className="result__right__img"
              src={womanJacket}
              alt="womanJacket"
            />
            <img
              className="result__right__img"
              src={manJacket}
              alt="manJacket"
            />
          </div>
          <div className="description">
            <h3>衣著建議</h3>
            <>
              {renderClothingSuggestion(hoodie, "大學t或帽t", "大學T或帽T")}
              {renderClothingSuggestion(
                insideshirt,
                "發熱衣",
                "加上一件發熱衣保暖"
              )}
              {renderClothingSuggestion(longpants, "長褲", "長褲")}
              {needRaincoat()}
            </>
          </div>
        </>
      );
    }

    if (averageTemp < 12) {
      return (
        <>
          <div className="result__right__imgdiv">
            <img
              className="result__right__img"
              src={womanPufferJacket}
              alt="womanJacket"
            />
            <img
              className="result__right__img"
              src={manPufferJacket}
              alt="manPufferJacket"
            />
          </div>
          <div className="description">
            <h3>衣著建議</h3>
            <>
              {renderClothingSuggestion(hoodie, "大學t", "大學t或帽t")}
              {renderClothingSuggestion(
                insideshirt,
                "發熱衣",
                "加上一件發熱衣保暖"
              )}
              {renderClothingSuggestion(longpants, "長褲", "長褲")}
              {renderClothingSuggestion(pufferjacket, "厚外套", "厚外套")}
              {motoOrNot()}
              {needRaincoat()}
            </>
          </div>
        </>
      );
    }
  };

  const outAtNightCondition =
    parseInt(userSchedule.goOutTime.slice(0, 2)) >= 18 ||
    (parseInt(userSchedule.goOutTime.slice(0, 2)) < 6 &&
      parseInt(userSchedule.goHomeTime.slice(0, 2)) <= 6);

  const getresultAnimation = () => {
    if (averagePop <= 20) {
      if (outAtNightCondition) return resultMoon;
      return resultSun;
    }
    if (averagePop > 20 && averagePop <= 40) return resultCloudy;
    if (averagePop > 40) return resultRain;
  };

  const weatherAnimation = (
    <Player
      className="resultAnimation"
      autoplay
      loop
      src={getresultAnimation()}
    />
  );

  return (
    <div className="result" style={containerStyle}>
      <div className="result__left">
        <div className="sun">
          <div className="sun__up">
            <div className="weatherAnimation">{weatherAnimation}</div>
            <span className="sun__up__temp">{averageTemp}&deg;C</span>
          </div>
          <div className="sun__down">
            <span>{date}&ensp;&ensp;</span>
            <span>{weatherData.locationName}</span>
          </div>
        </div>
        <div className="lilcontainer outTemp ">
          <span className="lilcontainer__bigText">
            出門: <br />
            {goOutTemp ?? "--"}&deg;C
          </span>
        </div>
        <div className="lilcontainer backTemp">
          <span className="lilcontainer__bigText">
            回家: <br />
            {goHomeTemp ?? "--"}&deg;C
          </span>
        </div>
        <div className="lilcontainer avgTemp">
          <span className="lilcontainer__smallText">
            在外時平均溫度: {averageTemp}&deg;C
          </span>
        </div>
        <div className="lilcontainer avgTempDiff">
          <span className="lilcontainer__smallText">
            在外時最大溫差: {tempDiff}&deg;C
          </span>
        </div>
        <div className="lilcontainer pop">
          <span className="lilcontainer__smallText">
            在外時降雨率: {averagePop}%
          </span>
        </div>
      </div>
      <div className="result__right">
        {suggestion()}
        <button className="backBtn" onClick={() => navigate("/home")}>
          &larr;&nbsp;返回
        </button>
      </div>
    </div>
  );
}

/**
 * 參數不完整時的重導向組件
 * TODO: refactor when change to Tailwind
 */
const InvalidParamsRedirect = () => {
  const navigate = useNavigate();

  const containerStyle = {
    "--view-height": `${window.innerHeight}px`,
  };

  return (
    <div className="result" style={containerStyle}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2>參數不完整</h2>
        <p>請重新選擇天氣查詢條件</p>
        <button className="backBtn" onClick={() => navigate("/home")}>
          &larr;&nbsp;返回首頁
        </button>
      </div>
    </div>
  );
};

export default ResultSuspense;
