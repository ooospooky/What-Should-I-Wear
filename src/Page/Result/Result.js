import React, { useContext } from 'react'
import './Result.scss'
import { WeatherContext } from '../../Contexts/WeatherContext'

import CalculateOutnBackTemp from '../../Helper/CalculateOutnBackTemp'
import CalculateAvgTemp from '../../Helper/CalculateAvgTemp'
import CalculatePop from '../../Helper/CalculatePop'
import moment from 'moment'; //https://momentjs.com/
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import { Link, useNavigate } from 'react-router-dom'
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
export default function Result() {
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

  

  const suggestion = () => {
    const motoOrNot = () => {
      if (formData.traffic === 'moto') {
        if(averageTemp < 12 ) return (
          <div>
          <img src={gloves} alt="手套" />
          <span>騎車時可以戴上手套保暖</span>
        </div>
        )
        return (
          <div>
            <img src={thinJacket} alt="薄外套" />
            <span>建議在騎車時穿上薄外套擋風</span>
          </div>
        );
      }
      return null; //若有不符合條件的情況，會return undefined，並render null，可能有潛在問題，加上return null確保明確的return null
    };
  
    const needRaincoat = () => {
      if (averagePop > 10) {
        return (
          <div>
            <img src={raincoat} alt="雨衣" />
            <span>降雨機率為{averagePop}％建議帶上雨衣或雨傘</span>
          </div>
        );
      }
      return null; //若有不符合條件的情況，會return undefined，並render null，可能有潛在問題，加上return null確保明確的return null
    };
  
    if (averageTemp >= 25) {
      return (
        <>
          <div>
            <img src={shirt} alt="短袖" />
            <span>短袖</span>
          </div>
          <div>
            <img src={shortpants} alt="短褲" />
            <span>短褲</span>
          </div>
          {needRaincoat()}
        </>
      );
    }
  
    if (averageTemp < 25 && averageTemp >= 22) {
      return (
        <>
          <div>
            <img src={shirt} alt="短袖" />
            <span>短袖</span>
          </div>
          <div>
            <img src={longpants} alt="長褲" />
            <span>長褲優先，不怕冷的話短褲也不錯</span>
          </div>
          {needRaincoat()}
          {motoOrNot()}
        </>
      );
    }
  
    if (averageTemp < 22 && averageTemp >= 20) {
      return (
        <>
          <div>
            <img src={longshirt} alt="薄長袖" />
            <span>薄長袖</span>
          </div>
          <div>
            <img src={longpants} alt="長褲" />
            <span>長褲</span>
          </div>
          {needRaincoat()}
          {motoOrNot()}
        </>
      );
    }
  
    if (averageTemp < 20 && averageTemp >= 16) {
      return (
        <>
          <div>
            <img src={hoodie} alt="大學t或帽t" />
            <span>大學T或帽T</span>
          </div>
          <div>
            <img src={longpants} alt="長褲" />
            <span>長褲</span>
          </div>
          {needRaincoat()}
          {motoOrNot()}
        </>
      );
    }
  
    if (averageTemp < 16 && averageTemp >= 12) {
      return (
        <>
          <div>
            <img src={hoodie} alt="大學t或帽t" />
            <span>大學T或帽T</span>
          </div>
          <div>
            <img src={insideshirt} alt="發熱衣" />
            <span>加上一件發熱衣保暖</span>
          </div>
          <div>
            <img src={longpants} alt="長褲" />
            <span>長褲</span>
          </div>
          {needRaincoat()}
          {motoOrNot()}
        </>
      );
    }
  
    if (averageTemp < 12) {
      return (
        <>
          <div>
            <img src={hoodie} alt="大學t或帽t" />
            <span>大學T或帽T</span>
          </div>
          <div>
            <img src={insideshirt} alt="發熱衣" />
            <span>加上一件發熱衣保暖</span>
          </div>
          <div>
            <img src={longpants} alt="長褲" />
            <span>長褲</span>
          </div>
          <div>
            <img src={pufferjacket} alt="厚外套" />
            <span>厚外套</span>
          </div>
          {/* <div><img src={beanie}></img><span>也可以考慮帶上毛帽不讓頭著涼</span></div> */}
          {motoOrNot()}
          {needRaincoat()}
        </>
      );
    }
  };
  let weatherUrl;
  //降雨率小於10將url設為sun, 大於10小於40設為cloud, 大於40設為raining
  if (averagePop <= 10) weatherUrl = 'https://assets2.lottiefiles.com/packages/lf20_64okjrr7.json'
  if (averagePop > 10 && averagePop <= 40) weatherUrl = "https://assets10.lottiefiles.com/temp/lf20_VAmWRg.json"
  if (averagePop > 40) weatherUrl = "https://assets6.lottiefiles.com/packages/lf20_SD9JLdoyv2.json"
  ////////////////
  const weatherAnimation = <Player
    className='resultAnimation'
    autoplay
    // speed={3}
    loop
    src={weatherUrl}
    style={{ height: '100px', width: '100px' }}
  />
  return (
    <div className="result">

      <div className="result__left">
        <div className="sun">
          <div className="sun__up">
            {weatherAnimation}

            <span className='sun__up__temp'>{averageTemp}&deg;C</span>

          </div>
          <div className="sun__down">
            <span >{date}&ensp;&ensp;</span>
            <span>桃園市,中壢區</span>
          </div>

        </div>
        <div className="lilcontainer outTemp">
          <span>出門:<br />{goOutTemp}&deg;C</span>
        </div>
        <div className="lilcontainer ackTemp">
          <span>回家: <br />{goHomeTemp}&deg;C</span>
        </div>
        <div className="lilcontainer avgTemp">
          <span>在外時平均溫度: {averageTemp}&deg;C</span>
        </div>
        <div className="lilcontainer avgTempDiff">
          <span>在外時最大溫差: {tempDiff}&deg;C</span>
        </div>
        <div className="lilcontainer pop">
          <span>在外時降雨率: {averagePop}%</span>
        </div>

      </div>
      <div className="result__right">

        <img src="https://blush.design/api/download?shareUri=TB2kPDYjP1wD2zwz&c=Hair_0%7E030067_Skin_0%7Ee7915c_Top_0%7Eff7475&w=800&h=800&fm=png" alt="Grapefruit slice atop a pile of other slices" width="220" height="450" />
        <img src="https://blush.design/api/download?shareUri=Tb5zkiYr7&c=Hair_0%7E030067_Skin_0%7Ee7915c_Top_0%7Effa200&w=800&h=800&fm=png" alt="Grapefruit slice atop a pile of other slices" width="220" height="450" />
        {/* <button onClick={() => { navigate('/home') }}>back</button> */}
        <div className="description">
          <h3>衣著建議</h3>
          {suggestion()}

          {/* <img src={beanie}></img>
          <img src={shirt}></img>
          <img  src={jacket} ></img> */}
          {/* style={{ width: '30px', height: '30px' }} */}
        </div>
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
