import "./App.scss";
import { useState } from "react";
import Home from "./Page/Home/Home";
import Result from "./Page/Result/Result";
import LandingPage from "./Page/LandingPage/LangingPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { WeatherContext } from "./Contexts/WeatherContext";
import logo from "./Assets/img/logo.png";

function App() {
  //溫度 -> object
  const [weatherTemp, setWeatherTemp] = useState();
  //降雨機率 --> object
  const [pop, setPop] = useState();
  //Form資料整理 --> object
  const [formData, setFormData] = useState();
  return (
    <div className="App" style={{ position: "relative" }}>
      <WeatherContext.Provider
        value={{
          weatherTemp,
          setWeatherTemp,
          pop,
          setPop,
          formData,
          setFormData,
        }}
      >
        <Router>
          <div className="logoDiv">
            <Link to="/">
              <img className="logoDiv__img" src={logo} />
            </Link>
            <span className="logoDiv__span">WHAT SHOULD I WEAR?</span>
          </div>
          <Routes>
            <Route path="/" element={<LandingPage />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/result" element={weatherTemp && <Result />}></Route>
            <Route
              path="*"
              element={
                <h1
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                  }}
                >
                  PAGE NOT FOUND
                </h1>
              }
            ></Route>
          </Routes>
        </Router>
      </WeatherContext.Provider>
    </div>
  );
}

export default App;
