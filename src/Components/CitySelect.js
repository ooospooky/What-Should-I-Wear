import React from 'react'

export default function CitySelect() {
  const city = [
    "基隆市",
    "台北市",
    "新北市",
    "桃園市",
    "新竹市",
    "新竹縣",
    "苗栗縣",
    "台中市",
    "彰化縣",
    "南投縣",
    "雲林縣",
    "嘉義市",
    "嘉義縣",
    "台南市",
    "高雄市",
    "屏東縣",
    "台東縣",
    "花蓮縣",
    "宜蘭縣",
    "澎湖縣",
    "金門縣",
    "連江縣" ];
  return (
    <div>
      CitySelect
      
      <select id="dec" >
          {city.map((data)=>{
            return(
              <option value={data}>{data}</option>
            )
          })}
      </select>
        
      <select>
        
      </select>  
      </div>
  )
}
