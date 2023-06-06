import React, { useContext } from 'react'
import './Result.scss'
import { WeatherContext } from '../../Contexts/WeatherContext'

import CalculateOutnBackTemp from '../../Helper/CalculateOutnBackTemp'
import CalculateAvgTemp from '../../Helper/CalculateAvgTemp'
import CalculatePop from '../../Helper/CalculatePop'
import moment from 'moment'; //https://momentjs.com/
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { Link, useNavigate } from 'react-router-dom'
import resultSun from '../../Assets/animation/resultSun.json'
//https://assets7.lottiefiles.com/packages/lf20_64okjrr7.json
import resultCloudy from '../../Assets/animation/resultCloudy.json'
//https://lottiefiles.com/4806-weather-windy
import resultRain from '../../Assets/animation/resultRain.json'
// src="https://assets10.lottiefiles.com/temp/lf20_VAmWRg.json"
import resultMoon from '../../Assets/animation/resultMoon.json'
//https://lottiefiles.com/10686-the-moon

import shirt from '../../Assets/svg/shirt.svg'
// import {ReactComponent as ShortPanst} from '../../Assets/svg/pants.svg'
import beanie from '../../Assets/svg/beanie.svg'
import gloves from '../../Assets/svg/gloves.svg'
import hoodie from '../../Assets/svg/hoodie.svg'
import jacket from '../../Assets/svg/jacket.svg'
import longpants from '../../Assets/svg/longpants.svg'
import longshirt from '../../Assets/svg/longshirt.svg'
import shortpants from '../../Assets/svg/pants.svg'
import pufferjacket from '../../Assets/svg/puffer-jacket.svg'
import raincoat from '../../Assets/svg/raincoat.svg'
import thinJacket from '../../Assets/svg/thinJacket.svg'
import insideshirt from '../../Assets/svg/insideshirt.svg'

import manShortPants from '../../Assets/img/manShortPants.png'
import womanShortPants from '../../Assets/img/womanShortPants.png'
import manTshirtLognPants from '../../Assets/img/manTshirtLognPants.png'
import womanTshirtLongPants1 from '../../Assets/img/womanTshirtLongPants2.png'
import manLongShirtPants from '../../Assets/img/manLongShirtPants2.png'
import womanLongShirtPants from '../../Assets/img/womanLongShirtPantsWithBag.png'
import manHoodie from '../../Assets/img/manHoodie2.png'
import womanSweater from '../../Assets/img/womanSweater.png'
import manJacket from '../../Assets/img/manJacket.png'
import womanJacket from '../../Assets/img/womanJacket.png'
import manPufferJacket from '../../Assets/img/manPufferJacket.png'
import womanPufferJacket from '../../Assets/img/womanPufferJacket.png'

