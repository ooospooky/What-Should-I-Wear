import { Player } from "@lottiefiles/react-lottie-player";
import salesman from "../Assets/animation/salesman.json";

export const LoadingSpinner = () => (
  <div className="flex min-h-screen w-full items-center justify-center bg-gradient-primary">
    <Player className="h-96 w-96" autoplay loop src={salesman} />
  </div>
);
