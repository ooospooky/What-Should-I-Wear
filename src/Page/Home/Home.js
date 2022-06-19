import React, { useState, useContext } from 'react'
import './Home.scss';
import { city, districts } from '../../Assets/rawData'
import { TimeOption } from '../../Components/TimeOption'
import moment from 'moment'; //https://momentjs.com/
import { WeatherContext } from '../../Contexts/WeatherContext'
import { GetWeather } from '../../Helper/GetWeather'

function Home() {
  //import context variable from App.js
  const { weatherTemp, setWeatherTemp, pop, setPop } = useContext(WeatherContext)

  const [date, setDate] = useState('today')
  const [goOutTime, setGoOutTime] = useState("09:00");
  const [goHomeTime, setGoHomeTime] = useState('18:00');
  const [traffic, setTraffic] = useState('moto');
  const [region, setRegion] = useState(city[0])  //['宜蘭縣', 'F-D0047-001']
  const [district, setDistrict] = useState(districts[region[0]][0])    // '宜蘭市'

  let msg = ""
  //若出門時間大於回家時間，將回家時間調整至出門時間加一小時
  if (goOutTime > goHomeTime) {
    setGoHomeTime(Number(goOutTime.slice(0, 2)) + 1 + ":00")
  }
  //Out & back time validate: 若日期選擇當天，且出門時間大於目前時間，設定error message 
  if (goOutTime < moment().hour() + ":00" && date === 'today') {
    msg = "出門時間要大於目前時間"
  }

  const handleSubmit = (event) => {
    //   防止頁面跳轉
    event.preventDefault();

    //dateRange be like this, &timeFrom=2022-06-17T00:00:00&timeTo=2022-06-18T00:00:01
    //依照user選擇的日期去做一天的範圍
    let dateRange;
    if (date === "today") dateRange = `&timeFrom=${moment().format().slice(0, 11)}00:00:00&timeTo=${moment().add(1, 'days').format().slice(0, 11)}00:00:01`;
    if (date === "tomorrow") dateRange = `&timeFrom=${moment().add(1, 'days').format().slice(0, 11)}00:00:00&timeTo=${moment().add(2, 'days').format().slice(0, 11)}00:00:01`;
    if (date === "afterTomorrow") dateRange = `&timeFrom=${moment().add(2, 'days').format().slice(0, 11)}00:00:00&timeTo=${moment().add(3, 'days').format().slice(0, 11)}00:00:01`;
    console.log('dateRange', dateRange);
    console.log(date)
    console.log(goOutTime, goHomeTime)
    console.log(traffic)
    console.log(region)
    console.log(district)
    //呼叫getweather API call，傳入context variable & API 參數
    GetWeather({ setWeatherTemp, setPop, dateRange, locationId: region[1], locationName: district })
  }

  const changeArea = (e) => {
    //原資料型態為String:e.target.value = '基隆市,F-D0047-049';
    //用 .split(',')將資料轉為Array --> ['基隆市', 'F-D0047-049']
    setRegion(e.target.value.split(',')); //-->['基隆市', 'F-D0047-049']
    //在縣市變更時也要同時變更市區資料，將市區資料設為districts中對應之縣市的第一個市區資料
    //e.g'桃園市': [    '中壢區','平鎮區','龍潭區','楊梅區','新屋區', '觀音區'.. ]
    //在user選擇桃園市時將district改為 districts[桃園市]的第一個資料
    setDistrict(districts[e.target.value.split(',')[0]][0]); //-->'中壢區'
  }
  return (
    <div className="Home">
      <form onSubmit={handleSubmit} className="Home__form">

        {/* 日期選擇 */}
        <div className="date">
          <input type="radio" id="today" onChange={() => setDate('today')} checked={date === "today"} ></input>
          <label htmlFor="today" className="date__btn">
            {/* moment().format("MMM Do") 顯示當天月份與日期 -->e.g. Jun 19th */}
            <span>{moment().format("MMM Do")}</span>
            <span>今天</span>
          </label>
          <input type="radio" id="tomorrow" onChange={() => setDate('tomorrow')} checked={date === "tomorrow"} ></input>
          <label htmlFor="tomorrow" className="date__btn">
            {/* moment().add(1, 'days').format("MMM Do") 顯示當天+1天的月份與日期 -->e.g. Jun 20th */}
            <span>{moment().add(1, 'days').format("MMM Do")}</span>
            <span>明天</span>
          </label>
          <input type="radio" id="afterTomorrow" onChange={() => setDate('afterTomorrow')} checked={date === "afterTomorrow"} ></input>
          <label htmlFor="afterTomorrow" className="date__btn">
            {/* moment().add(2, 'days').format("MMM Do") 顯示當天+2天的月份與日期 -->e.g. Jun 21th */}
            <span>{moment().add(2, 'days').format("MMM Do")}</span>
            <span>後天</span>
          </label>
        </div>

        {/* 出門&回家時間選擇 */}
        <div className="setTime">
          <label htmlFor="go-out-time" className="setTime__outLabel"><h3>出門時間</h3></label>
          <label htmlFor="go-home-time" className="setTime__backLabel"><h3>回家時間</h3></label>
          {/* //將選擇的日期、出門或回家時間，傳入TimeOption */}
          <TimeOption onChange={(e) => { setGoOutTime(e.target.value) }} date={date} defaultTime={goOutTime} />
          <TimeOption onChange={(e) => { setGoHomeTime(e.target.value) }} date={date} defaultTime={goHomeTime} />
          {/* 預設msg為""，但若當Out & back time validate成立的話msg = "出門時間要大於目前時間" */}
          <span className="setTime__validateText">{msg}</span>
        </div>

        {/*  交通工具 */}
        <h3>交通工具</h3>
        <div className="traffic">
          {/* walk */}
          <input type="radio" id="walk" value="walk" className="traffic__walkinput" onChange={(event) => setTraffic(event.target.value)} checked={traffic === "walk"}></input>
          <label htmlFor="walk" className="traffic__walklabel">
            {/* icon套件 ion-icon https://ionic.io/ionicons */}
            {/* name是ion-icon的參數 */}
            <ion-icon name="walk" className="traffic__walklabel--icon"></ion-icon>
          </label>
          {/* bike or moto */}
          <input type="radio" id="moto" value="moto" onChange={(event) => setTraffic(event.target.value)} checked={traffic === "moto"} ></input>
          <label htmlFor="moto">
            <ion-icon name="bicycle"></ion-icon>
          </label>
          {/* car */}
          <input type="radio" id="car" value="car" onChange={(event) => setTraffic(event.target.value)} checked={traffic === "car"} ></input>
          <label htmlFor="car">
            <ion-icon name="car-sport"></ion-icon>
          </label>
          {/* car */}
          <input type="radio" id="bus" value="bus" onChange={(event) => setTraffic(event.target.value)} checked={traffic === "bus"} ></input>
          <label htmlFor="bus">
            <ion-icon name="bus"></ion-icon>
          </label>
        </div>

        <h3>地區</h3>
        <div className="area">
          {/* 縣市選擇 */}  
                                             {/* e為option中的value */}
          <select className="area__input" onChange={(e) => changeArea(e)}>
            {/* city import from rawData  */}
            {/* e.g. city = [ ['宜蘭縣', 'F-D0047-001'], ['桃園市', 'F-D0047-005'],['新竹縣', 'F-D0047-009'] ] */}
            {city.map((data) => {
              return (
                // 顯示給user的只有data[0]，但存入的資料為整個Array，因需要data[1]的API參數
                <option key={data} value={data}>{data[0]}</option>
              )
            })}
          </select>
          {/* 市區選擇 */}                                
                                                                   {/* e為option中的value */}
          <select className="area__input" value={district} onChange={(e) => setDistrict(e.target.value)}>
            {/* 顯示的資料根據region(縣市資料['桃園市', 'F-D0047-001']) 選取[0]的縣市 */}
            {/* 桃園市': [    '中壢區','平鎮區','龍潭區','楊梅區','新屋區', '觀音區'.. ] */}
            {districts[region[0]].map((data, num) => {
              return (
                <option key={data} value={data}>{data}</option>
              )
            })}
          </select>
        </div>
        {/* Subbit Button */}
        <div className="subbmit">
          {/* 當msg不會空或null時，將button設定成disable */}
          <button disabled={msg && true} className="subbmit__btn" onClick={handleSubmit}> What Should I Wear? </button>
        </div>
      </form>
    </div>
  )
}

export default Home