export default function Result() {
  const containerStyle = {
    '--view-height': '724px',
  };
  const { weatherTemp, pop, formData } = useContext(WeatherContext)
  // if(!weatherTemp) return (<div>123</div>)
  const navigate = useNavigate();
  let goOutTemp = CalculateOutnBackTemp("goOutTime")
  let goHomeTemp = CalculateOutnBackTemp("goHomeTime")
  let { averageTemp, tempDiff } = CalculateAvgTemp();
  let averagePop = CalculatePop()
  let date;
  if (formData.date === 'today') { date = moment().format("MMM Do"); }
  if (formData.date === 'tomorrow') { date = moment().add(1, 'days').format("MMM Do"); }
  if (formData.date === 'afterTomorrow') { date = moment().add(2, 'days').format("MMM Do"); }
  console.log("goOutTemp", goOutTemp, "goHomeTemp", goHomeTemp)
  console.log('doff', tempDiff)
  console.log('formDataaaa', formData)

  const renderClothingSuggestion = (imageSrc, altText, description) => {
    return (
      <div>
        <img src={imageSrc} alt={altText} />
        <span>{description}</span>
      </div>
    );
  };
  const motoOrNot = () => {
    if (formData.traffic === 'moto') {
      if (averageTemp < 12) renderClothingSuggestion(gloves, '手套', '騎車時可以戴上手套保暖')
      return (
        renderClothingSuggestion(thinJacket, '薄外套', '建議在騎車時穿上薄外套擋風')
      );
    }
    return null; //若有不符合條件的情況，會return undefined，並render null，可能有潛在問題，加上return null確保明確的return null
  };
  const needRaincoat = () => {
    return averagePop > 10 ? (
      renderClothingSuggestion(raincoat, '雨衣', `降雨機率為${averagePop}%建議帶上雨衣或雨傘`)
    ) : null;//若有不符合條件的情況，會return undefined，並render null，可能有潛在問題，加上return null確保明確的return null
  };
  const suggestion = () => {
    if (averageTemp >= 26) {
    return (
      <>
        <div className="result__right__imgdiv">
          <img className='result__right__img' src={womanShortPants} alt="womanShortPants" />
          <img className='result__right__img' src={manShortPants} alt="manShortPants" style={{marginLeft:"1rem"}} />
        </div>
        <div className="description">
          <h3>衣著建議</h3>
          <>
            {renderClothingSuggestion(shirt, '短袖', '短袖')}
            {renderClothingSuggestion(shortpants, '短褲', '短褲')}
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
          <img className='result__right__img' src={womanTshirtLongPants1} alt="womanTshirtLongPants1" />
          <img className='result__right__img' src={manTshirtLognPants} alt="manTshirtLognPants"  />
        </div>
        <div className="description">
          <h3>衣著建議</h3>
          <>
            {renderClothingSuggestion(shirt, '短袖', '短袖')}
            {renderClothingSuggestion(longpants, '長褲', '長褲優先，怕熱的話短褲也不錯')}
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
          <img className='result__right__img' src={womanLongShirtPants} alt="womanLongShirtPants" />
          <img className='result__right__img' src={manLongShirtPants} alt="manLongShirtPants" />
        </div>
        <div className="description">
          <h3>衣著建議</h3>
          <>
            {renderClothingSuggestion(longshirt, '薄長袖', '薄長袖')}
            {renderClothingSuggestion(longpants, '長褲', '長褲')}
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
            <img className='result__right__img' src={womanSweater} alt="womanSweater" />
            <img className='result__right__img result__right__hoodieManImg' src={manHoodie} alt="manHoodie" style={{ marginLeft: '.5rem' }} />
          </div>
          <div className="description">
            <h3>衣著建議</h3>
            <>
              {renderClothingSuggestion(hoodie, '大學t或帽t', '大學T或帽T')}
              {renderClothingSuggestion(longpants, '長褲', '長褲')}
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
            <img className='result__right__img' src={womanJacket} alt="womanJacket" />
            <img className='result__right__img' src={manJacket} alt="manJacket" />
          </div>
          <div className="description">
            <h3>衣著建議</h3>
            <>
              {renderClothingSuggestion(hoodie, '大學t或帽t', '大學T或帽T')}
              {renderClothingSuggestion(insideshirt, '發熱衣', '加上一件發熱衣保暖')}
              {renderClothingSuggestion(longpants, '長褲', '長褲')}
              {needRaincoat()}
            </>
          </div>
        </>
      );
    }

    if (averageTemp < 12) {
      {/* <div><img src={beanie}></img><span>也可以考慮帶上毛帽不讓頭著涼</span></div> */ }
      return (
        <>
          <div className="result__right__imgdiv">
            <img className='result__right__img' src={womanPufferJacket} alt="womanJacket" />
            <img className='result__right__img' src={manPufferJacket} alt="manPufferJacket" />
          </div>
          <div className="description">
            <h3>衣著建議</h3>
            <>
              {renderClothingSuggestion(hoodie, '大學t', '大學t或帽t')}
              {renderClothingSuggestion(insideshirt, '發熱衣', '加上一件發熱衣保暖')}
              {renderClothingSuggestion(longpants, '長褲', '長褲')}
              {renderClothingSuggestion(pufferjacket, '厚外套', '厚外套')}
              {motoOrNot()}
              {needRaincoat()}
            </>
          </div>
        </>
      );
    }
  };
  const outAtNightCondition = formData.goOutTime.slice(0, 2) >= 18 || formData.goOutTime.slice(0, 2) < 6 && formData.goHomeTime.slice(0, 2) <= 6
  // if (formData.goOutTime.slice(0, 2) >= 18)
  //降雨率小於20將設為sun, 大於20小於40設為cloud, 大於40設為raining
  const getresultAnimation = () => {
    if (averagePop <= 20) {
      if (outAtNightCondition) return resultMoon;
      return resultSun
    };
    if (averagePop > 20 && averagePop <= 40) return resultCloudy
    if (averagePop > 40) return resultRain
  };

  const weatherAnimation = <Player
    className='resultAnimation'
    autoplay
    loop
    src={getresultAnimation()}
  />
  return (
    <div className="result" style={containerStyle} >

      <div className="result__left">
        <div className="sun">
          <div className="sun__up">
            <div className='weatherAnimation'>
              {weatherAnimation}
            </div>
            <span className='sun__up__temp'>{averageTemp}&deg;C</span>

          </div>
          <div className="sun__down">
            <span >{date}&ensp;&ensp;</span>
            <span>{`${formData.region[0]},${formData.district}`}</span>
          </div>

        </div>
        <div className="lilcontainer outTemp ">
          <span className='lilcontainer__bigText'>出門:<br />{goOutTemp}&deg;C</span>
        </div>
        <div className="lilcontainer backTemp">
          <span className='lilcontainer__bigText'>回家: <br />{goHomeTemp}&deg;C</span>
        </div>
        <div className="lilcontainer avgTemp">
          <span className='lilcontainer__smallText'>在外時平均溫度: {averageTemp}&deg;C</span>
        </div>
        <div className="lilcontainer avgTempDiff">
          <span className='lilcontainer__smallText'>在外時最大溫差: {tempDiff}&deg;C</span>
        </div>
        <div className="lilcontainer pop">
          <span className='lilcontainer__smallText'>在外時降雨率: {averagePop}%</span>
        </div>

      </div>
      <div className="result__right">
        {/* <img src="https://blush.design/api/download?shareUri=dadIlchTR6kL_o3p&c=Hair_0%7Eff7475_Skin_0%7Effcba7_Top_0%7Eff7475&w=800&h=800&fm=png" alt="Grapefruit slice atop a pile of other slices" width="220" height="450" />
        <img className='result__right__img' src={standingMan2} alt="Grapefruit slice atop a pile of other slices" width="220" height="450" />
        <div className="description">
          <h3>衣著建議</h3> */}
        {suggestion()}
        {/* </div> */}
        <button className='backBtn' onClick={() => { navigate('/home') }}>&larr;&nbsp;返回</button>
      </div>
    </div>
  )
}

