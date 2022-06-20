import React,{useContext} from 'react'
import './Result.scss'
import {WeatherContext} from  '../../Contexts/WeatherContext'

import CalculateOutnBackTemp from '../../Helper/CalculateOutnBackTemp'
export default function Result() {
  const {weatherTemp,pop,formData} = useContext(WeatherContext)
  return (
    <div className="result">
      <CalculateOutnBackTemp />
      {weatherTemp && weatherTemp['Nextday00']}
      {pop && pop['Nextday00']}
      {console.log('formdata',formData)}
    </div>
  )
}
