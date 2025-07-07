import Home from "./Page/Home/Home";
import LandingPage from "./Page/LandingPage/LangingPage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { QueryProvider } from "./providers/QueryProvider";
import logo from "./Assets/img/logo.png";
import ResultWrapper from "./Page/Result/ResultWrapper";

function App() {
  return (
    <div className="relative">
      <QueryProvider>
        <Router>
          <div className="absolute left-16 top-6 z-1 flex items-center iphoneXR:hidden">
            <Link to="/">
              <img className="mr-2.5 h-10 w-10" src={logo} />
            </Link>
            <span className="font-brand text-xl font-bold text-white">
              WHAT SHOULD I WEAR?
            </span>
          </div>
          <Routes>
            <Route path="/" element={<LandingPage />}></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/result" element={<ResultWrapper />}></Route>
            <Route
              path="*"
              element={
                <h1 className="flex items-center justify-center">
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
