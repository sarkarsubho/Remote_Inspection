import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Camera from "./components/Camera";
import CameraApp from "./components/Zoomin";
import CameraComponent from "./components/StopStream";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* <Camera /> */}
      {/* <CameraApp/> */}
      <CameraComponent/>
    </>
  );
}

export default App;
