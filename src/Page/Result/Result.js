import React,{useContext} from 'react'
import './Result.scss'
import {WeatherContext} from  '../../Contexts/WeatherContext'
export default function Result() {
  const {weatherTemp} = useContext(WeatherContext)
  return (
    <div className="result">
      {weatherTemp && weatherTemp['00']}

    </div>
  )
}
