import axios from "axios"
export const getWeather =() => {
   const data = axios.get('https://api.openweathermap.org/data/2.5/forecast?lat=25.05549774&lon=121.4162785&appid=a79b0a9c2c6898fe5fc6189047bd9a9e').then((res)=>{
    console.log(res.data)
   })
    
}