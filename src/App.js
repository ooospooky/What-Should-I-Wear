import "./App.scss"
import { useState } from 'react'
import Home from "./Page/Home/Home";
import Result from "./Page/Result/Result";
import LandingPage from "./Page/LandingPage/LangingPage"
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { WeatherContext } from './Contexts/WeatherContext'
import logo from "./Assets/img/logo.png"

function App() {

  // const options = {
  //   // method: 'GET',
  //   // url: 'api.openweathermap.org/data/2.5/forecast?lat=25.0358303&lon=121.4367535&appid=a79b0a9c2c6898fe5fc6189047bd9a9e',
  // //   method: 'GET',
  // // url: 'https://community-open-weather-map.p.rapidapi.com/forecast',
  // // params: { lat: '25.0358303',lon: '121.4367535'},
  // // headers: {
  // //   'X-RapidAPI-Host': 'community-open-weather-map.p.rapidapi.com',
  // //   'X-RapidAPI-Key': 'ac56f0d3c6msh4b58a9d8fd21cb2p1f0c50jsnd12c1e922848'
  // //   }
  // };
  // const getWeather = async()=>{=
  //   // const weatherData = await axios.get("https://opendata.cwb.gov.tw/api/v1/rest/datastore/C-B0074-002?Authorization=CWB-25DEA212-F3AA-4FDB-B05C-30DEF7E737DC")
  //   // console.log(weatherData.data)
  //   // const data = await axios(options).then((res)=>console.log(res.data))
  //   //openWeather a79b0a9c2c6898fe5fc6189047bd9a9e
  //   // const data = await axios.get('https://api.openweathermap.org/data/2.5/forecast?lat=25.05549774&lon=121.4162785&appid=a79b0a9c2c6898fe5fc6189047bd9a9e')
  //   // console.log(data)
  //   console.log(123)
  // }
  //create global data for weatherContext
  //溫度 -> object
  const [weatherTemp, setWeatherTemp] = useState()
  //降雨機率 --> object
  const [pop, setPop] = useState()
  //Form資料整理 --> object
  const [formData, setFormData] = useState()
  //
  return (
    <div className="App" style={{position:"relative"}}>
     
      

      <WeatherContext.Provider value={{ weatherTemp, setWeatherTemp, pop, setPop, formData, setFormData }}>
      <Router>
      <div className="logoDiv"  >
      <Link to='/'><img className="logoDiv__img" src={logo}  /></Link>
      <span className="logoDiv__span">WHAT SHOULD I WEAR?</span>
      </div>
        <Routes>
          <Route path='/' element={<LandingPage/>}></Route>
          <Route path='/home' element={<Home/>}></Route>
          <Route path='/result' element={weatherTemp && < Result />}></Route>
          <Route path='*' element={<h1 style={{display:"flex",justifyContent: "center",alignContent:"center"}}>PAGE NOT FOUND</h1>}></Route>
        </Routes>
      </Router>
      </WeatherContext.Provider>
      {/* // <WeatherContext.Provider value={{ weatherTemp, setWeatherTemp, pop, setPop, formData, setFormData }}>
      //   < LandingPage />
      //   < Home />
      //   {weatherTemp && < Result />}
      // </WeatherContext.Provider> */}
    </div>
  );
}

export default App;
