import { Player } from "@lottiefiles/react-lottie-player";
import salesman from "../Assets/animation/salesman.json";

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner = ({ fullScreen = true }: LoadingSpinnerProps) => {
  const containerStyle = fullScreen
    ? {
        height: "100vh",
      }
    : {};

  return (
    <div className="transition__div" style={containerStyle}>
      <Player
        className="transitionAnimation"
        autoplay
        loop
        src={salesman}
        style={{ height: "500px", width: "500px" }}
      />
    </div>
  );
};
