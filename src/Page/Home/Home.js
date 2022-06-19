import React, { useState,useContext, useRef} from 'react'
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
  // console.log(moment().get('year'),moment().get('month'),moment().get('date'),'DATTTTT')
  const selectOption = useRef({value:"09:00"});
  console.log(city[0],'city')
  console.log(districts[city[0][0]][0],'dis')
  console.log('ref',selectOption.current.style)
  const {weatherTemp,setWeatherTemp,pop,setPop} = useContext(WeatherContext)

  const [date, setDate] = useState('today')
  const [goOutTime, setGoOutTime] = useState("09:00");
  const [goHomeTime, setGoHomeTime] = useState('18:00');
  const [traffic, setTraffic] = useState('moto');
  const [region, setRegion] = useState(city[0])  //['宜蘭縣', 'F-D0047-001']
  const [district, setDistrict] = useState(districts[region[0]][0])    // '宜蘭市'
  const [validateMsg,setValidateMsg] = useState('')
  let selectStyle="";
  let initGoOutTime="09:00";
let msg=""
  if(goOutTime > goHomeTime){
    setGoHomeTime(Number(goOutTime.slice(0,2) ) +1 + ":00")
  }
  if (goOutTime < moment().hour() + ":00" && date==='today') {
    // selectStyle='1px solid red'
    // console.log("selectStyle={border: '1px solid red'}")
    // selectOption.current.style.border=selectStyle;
    // setGoOutTime(moment().hour()+":00")
      msg="出門時間要大於目前時間"
  } 


  // const [datas,setDatas] = useState()
  console.log('ww',weatherTemp)
  const handleSubmit = (event) => {
    event.preventDefault();
    let dateRange;
    //dateRange be like this, &timeFrom=2022-06-17T00:00:00&timeTo=2022-06-18T00:00:01
    if(date==="today") dateRange=`&timeFrom=${moment().format().slice(0,11)}00:00:00&timeTo=${moment().add(1, 'days').format().slice(0,11)}00:00:01`;
    if(date==="tomorrow") dateRange=`&timeFrom=${moment().add(1, 'days').format().slice(0,11)}00:00:00&timeTo=${moment().add(2, 'days').format().slice(0,11)}00:00:01`;
    if(date==="afterTomorrow") dateRange=`&timeFrom=${moment().add(2, 'days').format().slice(0,11)}00:00:00&timeTo=${moment().add(3, 'days').format().slice(0,11)}00:00:01`;
    console.log('dateRange',dateRange);
    console.log(date)
    console.log(goOutTime, goHomeTime)
    console.log(traffic)
    console.log(region) 
    console.log(district)
    // GetWeather(setDatas)
    GetWeather({setWeatherTemp, setPop, dateRange,locationId:region[1],locationName:district})
    console.log('w',weatherTemp)
    
    //天氣描述："短暫陣雨。降雨機率 70%。溫度攝氏27度。舒適。西南風 平均風速4-5級(每秒9公尺)。相對濕度84%。"
    //不確定當降雨機率是100%時呈現是 "降雨機率 100%" 還是 "降雨機率100%"
    
    // console.log('d',data)
  }
  const onChangeValue = (event) => {
    setTraffic(event.target.value);
  }
  const changeArea = (e) => { 
    //e.target.value  = '基隆市,F-D0047-049';
    //use .split(',') --> ['基隆市', 'F-D0047-049']
    // console.log(typeof(e.target.value));
    // console.log(e.target.value.split(','));
    setRegion(e.target.value.split(','));
    setDistrict(districts[e.target.value.split(',')[0]][0]);
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
          <TimeOption  selectRef={selectOption} onChange={(e) => { setGoOutTime(e.target.value) }}   date={date} defaultTime={goOutTime} />
          <TimeOption onChange={(e) => { setGoHomeTime(e.target.value) }}   date={date} defaultTime={goHomeTime}  />
          {/* <input type="text" id="go-out-time" className="setTime__outInput" onChange={(e) => { setGoOutTime(e.target.value) }} ></input> */}
          {/* <input type="text" id="go-home-time" className="setTime__backInput" onChange={(e) => { setGoHomeTime(e.target.value) }}></input> */}

          {/* Validate Massage */}
          <span className="setTime__validateText">{msg}</span>
          {/* <span>{msg}</span> */}
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
          <select className="area__input"   onChange={(e) => changeArea(e)}>
            {city.map((data) => {
              return (
                <option value={data}>{data[0]}</option>
              )
            })}
          </select>
          {/* {console.log(districts[region],'teset',region)} */}
          <select className="area__input"  value={district} onChange={(e) => setDistrict(e.target.value)}>
            {districts[region[0]].map((data, num) => {
              return (
                <option value={data}>{data}</option>
              )
            })}
          </select>
        </div>

        {/* <input type="submit" value="What Should I Wear?" /> */}
        <div className="subbmit">
          <button disabled={msg && true}  className="subbmit__btn" onClick={handleSubmit}> What Should I Wear? </button>
        </div>
      </form>
    </div>
  )
}

export default Home