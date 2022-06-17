import axios from "axios"
import { useState, useContext } from "react";
import { WeatherContext } from '../Contexts/WeatherContext'

export const GetWeather = ({ setWeatherTemp,dateRange,locationId,locationName}) => {
   
   // const data = axios.get('https://api.openweathermap.org/data/2.5/forecast?lat=25.05549774&lon=121.4162785&appid=a79b0a9c2c6898fe5fc6189047bd9a9e')
   // .then((res)=>{
   //  console.log(res.data)
   // })
   console.log(dateRange,'weather')
   console.log(locationId,'locationID')
   console.log(locationName,'locationName')
   //https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-069?Authorization=CWB-25DEA212-F3AA-4FDB-B05C-30DEF7E737DC&locationName=泰山區&timeFrom=2022-06-16T00:00:00&timeTo=2022-06-17T00:00:01
   // const data = axios.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-069?Authorization=CWB-25DEA212-F3AA-4FDB-B05C-30DEF7E737DC&locationName=泰山區&timeFrom=2022-06-16T00:00:00&timeTo=2022-06-17T00:00:01`)
   // const data = axios.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-069?Authorization=CWB-25DEA212-F3AA-4FDB-B05C-30DEF7E737DC&locationName=泰山區${dateRange}`)
   //add loction Id & location Name
   const data = axios.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/${locationId}?Authorization=CWB-25DEA212-F3AA-4FDB-B05C-30DEF7E737DC&locationName=${locationName}${dateRange}`)
      .then((res) => {
         //temp = 溫度（array）
         console.log('All dagta',res.data)
         let temp = res.data['records']['locations'][0].location[0]['weatherElement'][3].time;
         console.log('temp', temp);
         let data = {};
         for (let i of temp) {
            // 時間：溫度
            // data[i.dataTime.slice(11,13)] = i.elementValue[0].value
            // if (!!data['00'] && i.dataTime.slice(11, 13) === '00') {
               if(i===temp[temp.length-1]){  //在範圍為一天時，temp的最後一個為隔天的00:00
               data["Nextday00"] = i.elementValue[0].value;
               console.log('runnnn')
            }else{
               data[i.dataTime.slice(11, 13)] = i.elementValue[0].value;
            }
            // console.log('dataTime',i.dataTime.slice(11, 13))
         }
         //data now fill in like this {12: '28', 15: '30', 18: '27', 21: '26'}
         console.log(data)


         // props(data)
         setWeatherTemp(data)

         // setDatas(data)
         // console.log('datas',datas) 

         //  console.log(res.data['records']['locations'][0].location[0]['weatherElement'])
      })
   //weatherEelement
   //res.data['records']['locations'][0].location[0]['weatherElement']
   //設置一天的範圍
   //timeFrom=2022-06-10T00:00:00&timeTo=2022-06-11T00:00:01 
}
// check openData's start time depends on what
//6/9 16:48 result is start from 6/9 12:00

