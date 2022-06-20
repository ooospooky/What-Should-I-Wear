import React, { useContext } from 'react'
import { WeatherContext } from '../Contexts/WeatherContext'
export default function CalculateAvgTemp() {
  const { weatherTemp, pop, formData } = useContext(WeatherContext)
  let firstPointer
  let goOutTime = formData.goOutTime.slice(0, 2)
  let goHomeTime = Number(formData.goHomeTime.slice(0, 2))
  if (goOutTime % 3 === 1) {
    goOutTime -= 1;
    if (goOutTime < 10) goOutTime = `0${goOutTime}`
  }
  if (goOutTime % 3 === 2) {
    goOutTime -= 2;
    if (goOutTime < 10) goOutTime = `0${goOutTime}`
  }
  // if(goOutTime % 3 === 0 && goOutTime < 10) goOutTime = `0${goOutTime}`
  console.log('ouTTTT', goOutTime)

  if (goHomeTime % 3 === 1) {
    goHomeTime += 2;
    if (goHomeTime < 10) goHomeTime = `0${goHomeTime}`
  }
  if (goHomeTime % 3 === 2) {
    goHomeTime += 1;
    if (goHomeTime < 10) goHomeTime = `0${goHomeTime}`
  }
  // if(goHomeTime % 3 === 0 && goHomeTime < 10) goHomeTime = `0${goHomeTime}`
  console.log(goHomeTime,'hooo')
  let max = 0;
  let min = 100;
  let avgTemp = 0;
  let counter = 0;
  for(let i in weatherTemp ){
    
    if(goOutTime<= i && i <= goHomeTime){
      avgTemp += weatherTemp[i] ;
      ( weatherTemp[i] >= max)? max = Math.max(max, weatherTemp[i]) : min = Math.min(min,weatherTemp[i])
      counter++;
    }
    if(i==="Nextday00" && goHomeTime===24){
      avgTemp +=weatherTemp["Nextday00"];
      ( weatherTemp["Nextday00"] >= max)? max = Math.max(max, weatherTemp["Nextday00"]) : min = Math.min(min,weatherTemp["Nextday00"])
      counter++;
    }
    
  }
  console.log("avgTemp",{avgTemp:Math.round(avgTemp/counter),max})
  return {averageTemp:Math.round(avgTemp/counter),tempDiff:max-min}
}
