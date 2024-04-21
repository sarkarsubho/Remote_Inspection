import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Camera from "./components/Camera";
import CameraApp from "./components/Zoomin";
import CameraComponent from "./components/StopStream";
import Navbar from "./components/Navbar";
import ImageGallery from "./components/ImageGallery";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div >
      <Navbar />
      <div>
        <Camera />
        <ImageGallery />
      </div>

      {/* <CameraApp/> */}
      {/* <CameraComponent/> */}
    </div>
  );
}

export default App;
