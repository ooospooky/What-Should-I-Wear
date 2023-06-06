import axios from "axios"

export const GetWeather = ({ setWeatherTemp,setPop,dateRange,locationId,locationName}) => {
   //https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-069?Authorization=CWB-25DEA212-F3AA-4FDB-B05C-30DEF7E737DC&locationName=泰山區&timeFrom=2022-06-16T00:00:00&timeTo=2022-06-17T00:00:01
   // const data = axios.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-069?Authorization=CWB-25DEA212-F3AA-4FDB-B05C-30DEF7E737DC&locationName=泰山區&timeFrom=2022-06-16T00:00:00&timeTo=2022-06-17T00:00:01`)
   // const data = axios.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-D0047-069?Authorization=CWB-25DEA212-F3AA-4FDB-B05C-30DEF7E737DC&locationName=泰山區${dateRange}`)
   //add loction Id & location Name
   //   //設置一天的範圍dataRange =  &timeFrom=2022-06-17T00:00:00&timeTo=2022-06-18T00:00:01
   const data = axios.get(`https://opendata.cwb.gov.tw/api/v1/rest/datastore/${locationId}?Authorization=CWB-25DEA212-F3AA-4FDB-B05C-30DEF7E737DC&locationName=${locationName}${dateRange}`)
      .then((res) => {
         // console.log('All result',res.data)

         //allData 為Array，包含溫度、降雨率、舒適度等等 ////溫度在[3] 天氣綜合描述在(每三小時溫度)[6]
         let allData = res.data['records']['locations'][0].location[0]['weatherElement']
         
         //計算有幾個斷點(一個斷點為三小時)
         let loopTime = res.data['records']['locations'][0].location[0]['weatherElement'][3].time.length;   
         
         let temp ={};
         let pop = {};
         for(let i = 0; i<loopTime; i++) {

            //因這幾種資料都是obj型態，如{15: "30",18: "28",21: "27",Nextday00: "26"}
            //不同種資料的key都是一樣的，因此拿allData[3]即溫度來做標準 
            //原dataTime是2022-06-18 12:00:00,使用slice去抓小時的時間--> 12
            let objKeyName = allData[3].time[i].dataTime.slice(11, 13)

            //找到溫度的資料，型態為Number
            let tempData = Number(allData[3].time[i].elementValue[0].value)

            //整段天氣描述: 短暫陣雨。降雨機率 30%。溫度攝氏27度。舒適。東南風 平均風速1-2級(每秒2公尺)。相對濕度94%。
            let weatherDescription = allData[6].time[i].elementValue[0].value;
            //這邊只需要降雨機率的％數，因此先找到“降”的index
            let popIndex = weatherDescription.search("降雨機率") 
            //使用slice(n,n+10)找到這個範圍裡的字串，如"降雨機率 30%。"
            //再使用正則找到字串中的數字，但這時是字串，因此再使用Number()去改變 --> persentgeOfPop = 30
            let percentageOfPop = Number(weatherDescription.slice(popIndex, popIndex + 10).replace(/[^0-9]/ig,""))
            //最後一個為隔天的清晨12點，為避免與當天凌晨12點衝突，使用NextDay00來做keyNmae
            if(i===loopTime-1){ 
               temp["Nextday00"] = tempData;
               pop["Nextday00"] = percentageOfPop;
            }else{
               //其餘都用正常objKeyName-->00,03,06,09,12,15......
               temp[objKeyName] = tempData;
               pop[objKeyName] =  percentageOfPop;
            }
         }
         //將資料傳到global state（in App.js)
         setWeatherTemp(temp)
         setPop(pop)
         // console.log('TheTemp',temp,"POP",pop)
      })
}

