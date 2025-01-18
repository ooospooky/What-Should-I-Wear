import React,{useContext} from 'react'
import {WeatherContext} from  '../Contexts/WeatherContext'
export default function CalculateOutnBackTemp(opt) {
  const {weatherTemp,pop,formData} = useContext(WeatherContext)
  if(!weatherTemp) return <h3>Loading...</h3>
  let outTime  = Number(formData[opt].slice(0,2));
  let up;
  let down;

  if ( outTime % 3 ===1){    // 01,04,07,10,13,16,19,22
    (outTime -1 < 10)? down =`0${outTime -1}`: down = outTime - 1;
    (outTime +2 < 10)?up = `0${outTime + 2}` : up = outTime + 2
    if(outTime+2 ===24 ) up = "Nextday00"
    // console.log('wwwwww',down,up,outTime,weatherTemp[down],weatherTemp[up])
    // console.log(Math.round( (weatherTemp[down]*2 + weatherTemp[up] )  / 3 ) )
    return Math.round( (weatherTemp[down]*2 + weatherTemp[up] )  / 3 ) 
  }
  if( outTime % 3 === 2){ //02,05,08,11,14,17,20,23
    (outTime -2 < 10)? down =`0${outTime -2}`: down = outTime  -2;
    (outTime +1 < 10)?up = `0${outTime + 1}` : up = outTime + 1
    if(outTime+1 ===24 ) up = "Nextday00"
    // console.log('qqqqqqqq',down,up,outTime,weatherTemp[down],weatherTemp[up])
    // console.log(Math.round( (weatherTemp[down] + weatherTemp[up]*2 )  / 3 ) )
    return Math.round( (weatherTemp[down] + weatherTemp[up]*2 )  / 3 )
  }
  if(outTime %3 ===0){
    if(outTime<10)outTime=`0${outTime}`
    return weatherTemp[outTime];
  }
}

