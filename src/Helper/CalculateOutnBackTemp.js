import React,{useContext} from 'react'
import {WeatherContext} from  '../Contexts/WeatherContext'
export default function CalculateOutnBackTemp() {
  const {weatherTemp,pop,formData} = useContext(WeatherContext)
  
  console.log(formData.goHomeTime)  
  
}
