import React, { useState } from 'react'
import './Home.scss';
import CitySelect from '../../Components/CitySelect'
import {city,districts} from '../../Assets/rawData'
////////
// set region and district default
////
function Home() {
  const [goOutTime, setGoOutTime] = useState('');
  const [goHomeTime, setGoHomeTime] = useState('');
  const [traffic, setTraffic] = useState('');
  const [region, setRegion] = useState('基隆市')
  const [district,setDistrict] = useState(districts[region][0])
  const handleSubmit = (event) => {
    console.log(goOutTime, goHomeTime)
    console.log(traffic)
    console.log(region)
    console.log(district)
    event.preventDefault();
  }
  const onChangeValue = (event) => {
    setTraffic(event.target.value);
  }
  const changeArea = (e) => {
    console.log('e',e.target.value)
      setRegion(e.target.value) ;
      setDistrict(districts[e.target.value][0][0]);
  }

  return (
    <div className="Home">
      <form onSubmit={handleSubmit}>
        {/* 出門&回家 */}
        <div className="setTime">
          <label htmlFor="go-out-time" className="setTime__outLabel">出門時間</label>
          <label htmlFor="go-home-time" className="setTime__backLabel">回家時間</label>
          <input type="text" id="go-out-time" className="setTime__outInput" onChange={(e) => { setGoOutTime(e.target.value) }} ></input>
          <input type="text" id="go-home-time" className="setTime__backInput" onChange={(e) => { setGoHomeTime(e.target.value) }}></input>
        </div>
        {/*  */}
        {/*  交通工具 */}
        <h3>交通工具</h3>
        <div className="traffic">
          {/* walk */}
          <input type="radio" id="walk" value="walk" className="traffic__walkinput" onChange={onChangeValue} checked={traffic === "walk"}></input>
          <label htmlFor="walk" className="traffic__walklabel">
            <ion-icon name="walk"  className="traffic__walklabel--icon"></ion-icon>
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
        <select id="dec" default={region} onChange={(e)=>changeArea(e)}>
          {city.map((data)=>{
            return (
              <option value={data}>{data}</option>
            )
          })}
        </select>
        {/* {console.log(districts[region],'teset',region)} */}
        <select default={district} value={district} onChange={(e) => setDistrict(e.target.value)}>
        {districts[region].map((data,num)=>{
            return(
              <option value={data[0]}>{data[0]}</option>
            )
          })}
        </select>

        <input type="submit" value="What Should I Wear?" />

      </form>
    </div>
  )
}

export default Home