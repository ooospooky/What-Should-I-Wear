import React, { useContext } from 'react'
import { WeatherContext } from '../Contexts/WeatherContext'
export default function CalculatePop() {
  const { weatherTemp, pop, formData } = useContext(WeatherContext);

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
  let avgPop = 0;
  let counter = 0;
    for(let i in pop ){
    
    if(goOutTime<= i && i <= goHomeTime){
      avgPop += pop[i] ;
      counter++;
    }
    if(i==="Nextday00" && goHomeTime===24){
      avgPop +=pop["Nextday00"];
      counter++;
    }
  }
  return Math.round(avgPop/counter)
}
