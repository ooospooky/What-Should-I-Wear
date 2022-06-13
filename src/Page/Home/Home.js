import React, { useState,useContext } from 'react'
import './Home.scss';
import CitySelect from '../../Components/CitySelect'
import { city, districts } from '../../Assets/rawData'
import { TimeOption } from '../../Components/TimeOption'
import moment from 'moment';
import {WeatherContext} from '../../Contexts/WeatherContext'
////////
// dealing weather api, clac the math and check openData's start time depends on what
////
import {GetWeather} from '../../Helper/GetWeather'

function Home() {
  const {weatherTemp,setWeatherTemp} = useContext(WeatherContext)
  
  const [date, setDate] = useState('today')
  const [goOutTime, setGoOutTime] = useState('09:00');
  const [goHomeTime, setGoHomeTime] = useState('18:00');
  const [traffic, setTraffic] = useState('moto');
  const [region, setRegion] = useState('基隆市')
  const [district, setDistrict] = useState(districts[region][0][0])
  // const [datas,setDatas] = useState()
  console.log('ww',weatherTemp)
  const handleSubmit = (event) => {
    event.preventDefault();

    console.log(date)
    console.log(goOutTime, goHomeTime)
    console.log(traffic)
    console.log(region)
    console.log(district)
    // GetWeather(setDatas)
    GetWeather({setWeatherTemp})
    console.log('w',weatherTemp)
    
    // console.log('d',data)
  }
  const onChangeValue = (event) => {
    setTraffic(event.target.value);
  }
  const changeArea = (e) => {
    setRegion(e.target.value);
    setDistrict(districts[e.target.value][0][0]);
  }
  // console.log('Today', moment().format("MMM Do"));
  // console.log('Tomorrow', moment().add(1, 'days').format("MMM Do"))

  return (
    <div className="Home">

      <form onSubmit={handleSubmit} className="Home__form">
        <div className="date">
        <input type="radio"  id="today"  onChange={()=>setDate('today')} checked={date === "today"} ></input>
          <label htmlFor="today" className="date__btn">
          <span>{moment().format("MMM Do")}</span>
            <span>今天</span>
          </label>
          <input type="radio"  id="tomorrow"  onChange={()=>setDate('tomorrow')} checked={date === "tomorrow"} ></input>
          <label htmlFor="tomorrow" className="date__btn">
          <span>{moment().add(1, 'days').format("MMM Do")}</span>
            <span>明天</span>
          </label>
          <input type="radio"  id="afterTomorrow"  onChange={()=>setDate('afterTomorrow')} checked={date === "afterTomorrow"} ></input>
          <label htmlFor="afterTomorrow" className="date__btn">
          <span>{moment().add(2, 'days').format("MMM Do")}</span>
            <span>後天</span>
          </label>

        </div>
        {/* 出門&回家 */}
        <div className="setTime">
          <label htmlFor="go-out-time" className="setTime__outLabel"><h3>出門時間</h3></label>
          <label htmlFor="go-home-time" className="setTime__backLabel"><h3>回家時間</h3></label>
          <TimeOption onChange={(e) => { setGoOutTime(e.target.value) }} defaultTime={goOutTime} />
          <TimeOption onChange={(e) => { setGoHomeTime(e.target.value) }} defaultTime={goHomeTime} />
          {/* <input type="text" id="go-out-time" className="setTime__outInput" onChange={(e) => { setGoOutTime(e.target.value) }} ></input> */}
          {/* <input type="text" id="go-home-time" className="setTime__backInput" onChange={(e) => { setGoHomeTime(e.target.value) }}></input> */}
        </div>
        {/*  */}
        {/*  交通工具 */}
        <h3>交通工具</h3>
        <div className="traffic">
          {/* walk */}
          <input type="radio" id="walk" value="walk" className="traffic__walkinput" onChange={onChangeValue} checked={traffic === "walk"}></input>
          <label htmlFor="walk" className="traffic__walklabel">
            <ion-icon name="walk" className="traffic__walklabel--icon"></ion-icon>
          </label>
          {/* bike */}
          <input type="radio" id="moto" value="moto" onChange={onChangeValue} checked={traffic === "moto"} ></input>
          <label htmlFor="moto">
            <ion-icon name="bicycle"></ion-icon>
          </label>
          {/* car */}
          <input type="radio" id="car" value="car" onChange={onChangeValue} checked={traffic === "car"} ></input>
          <label htmlFor="car">
            <ion-icon name="car-sport"></ion-icon>
          </label>
          {/* car */}
          <input type="radio" id="bus" value="bus" onChange={onChangeValue} checked={traffic === "bus"} ></input>
          <label htmlFor="bus">
            <ion-icon name="bus"></ion-icon>
          </label>
        </div>
        {/*  */}
        <h3>地區</h3>

        <div className="area">
          <select className="area__input" default={region} value={region} onChange={(e) => changeArea(e)}>
            {city.map((data) => {
              return (
                <option value={data}>{data}</option>
              )
            })}
          </select>
          {/* {console.log(districts[region],'teset',region)} */}
          <select className="area__input" default={district} value={district} onChange={(e) => setDistrict(e.target.value)}>
            {districts[region].map((data, num) => {
              return (
                <option value={data[0]}>{data[0]}</option>
              )
            })}
          </select>
        </div>

        {/* <input type="submit" value="What Should I Wear?" /> */}
        <div className="subbmit">
          <button className="subbmit__btn" onClick={handleSubmit}> What Should I Wear? </button>
        </div>
      </form>
    </div>
  )
}

export default Home