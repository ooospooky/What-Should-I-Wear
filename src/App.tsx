import "./App.scss";
import Home from "./Page/Home/Home";
import LandingPage from "./Page/LandingPage/LangingPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { QueryProvider } from "./providers/QueryProvider";
import logo from "./Assets/img/logo.png";
import ResultWrapper from "./Page/Result/ResultWrapper";

function App() {
  return (
    <div className="App" style={{ position: "relative" }}>
      <QueryProvider>
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
              <Route path="/result" element={<ResultWrapper />}></Route>
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
      </QueryProvider>
    </div>
  );
}

export default App;