{/* <Player
              className='resultAnimation'
              autoplay
              // speed={3}
              loop
              // src="https://assets2.lottiefiles.com/packages/lf20_64okjrr7.json"//sun
              // src="https://assets9.lottiefiles.com/packages/lf20_bn1ldors.json"//2nd rain
              // src="https://assets1.lottiefiles.com/packages/lf20_bco9p3ju.json"//rain
              // src="https://assets6.lottiefiles.com/packages/lf20_SD9JLdoyv2.json" //1st rain
              // src="https://assets10.lottiefiles.com/temp/lf20_VAmWRg.json" //1st cloudy
              // src="https://assets5.lottiefiles.com/packages/lf20_KUFdS6.json" //2nd
              style={{ height: '100px', width: '100px' }}
            /> */}

{/* <span>出門: {goOutTemp}&deg;C</span>
      <br></br>
      <span>回家: {goHomeTemp}&deg;C</span>
      <br></br>
      <span>在外時平均溫度: {averageTemp}&deg;C</span>
      <br></br>
      <span>在外時最大溫差: {tempDiff}&deg;C</span>
      <br></br>
      <span>在外時降雨率: {averagePop}%</span> */}


          // <div className="result__right__imgdiv">
          //   <img className='result__right__img' src={womanPufferJacket} alt="womanJacket" />
          //   <img className='result__right__img' style={{ marginLeft: '-5px' }} src={manPufferJacket} alt="manPufferJacket" />
          // </div>
          // <div className="description">
          //   <h3>衣著建議</h3>
          //   {/* <h2>{window.innerHeight * 0.01}</h2> */}
          //   <>
          //     {renderClothingSuggestion(hoodie, '大學t', '大學t或帽t')}
          //     {renderClothingSuggestion(insideshirt, '發熱衣', '加上一件發熱衣保暖')}
          //     {renderClothingSuggestion(longpants, '長褲', '長褲')}
          //     {renderClothingSuggestion(pufferjacket, '厚外套', '厚外套')}
          //     {motoOrNot()}
          //     {needRaincoat()}
          //   </>
          // </div>