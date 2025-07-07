import { useState } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import { useNavigate } from "react-router-dom";

import salesman from "../../Assets/animation/salesman.json";
import landingpageMan from "../../Assets/animation/landingpageMan.json";

const TransitionAnimation = () => (
  <div className="h-view flex w-full animate-fade-in items-center justify-center bg-gradient-primary">
    <Player className="h-96 w-96" autoplay loop src={salesman} />
  </div>
);

const LandingTitle = () => (
  <h1 className="-mt-6 mb-4 text-2xl font-semibold sm:-mt-4 sm:mb-2 sm:text-3xl md:mb-4 md:mt-2 md:text-4xl lg:mb-0 lg:mt-4 lg:text-5xl">
    Alleviate Your Worries: Dress Suggestions for Any Weather
  </h1>
);

const LandingSubtitle = () => (
  <h3 className="-mt-2 mb-4 text-lg font-normal sm:mb-6 sm:mt-0 sm:text-xl md:-mt-4 md:mb-6 md:text-2xl">
    Whether you're heading to work, going out for activities, our service
    provides accurate weather-based dress suggestions to help you effortlessly
    adapt to different climate conditions. Forget the hassle of deciding what to
    wear!
  </h3>
);

const GetStartedButton = ({ onClick }: { onClick: () => void }) => (
  <button
    onClick={onClick}
    className="rounded-lg border-0 bg-white px-8 py-4 text-lg font-medium leading-4 tracking-wide text-primary-light transition-colors duration-200 hover:cursor-pointer hover:bg-blue-50 sm:px-10 sm:py-5 sm:text-xl md:px-12 md:py-5"
  >
    Get started
  </button>
);

const LandingAnimation = () => (
  <div className="ml-4 mt-4 flex w-full items-center justify-center sm:ml-2 sm:mt-2 sm:w-1/2 md:-mt-8 md:ml-0 md:w-1/2 lg:-mt-4 lg:ml-0 lg:w-1/2">
    <Player className="landing-animation" autoplay loop src={landingpageMan} />
  </div>
);

function LandingPage() {
  const [showTransition, setShowTransition] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setShowTransition(true);
    setTimeout(() => {
      navigate("/home");
    }, 700);
  };

  if (showTransition) {
    return <TransitionAnimation />;
  }

  return (
    <div className="h-view w-full bg-primary">
      <div className="container mx-auto flex h-full flex-col-reverse items-start justify-start px-8 py-8 sm:px-12 sm:py-12 md:flex-row md:items-center md:justify-center md:px-16 md:py-16">
        {/* 左側內容區域 */}
        <div className="w-full space-y-4 text-white sm:space-y-6 md:w-1/2">
          <LandingTitle />
          <LandingSubtitle />
          <GetStartedButton onClick={handleClick} />
        </div>

        {/* 右側動畫區域 */}
        <LandingAnimation />
      </div>
    </div>
  );
}

export default LandingPage;
