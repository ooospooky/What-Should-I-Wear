import React,{useContext} from 'react'
import './Result.scss'
import {WeatherContext} from  '../../Contexts/WeatherContext'

import CalculateOutnBackTemp from '../../Helper/CalculateOutnBackTemp'
import CalculateAvgTemp from '../../Helper/CalculateAvgTemp'
import CalculatePop from '../../Helper/CalculatePop'
export default function Result() {
  const {weatherTemp,pop,formData} = useContext(WeatherContext)
  // if(!weatherTemp) return (<div>123</div>)
  let goOutTemp = CalculateOutnBackTemp("goOutTime")
  let goHomeTemp = CalculateOutnBackTemp("goHomeTime")
  let {averageTemp,tempDiff} = CalculateAvgTemp();
  let averagePop = CalculatePop()
  console.log("goOutTemp",goOutTemp,"goHomeTemp",goHomeTemp)
  console.log('doff',tempDiff)
  return (
    <div className="result">
      <span>出門: {goOutTemp}&deg;C</span>
      <br></br>
      <span>回家: {goHomeTemp}&deg;C</span>
      <br></br>
      <span>在外時平均溫度: {averageTemp}&deg;C</span>
      <br></br>
      <span>在外時最大溫差: {tempDiff}&deg;C</span>
      <br></br>
      <span>在外時降雨率: {averagePop}%</span>
    </div>
  )
}
