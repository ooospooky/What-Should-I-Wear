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
         let allData = res.data['records']['locations'][0].location[0]['weatherElement']
         //溫度在[3] 天氣綜合描述(每三小時溫度)[6]
         let loopTime = res.data['records']['locations'][0].location[0]['weatherElement'][3].time.length;   //9
         let temp ={};
         let pop = {};
         for(let i = 0; i<loopTime; i++) {
            // temp[allData[3].time[i].dataTime.slice(11,13)] = allData[3].time[i].elementValue[0].value

            //因這幾種資料都是obj型態，如{15: "30",18: "28",21: "27",Nextday00: "26"}
            //不同種資料的key都是一樣的，因此拿allData[3]即溫度來做標準 
            //原dataTime是2022-06-18 12:00:00,使用slice去抓小時的時間--> 12
            let objKeyName = allData[3].time[i].dataTime.slice(11, 13)

            //找到溫度的資料，型態為Number
            let tempData = allData[3].time[i].elementValue[0].value

            //整段天氣描述: 短暫陣雨。降雨機率 30%。溫度攝氏27度。舒適。東南風 平均風速1-2級(每秒2公尺)。相對濕度94%。
            let weatherDescription = allData[6].time[i].elementValue[0].value;
            //這邊只需要降雨機率的％數，因此先找到“降”的index
            let popIndex = weatherDescription.search("降雨機率") 
            //使用slice(n,n+10)找到這個範圍裡的字串，如"降雨機率 30%。"
            //再使用正則找到字串中的數字，但這時是字串，因此再使用Number()去改變
            let percentageOfPop = Number(weatherDescription.slice(popIndex, popIndex + 10).replace(/[^0-9]/ig,""))
            if(i===loopTime-1){ 
               temp["Nextday00"] = tempData;
               pop["Nextday00"] = percentageOfPop;
            }else{
               temp[objKeyName] = tempData;
               pop[objKeyName] =  percentageOfPop;
            }
         }
         console.log('TheTemp',temp,"POP",pop)
         // let temp = res.data['records']['locations'][0].location[0]['weatherElement'][3].time;
         // console.log('temp', temp);
         // let data = {};
         // for (let i of temp) {
         //    // 時間：溫度
         //    // data[i.dataTime.slice(11,13)] = i.elementValue[0].value
         //    // if (!!data['00'] && i.dataTime.slice(11, 13) === '00') {
         //       if(i===temp[temp.length-1]){  //在範圍為一天時，temp的最後一個為隔天的00:00
         //       data["Nextday00"] = i.elementValue[0].value;
         //       console.log('runnnn')
         //    }else{
         //       data[i.dataTime.slice(11, 13)] = i.elementValue[0].value;
         //    }
         //    // console.log('dataTime',i.dataTime.slice(11, 13))
         // }
         //data now fill in like this {12: '28', 15: '30', 18: '27', 21: '26'}
         // console.log(data)


         // props(data)
         // setWeatherTemp(data)

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

