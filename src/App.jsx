import "./App.css";
import Camera from "./components/Camera";
import ImageGallery from "./components/ImageGallery";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <div>
        <Camera />
        <ImageGallery />
      </div>
    </div>
  );
}

export default App;
