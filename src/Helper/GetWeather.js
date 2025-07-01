import axios from "axios";

export const GetWeather = async ({
  setWeatherTemp,
  setPop,
  dateRange,
  locationId,
  locationName,
}) => {
  const res = await axios.get(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${locationId}?Authorization=CWB-25DEA212-F3AA-4FDB-B05C-30DEF7E737DC&&LocationName=${locationName}${dateRange}`
  );
  //weatherElement 為Array，包含溫度、降雨率、舒適度等等 使用天氣綜合描述在(每三小時溫度）
  try {
    const locationData = res.data["records"]["Locations"][0].Location[0];
    let weatherElement = locationData["WeatherElement"];
    let temp = {};
    let pop = {};

    const weatherDescriptionData = weatherElement.find(
      ({ ElementName }) => ElementName === "天氣預報綜合描述"
    ).Time;
    console.log("weatherDescriptionData", weatherDescriptionData);
    weatherDescriptionData.forEach(({ StartTime }, index) => {
      const weatherDescription =
        weatherDescriptionData[index].ElementValue[0].WeatherDescription;

      const rainMatch = weatherDescription.match(/降雨機率(\d+)%/);
      const rainProbability = rainMatch ? parseInt(rainMatch[1], 10) : null;

      const tempMatch = weatherDescription.match(/溫度攝氏(\d+)/);
      const temperature = tempMatch ? parseInt(tempMatch[1], 10) : null;
      const objKeyName = StartTime.slice(11, 13);
      //最後一個為隔天的清晨12點，為避免與當天凌晨12點衝突，使用NextDay00來做keyName
      if (index === weatherDescriptionData.length - 1) {
        temp["Nextday00"] = temperature;
        pop["Nextday00"] = rainProbability;
      } else {
        //其餘都用正常objKeyName-->00,03,06,09,12,15......
        temp[objKeyName] = temperature;
        pop[objKeyName] = rainProbability;
      }
    });
    setWeatherTemp(temp);
    setPop(pop);
  } catch (error) {
    console.log("error", error);
  }
};
